# Book Exchange Platform

A web application that enables users to exchange books with others. List your books, search for books, and manage your collection.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm

### Step-by-Step Installation

#### 1. Test MongoDB Connection

First, ensure MongoDB is running properly:
```bash
# Test MongoDB
mongod

# If you see error "data directory not found":
# For Windows:
md \data\db

# For Mac/Linux:
sudo mkdir -p /data/db
sudo chmod 777 /data/db

# Try mongod again after creating directory
mongod
```

If you see MongoDB server starting successfully, proceed to next step. If not, check Troubleshooting section below.

#### 2. Start Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Create .env file with following content:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/book-exchange
JWT_SECRET=your_secret_key_here

# Start backend server
npm start

# You should see:
# Server running on port 5000
# MongoDB Connected: localhost
```

#### 3. Start Frontend Application
```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend
npm start

# Browser should open to http://localhost:3000
```

### Troubleshooting Common Issues

#### MongoDB Issues

If `mongod` command fails:
```bash
# Check if MongoDB is already running
# Windows:
tasklist /FI "IMAGENAME eq mongod.exe"

# Mac/Linux:
ps aux | grep mongod

# If running, kill the process:
# Windows:
taskkill /F /IM mongod.exe

# Mac/Linux:
sudo killall mongod

# Clear MongoDB lock:
# Windows:
cd \data\db
del mongod.lock

# Mac/Linux:
sudo rm /data/db/mongod.lock

# Try starting MongoDB again
mongod
```

#### Backend Issues

If `npm start` fails in backend:
```bash
# Check if port 5000 is in use
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000

# Ensure MongoDB is running
mongod

# Check .env file exists and has correct values
```

#### Frontend Issues

If `npm install` fails:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Try install again
npm install
```

## Features

### User Authentication
- Register/Login
- Password Reset
- Secure Authentication

### Book Management
- Add Books
- Edit Books
- Delete Books
- Search Books

### Search Features
- Title Search
- Author Search
- Genre Filter
- Location Filter

## API Routes

### Auth Routes
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgotpassword
PUT /api/auth/resetpassword/:resetToken
```

### Book Routes
```
POST /api/books
GET /api/books
GET /api/books/search
PUT /api/books/:id
DELETE /api/books/:id
```

## Common Commands

Start MongoDB:
```bash
mongod
```

Start Backend:
```bash
cd backend
npm start
```

Start Frontend:
```bash
cd frontend
npm install  # First time only
npm start
```

## Important Notes

1. Always ensure MongoDB is running before starting backend
2. Keep separate terminal windows for:
   - MongoDB
   - Backend server
   - Frontend server
3. Check MongoDB connection before starting development
4. Install dependencies when running first time

## Need Help?

If you encounter any issues:
1. Ensure MongoDB is running
2. Verify all environment variables
3. Check console for error messages
4. Follow troubleshooting steps above

## License

MIT License