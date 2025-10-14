# Docker Deployment Guide for MealMate

## Quick Start with Docker

### Prerequisites
- Docker installed on your server
- Docker Compose installed

### Environment Setup

Your application now uses the following environment files:

1. **Main Docker Compose variables** (`.env`):
   - Database configuration for Docker containers

2. **Backend environment** (`backend/.env`):
   - Google API key
   - Database connection details
   - Secret key for authentication

3. **Frontend environment** (`frontend/.env`):
   - API base URL configuration

### Deployment Steps

1. **Clone your repository** to your server:
   ```bash
   git clone <your-repo-url> /var/www/mealmate
   cd /var/www/mealmate
   ```

2. **Verify environment files** are properly configured:
   ```bash
   # Check if all environment files exist
   ls -la .env backend/.env frontend/.env
   ```

3. **Update the SECRET_KEY** in `backend/.env`:
   ```bash
   # Generate a secure secret key
   openssl rand -hex 32
   
   # Edit the backend/.env file and replace the SECRET_KEY value
   nano backend/.env
   ```

4. **Build and start the containers**:
   ```bash
   docker-compose up -d --build
   ```

5. **Verify all services are running**:
   ```bash
   docker-compose ps
   ```

### Service URLs

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8000
- **Database**: localhost:3306

### Environment File Details

#### `.env` (Docker Compose variables)
```bash
MYSQL_ROOT_PASSWORD=fitness123
MYSQL_DATABASE=fitnessdb
MYSQL_USER=fitness_user
MYSQL_PASSWORD=fitness123
COMPOSE_PROJECT_NAME=mealmate
```

#### `backend/.env`
```bash
GOOGLE_API_KEY=your_google_api_key_here
DB_HOST=database
DB_USER=fitness_user
DB_PASSWORD=fitness123
DB_NAME=fitnessdb
DB_PORT=3306
SECRET_KEY=your_32_character_secret_key_here
```

#### `frontend/.env`
```bash
REACT_APP_API_BASE_URL=http://localhost/api
```

### Production Deployment

For production, update these values:

1. **Frontend URL**: Change `REACT_APP_API_BASE_URL` to your domain
   ```bash
   REACT_APP_API_BASE_URL=https://your-domain.com/api
   ```

2. **Secure passwords**: Change database passwords in both `.env` files

3. **SSL termination**: Add an SSL reverse proxy (nginx) or use Traefik

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Access database
docker-compose exec database mysql -u fitness_user -p fitnessdb

# Backend shell access
docker-compose exec backend bash

# View running containers
docker-compose ps
```

### Troubleshooting

1. **Database connection issues**:
   ```bash
   # Check if database container is healthy
   docker-compose logs database
   
   # Verify environment variables
   docker-compose exec backend env | grep DB_
   ```

2. **Frontend not loading**:
   ```bash
   # Check frontend build
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose build frontend
   ```

3. **API not accessible**:
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Test API directly
   curl http://localhost:8000/docs
   ```

### Security Notes

- Change default passwords before production deployment
- Use strong secret keys
- Consider using Docker secrets for sensitive data
- Implement proper firewall rules
- Use HTTPS in production
