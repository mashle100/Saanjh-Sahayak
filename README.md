# Saanjh-Sahayak

## Overview
Saanjh-Sahayak is a project designed to assist users by providing seamless integration between a backend server and a frontend application. The backend is powered by Express, and the frontend is built using React. This README file will guide you through the installation, setup, and usage of the project.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Environment Variables](#environment-variables)
- [Fonts](#fonts)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Backend
1. **Change directory to `backend`:**
   ```bash
   cd backend
2. **Install necessary packages:**
    ```bash
    npm install express cors bcrypt dotenv jsonwebtoken mongoose react-router-dom
3. **Create a `.env` file:**
    ```env
    MONGODB_URI="" # your MongoDB connection string
    JWT_SECRET="" # any string which is hard to predict

### Frontend
1. **Change directory to `frontend`:**
    ```bash
    cd frontend
2. **Install necessary packages:**
    ```bash
    npm install axios react react-dom react-router-dom react-scripts web-vitals

# Usage
## Starting the Server
### 1. open two command terminals in split mode
### 2. In the 1st command terminal:
* Change directory to  `frontend` :
    ```bash
    cd frontend
* Start the frontend server:
    ```bash
    npm start
### 3. In the 2nd command terminal:
* Change directory to `backend` :
    ```bash
    cd backend
* Start the backend server:
    ```bash
    node server.js
