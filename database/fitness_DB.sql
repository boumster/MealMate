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

-- Create MySQL user for application
CREATE USER 'fitness_user'@'localhost' IDENTIFIED BY 'fitness123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON fitnessdb.* TO 'fitness_user'@'localhost';
FLUSH PRIVILEGES;
