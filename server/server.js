// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Global variables for connection state
// let isMongoConnected = false;
// let mongoConnectionError = null;

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5175',
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Request logging middleware
// app.use((req, res, next) => {
//   console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err);
//   res.status(500).json({ 
//     error: 'Internal Server Error',
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // MongoDB Connection with better error handling
// const connectMongoDB = async () => {
//   try {
//     console.log('🔄 Connecting to MongoDB...');
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/staff_management', {
//       serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//       socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
//     });
    
//     isMongoConnected = true;
//     mongoConnectionError = null;
//     console.log('✅ Connected to MongoDB successfully');
//     console.log(`📍 Database: ${mongoose.connection.db.databaseName}`);
//   } catch (err) {
//     isMongoConnected = false;
//     mongoConnectionError = err.message;
//     console.error('❌ MongoDB connection failed:', err.message);
//     console.log('⚠️  Server will continue with limited functionality');
//   }
// };

// // Initialize MongoDB connection
// connectMongoDB();

// // MongoDB connection event handlers
// mongoose.connection.on('disconnected', () => {
//   isMongoConnected = false;
//   console.log('⚠️  MongoDB disconnected');
// });

// mongoose.connection.on('reconnected', () => {
//   isMongoConnected = true;
//   mongoConnectionError = null;
//   console.log('✅ MongoDB reconnected');
// });

// // Routes - with MongoDB availability check
// app.use('/api/staff', (req, res, next) => {
//   if (!isMongoConnected) {
//     return res.status(503).json({ 
//       error: 'Database unavailable', 
//       message: 'MongoDB is not connected. Please try again later.',
//       suggestion: 'Use JSON mode server instead: npm run server:json'
//     });
//   }
//   next();
// }, require('./routes/staff'));

// app.use('/api/hotels', (req, res, next) => {
//   if (!isMongoConnected) {
//     return res.status(503).json({ error: 'Database unavailable' });
//   }
//   next();
// }, require('./routes/hotels'));

// app.use('/api/companies', (req, res, next) => {
//   if (!isMongoConnected) {
//     return res.status(503).json({ error: 'Database unavailable' });
//   }
//   next();
// }, require('./routes/companies'));

// app.use('/api/departments', (req, res, next) => {
//   if (!isMongoConnected) {
//     return res.status(503).json({ error: 'Database unavailable' });
//   }
//   next();
// }, require('./routes/departments'));

// // Enhanced health check with database status
// app.get('/api/health', (req, res) => {
//   const healthStatus = {
//     status: 'OK',
//     message: 'Staff Management API is running',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     database: {
//       connected: isMongoConnected,
//       type: isMongoConnected ? 'MongoDB' : 'Unavailable',
//       error: mongoConnectionError
//     },
//     endpoints: {
//       staff: '/api/staff',
//       hotels: '/api/hotels',
//       companies: '/api/companies',
//       departments: '/api/departments'
//     }
//   };

//   const statusCode = isMongoConnected ? 200 : 503;
//   res.status(statusCode).json(healthStatus);
// });

// // API documentation endpoint
// app.get('/api', (req, res) => {
//   res.json({
//     name: 'Staff Management API',
//     version: '1.0.0',
//     description: 'RESTful API for managing hotel staff data',
//     endpoints: {
//       'GET /api/health': 'System health check',
//       'GET /api/staff': 'Get all staff members',
//       'POST /api/staff': 'Create new staff member',
//       'PUT /api/staff/:id': 'Update staff member',
//       'DELETE /api/staff/:id': 'Delete staff member',
//       'POST /api/staff/bulk': 'Bulk create staff members',
//       'GET /api/hotels': 'Get all hotels',
//       'GET /api/companies': 'Get all companies',
//       'GET /api/departments': 'Get all departments'
//     },
//     database: {
//       status: isMongoConnected ? 'Connected' : 'Disconnected',
//       type: 'MongoDB'
//     }
//   });
// });

// // 404 handler for API routes
// app.use('/api/*', (req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `API endpoint ${req.originalUrl} not found`,
//     availableEndpoints: '/api'
//   });
// });

// // Graceful shutdown handling
// process.on('SIGTERM', async () => {
//   console.log('📤 SIGTERM received. Shutting down gracefully...');
//   await mongoose.connection.close();
//   process.exit(0);
// });

// process.on('SIGINT', async () => {
//   console.log('📤 SIGINT received. Shutting down gracefully...');
//   await mongoose.connection.close();
//   process.exit(0);
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log('🎉 ================================');
//   console.log('🚀 Staff Management API Server');
//   console.log('🎉 ================================');
//   console.log(`📍 Server: http://localhost:${PORT}`);
//   console.log(`📊 API: http://localhost:${PORT}/api`);
//   console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
//   console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
//   console.log(`🗄️  Database: ${isMongoConnected ? 'MongoDB Connected' : 'MongoDB Unavailable'}`);
//   console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log('🎉 ================================');
  
//   if (!isMongoConnected) {
//     console.log('⚠️  💡 Tip: Start JSON server instead with: npm run server:json');
//   }
// });

// // Handle server errors
// server.on('error', (err) => {
//   console.error('❌ Server error:', err);
//   if (err.code === 'EADDRINUSE') {
//     console.error(`💡 Port ${PORT} is already in use. Try a different port.`);
//   }
// });
