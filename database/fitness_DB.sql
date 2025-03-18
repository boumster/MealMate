-- Drop database if exists
DROP DATABASE IF EXISTS fitnessdb;

-- Create database
CREATE DATABASE fitnessdb;

-- Use the database
USE fitnessdb;

-- Create users table with UUID
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mealplan table with UUID and foreign key constraint
CREATE TABLE mealplans (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    mealplan LONGTEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    day_images LONGTEXT DEFAULT NULL CHECK (JSON_VALID(day_images)),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Drop MySQL user if exists
DROP USER IF EXISTS 'fitness_user'@'localhost';

-- Create MySQL user for application
CREATE USER 'fitness_user'@'localhost' IDENTIFIED BY 'fitness123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON fitnessdb.* TO 'fitness_user'@'localhost';
FLUSH PRIVILEGES;
