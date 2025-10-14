#!/bin/bash

# MealMate Clean Deployment Script
# This script handles permission issues and provides better error handling

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting MealMate deployment...${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Variables
APP_DIR="/var/www/mealmate"
CURRENT_DIR=$(pwd)

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Update system
echo -e "${GREEN}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install required packages
echo -e "${GREEN}📦 Installing required packages...${NC}"
sudo apt install -y nginx mysql-server python3 python3-pip python3-venv nodejs npm rsync

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Create application directory with proper permissions
echo -e "${GREEN}📁 Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clean previous deployment if exists
if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
    print_warning "Cleaning previous deployment..."
    rm -rf $APP_DIR/*
fi

# Copy application files safely
echo -e "${GREEN}📋 Copying application files...${NC}"
rsync -av \
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='__pycache__/' \
    --exclude='*.pyc' \
    --exclude='venv/' \
    --exclude='.env' \
    --exclude='build/' \
    "$CURRENT_DIR/" "$APP_DIR/"

# Verify copy was successful
if [ ! -d "$APP_DIR/backend" ] || [ ! -d "$APP_DIR/frontend" ]; then
    print_error "Failed to copy application files properly"
    exit 1
fi

cd $APP_DIR
print_status "Application files copied successfully"

# Setup Database
echo -e "${GREEN}🗄️ Setting up MySQL database...${NC}"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS fitnessdb;" 2>/dev/null || true
sudo mysql -e "CREATE USER IF NOT EXISTS 'fitness_user'@'localhost' IDENTIFIED BY 'fitness123';" 2>/dev/null || true
sudo mysql -e "GRANT ALL PRIVILEGES ON fitnessdb.* TO 'fitness_user'@'localhost';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

# Import database schema
if [ -f "database/fitness_DB.sql" ]; then
    echo -e "${GREEN}📊 Importing database schema...${NC}"
    mysql -u fitness_user -pfitness123 fitnessdb < database/fitness_DB.sql
    print_status "Database schema imported"
else
    print_warning "Database schema file not found"
fi

# Create production environment files
echo -e "${GREEN}⚙️ Creating production environment files...${NC}"

# Backend environment
cat > backend/.env << 'EOF'
GOOGLE_API_KEY=AIzaSyBIL0HjmH3DOjf1nUelkV88qcFVOZ6cf50
DB_HOST=localhost
DB_USER=fitness_user
DB_PASSWORD=fitness123
DB_NAME=fitnessdb
DB_PORT=3306
SECRET_KEY=your_super_secret_key_here_minimum_32_characters_change_this_in_production
EOF

# Frontend environment
cat > frontend/.env << 'EOF'
REACT_APP_API_BASE_URL=/api
NODE_ENV=production
EOF

print_status "Environment files created"

# Setup Backend
echo -e "${GREEN}🐍 Setting up Python backend...${NC}"
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

print_status "Backend setup completed"

# Setup Frontend
echo -e "${GREEN}⚛️ Setting up React frontend...${NC}"
cd ../frontend

# Install dependencies
npm install

# Build for production (with Node.js 18 compatibility)
NODE_OPTIONS=--openssl-legacy-provider npm run build

print_status "Frontend build completed"

# Create PM2 ecosystem file
echo -e "${GREEN}🔧 Creating PM2 configuration...${NC}"
cd ..
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mealmate-backend',
    cwd: './backend',
    script: './venv/bin/uvicorn',
    args: 'api.main:app --host 0.0.0.0 --port 8000',
    interpreter: 'none',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Create Nginx configuration
echo -e "${GREEN}🌐 Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/mealmate << EOF
server {
    listen 80;
    server_name localhost;  # Change this to your domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Frontend
    location / {
        root $APP_DIR/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        rewrite ^/api(.*)$ \$1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
echo -e "${GREEN}🔗 Configuring Nginx...${NC}"
sudo ln -sf /etc/nginx/sites-available/mealmate /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
    sudo systemctl reload nginx
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

echo -e "${GREEN}✅ Deployment setup complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Generate a secure secret key:"
echo "   openssl rand -hex 32"
echo "2. Edit $APP_DIR/backend/.env and replace SECRET_KEY"
echo "3. Start the backend:"
echo "   cd $APP_DIR && pm2 start ecosystem.config.js"
echo "4. Save PM2 configuration:"
echo "   pm2 save && pm2 startup"
echo "5. If using a domain, update server_name in /etc/nginx/sites-available/mealmate"
echo ""
echo -e "${GREEN}🌐 Your application will be available at http://localhost${NC}"
echo -e "${GREEN}📊 API documentation at http://localhost/api/docs${NC}"
