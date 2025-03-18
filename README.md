# Saanjh Sahayak

## Overview

Saanjh Sahayak is an elderly home management system designed to help staff and doctors efficiently manage patient records. This system allows staff members to add and maintain health records for elderly residents, while doctors can securely access these records for better healthcare management.

## Features

### User Authentication

- Staff and doctors must sign up and log in.

- Secure authentication for data privacy.

### Patient Management

- Staff can add new patients.

- Existing patients’ health records can be updated by staff.

- Staff can view all previous health records of a patient.

### Access Control

- Staff members can grant and revoke doctors' access to patient records.

- Doctors can view patient records but cannot add or modify them.

### Health Record Management

- Staff can add new health records for patients.

- All records are maintained for future reference and analysis.

### Doctor’s Role

- Doctors can access patient records shared by staff.

- Doctors can make clinical decisions based on available records.

## Technology Stack
React.js, Node.js, Express.js, MongoDB, JWT

Authentication: JWT-based authentication
### Backend
1. **Change directory to backend:**
   ```bash
   cd backend
2. **Install necessary packages:**
    ```bash
    npm install express cors bcrypt dotenv jsonwebtoken mongoose react-router-dom
3. **Create a .env file:**
    ```.env
    MONGODB_URI="" # your MongoDB connection string
    JWT_SECRET="" # any string which is hard to predict

### Frontend
1. **Change directory to `frontend`:**
    ```bash
    cd frontend
2. *Install necessary packages:*
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
