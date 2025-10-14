#!/bin/bash

# MealMate Deployment Script
# Run this script on your server to deploy the application

set -e

echo "🚀 Starting MealMate deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
sudo apt install -y nginx mysql-server python3 python3-pip python3-venv nodejs npm

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
APP_DIR="/var/www/mealmate"
echo "📁 Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files (excluding git and other unnecessary files)
echo "📋 Copying application files..."
rsync -av --exclude='.git' --exclude='node_modules' --exclude='__pycache__' --exclude='*.pyc' . $APP_DIR/
cd $APP_DIR

# Create production environment files
echo "⚙️ Creating production environment files..."
# Backend environment
cat > backend/.env << EOF
GOOGLE_API_KEY=AIzaSyBIL0HjmH3DOjf1nUelkV88qcFVOZ6cf50
DB_HOST=localhost
DB_USER=fitness_user
DB_PASSWORD=fitness123
DB_NAME=fitnessdb
DB_PORT=3306
SECRET_KEY=your_super_secret_key_here_minimum_32_characters
EOF

# Frontend environment (for production build)
cat > frontend/.env << EOF
REACT_APP_API_BASE_URL=/api
NODE_ENV=production
EOF

# Setup Database
echo "🗄️ Setting up MySQL database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS fitnessdb;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'fitness_user'@'localhost' IDENTIFIED BY 'fitness123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON fitnessdb.* TO 'fitness_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import database schema
echo "📊 Importing database schema..."
sudo mysql fitnessdb < database/fitness_DB.sql

# Setup Backend
echo "🐍 Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
echo "⚛️ Setting up React frontend..."
cd ../frontend
npm install
npm run build

# Create PM2 ecosystem file
echo "🔧 Creating PM2 configuration..."
cd ..
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mealmate-backend',
    cwd: './backend',
    script: './venv/bin/uvicorn',
    args: 'api.main:app --host 0.0.0.0 --port 8000',
    interpreter: 'none',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Create Nginx configuration
echo "🌐 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/mealmate << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Frontend
    location / {
        root $APP_DIR/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Handle CORS preflight requests
    location ~ ^/api/(.*) {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

# Enable Nginx site
echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/mealmate /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

echo "✅ Deployment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit $APP_DIR/backend/.env with your actual API keys"
echo "2. Update the server_name in /etc/nginx/sites-available/mealmate"
echo "3. Run: sudo systemctl reload nginx"
echo "4. Start the backend: cd $APP_DIR && pm2 start ecosystem.config.js"
echo "5. Save PM2 processes: pm2 save && pm2 startup"
echo ""
echo "🌐 Your application will be available at http://your-domain.com"
