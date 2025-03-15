-- Drop database if exists
DROP DATABASE IF EXISTS fitnessdb;

-- Create database
CREATE DATABASE fitnessdb;

-- Use the database
USE fitnessdb;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mealplan table
CREATE TABLE mealplans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    mealplan LONGTEXT NOT NULL,
    title VARCHAR(255) NOT NULL
);

-- Drop MySQL user if exists
DROP USER IF EXISTS 'fitness_user'@'localhost';

-- Create MySQL user for application
CREATE USER 'fitness_user'@'localhost' IDENTIFIED BY 'fitness123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON fitnessdb.* TO 'fitness_user'@'localhost';
FLUSH PRIVILEGES;
