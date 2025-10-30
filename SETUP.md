# Bus Tracking and Booking App - Setup Guide

## Project Overview

This is a comprehensive bus tracking and booking application with three main components:

- **Server**: Backend API built with Node.js, Express, TypeScript, and Prisma (MongoDB)
- **Driver App**: React Native/Expo app for bus drivers
- **User App**: React Native/Expo app for passengers

## Project Structure

```
Bus_Tracking_App/
├── server/                 # Backend API server
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema and migrations
│   ├── utils/             # Utility functions
│   ├── middleware/        # Express middleware
│   └── generated/         # Prisma client
├── driver/                # Driver mobile app (Expo/React Native)
│   ├── app/               # App screens and navigation
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components
│   ├── assets/            # Images, fonts, icons
│   ├── themes/            # App theming
│   └── utils/             # Helper functions
├── user/                  # User mobile app (Expo/React Native)
│   ├── app/               # App screens and navigation
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components
│   ├── assets/            # Images, fonts, icons
│   ├── themes/            # App theming
│   └── utils/             # Helper functions
├── files/                 # Static files and configurations
└── package.json           # Root package.json (monorepo setup)
```

## Prerequisites

Before setting up the project, ensure you have the following installed:

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **MongoDB**: Local installation or MongoDB Atlas account
- **Expo CLI**: For running React Native apps
- **Android Studio**: For Android development (optional)
- **Xcode**: For iOS development (optional, macOS only)

### Development Tools
- **Git**: For version control
- **VS Code**: Recommended IDE with TypeScript support
- **Expo Go**: Mobile app for testing on physical devices

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Bus_Tracking_App
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service

### 4. Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/bus_tracking?retryWrites=true&w=majority"
# OR for local MongoDB:
# DATABASE_URL="mongodb://localhost:27017/bus_tracking"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-here"

# Twilio (for SMS OTP - optional)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Expo Public Server URI (for mobile apps)
EXPO_PUBLIC_SERVER_URI="http://localhost:8080"
```

## Backend Setup (Server)

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:8080`

### 5. Verify Server
Open `http://localhost:8080` in your browser - you should see "Hello World!"

## Driver App Setup

### 1. Navigate to Driver Directory
```bash
cd ../driver
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create/update `.env` file in `driver/` directory:
```env
EXPO_PUBLIC_SERVER_URI=http://localhost:8080
```

### 4. Start Development Server
```bash
npm start
```

### 5. Run on Device/Emulator
- **Expo Go**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a` in terminal
- **iOS Simulator**: Press `i` in terminal (macOS only)
- **Web**: Press `w` in terminal

## User App Setup

### 1. Navigate to User Directory
```bash
cd ../user
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create/update `.env` file in `user/` directory:
```env
EXPO_PUBLIC_SERVER_URI=http://localhost:8080
```

### 4. Start Development Server
```bash
npm start
```

### 5. Run on Device/Emulator
- **Expo Go**: Scan QR code with Expo Go app
- **Android Emulator**: Press `a` in terminal
- **iOS Simulator**: Press `i` in terminal (macOS only)
- **Web**: Press `w` in terminal

## API Endpoints

### User Routes (`/api/v1`)
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/profile` - Get user profile

### Driver Routes (`/api/v1/driver`)
- `POST /api/v1/driver/register-bus` - Driver and bus registration
- `POST /api/v1/driver/login` - Driver login
- `GET /api/v1/driver/profile` - Get driver profile
- `POST /api/v1/driver/check-duplicate` - Check for duplicate entries

### Bus Routes (`/api/v1/bus`)
- `GET /api/v1/bus/routes` - Get available routes
- `POST /api/v1/bus/book` - Book a bus ride

## Database Schema

### Models
- **User**: Passenger information
- **Driver**: Driver and vehicle information
- **Route**: Bus routes and stops
- **BusStand**: Bus stop locations
- **Rides**: Ride bookings and history

## Development Workflow

### Running All Services
1. **Terminal 1**: Start backend server
   ```bash
   cd server && npm run dev
   ```

2. **Terminal 2**: Start driver app
   ```bash
   cd driver && npm start
   ```

3. **Terminal 3**: Start user app
   ```bash
   cd user && npm start
   ```

### Testing API Endpoints
Use tools like Postman, Insomnia, or curl to test API endpoints.

Example curl command:
```bash
curl -X POST http://localhost:8080/api/v1/driver/register-bus \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": "temp-1234567890",
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "busNumber": "KL-07-AB-1234",
    "departureTime": "08:30",
    "arrivalTime": "16:45",
    "operatedRoutes": "City Center to Airport"
  }'
```

## Deployment

### Backend Deployment
1. Build the application:
   ```bash
   cd server
   npm run build
   npm start
   ```

2. Deploy to services like Heroku, Railway, or Vercel

### Mobile Apps Deployment
1. **Driver App**:
   ```bash
   cd driver
   npx expo build:android  # or build:ios
   ```

2. **User App**:
   ```bash
   cd user
   npx expo build:android  # or build:ios
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:8080 | xargs kill -9`

2. **Database connection failed**:
   - Check DATABASE_URL in `.env`
   - Ensure MongoDB is running (local) or Atlas cluster is accessible

3. **Expo app won't start**:
   - Clear Expo cache: `expo r -c`
   - Restart Metro bundler

4. **Dependencies issues**:
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Getting Help
- Check the TODO.md files for known issues
- Review server logs for backend errors
- Use Expo DevTools for mobile app debugging

## Technologies Used

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (planned)
- **SMS**: Twilio (optional)

### Mobile Apps
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React hooks
- **Maps**: React Native Maps
- **Styling**: Custom themes and styles

### Development Tools
- **Build Tool**: TypeScript compiler
- **Testing**: Jest (configured for driver app)
- **Linting**: ESLint (if configured)
- **Version Control**: Git

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
