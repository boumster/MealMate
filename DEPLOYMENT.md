# MealMate Server Deployment Guide

## Overview
This guide will help you deploy your MealMate application on your own server.

## Architecture
- **Frontend**: React app served by Nginx
- **Backend**: FastAPI server running with Uvicorn
- **Database**: MySQL
- **Reverse Proxy**: Nginx
- **Process Management**: PM2 or systemd

## Prerequisites

### Server Requirements
- Ubuntu/Debian Linux server
- At least 2GB RAM
- 20GB+ disk space
- Domain name (optional but recommended)

### Software Requirements
- Node.js 20+
- Python 3.9+
- MySQL 8.0+
- Nginx

## Quick Deployment

### Option 1: Automated Script
1. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

3. Follow the post-deployment steps below.

### Option 2: Manual Deployment

#### Step 1: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install packages
sudo apt install -y nginx mysql-server python3 python3-pip python3-venv nodejs npm

# Install PM2
sudo npm install -g pm2
```

#### Step 2: Setup Database
```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -e "CREATE DATABASE fitnessdb;"
sudo mysql -e "CREATE USER 'mealmate'@'localhost' IDENTIFIED BY 'your_secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON fitnessdb.* TO 'mealmate'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import schema
sudo mysql fitnessdb < database/fitness_DB.sql
```

#### Step 3: Setup Backend
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your actual values
nano .env
```

#### Step 4: Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create production build
npm run build
```

#### Step 5: Configure Nginx
```bash
# Copy the nginx configuration
sudo cp /path/to/mealmate.conf /etc/nginx/sites-available/mealmate

# Enable the site
sudo ln -s /etc/nginx/sites-available/mealmate /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### Step 6: Start Backend Service

**Option A: Using PM2**
```bash
cd /var/www/mealmate
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Option B: Using systemd**
```bash
sudo cp mealmate-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mealmate-backend
sudo systemctl start mealmate-backend
```

## Configuration

### Environment Variables
Update these files with your actual values:

#### Backend (.env)
- `DATABASE_PASSWORD`: Your MySQL password
- `GOOGLE_API_KEY`: Your Google Gemini API key
- `SECRET_KEY`: A secure random string (32+ characters)

#### Frontend (.env)
- `REACT_APP_API_BASE_URL`: Your server's API URL

### Domain Configuration
1. Point your domain to your server's IP address
2. Update `server_name` in the Nginx configuration
3. Consider setting up SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Monitoring and Maintenance

### Check Service Status
```bash
# Check backend status (PM2)
pm2 status

# Check backend status (systemd)
sudo systemctl status mealmate-backend

# Check nginx status
sudo systemctl status nginx

# Check MySQL status
sudo systemctl status mysql
```

### View Logs
```bash
# Backend logs (PM2)
pm2 logs mealmate-backend

# Backend logs (systemd)
sudo journalctl -u mealmate-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Create backup
mysqldump -u mealmate -p fitnessdb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u mealmate -p fitnessdb < backup_file.sql
```

## Security Considerations

1. **Firewall**: Configure UFW or iptables
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **SSL Certificate**: Use Let's Encrypt for HTTPS
3. **Database Security**: Use strong passwords and limit access
4. **Regular Updates**: Keep system and dependencies updated
5. **Backup Strategy**: Regular database and file backups

## Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check environment variables
   - Verify database connection
   - Check Python virtual environment

2. **Frontend not loading**:
   - Verify build was successful
   - Check Nginx configuration
   - Ensure API URL is correct

3. **Database connection errors**:
   - Verify MySQL is running
   - Check credentials in .env
   - Ensure database exists

4. **CORS errors**:
   - Update allowed origins in main.py
   - Check Nginx CORS headers

### Getting Help
- Check application logs
- Verify all services are running
- Test each component individually

## Performance Optimization

1. **Enable Gzip compression** in Nginx
2. **Use a CDN** for static assets
3. **Implement caching** strategies
4. **Monitor resource usage** with tools like htop
5. **Database optimization** with proper indexing

## Scaling
- Use Docker for containerization
- Implement load balancing for multiple instances
- Consider database replication for high availability
- Use Redis for session storage and caching
