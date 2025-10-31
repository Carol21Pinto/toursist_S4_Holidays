const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(compression());

// ✅ FIXED CORS - ALLOW SPECIFIC ORIGINS WITH CREDENTIALS
app.use(cors({
  origin: ['https://s4holidays.com', 'https://www.s4holidays.com', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ CRITICAL: Connection caching for serverless
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('⚡ Using cached DB connection');
    return cachedConnection;
  }

  try {
    // Disconnect existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const opts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1, // ← CRITICAL for Vercel
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGO_URI, opts);
    cachedConnection = mongoose.connection;
    
    console.log('✅ MongoDB Connected:', mongoose.connection.name);
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB Error:', err.message);
    throw err;
  }
}

// ✅ CRITICAL: Middleware to ensure connection before all API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection middleware error:', error);
    res.status(503).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// API Routes (AFTER connection middleware)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      database: dbStatus,
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'error',
      error: err.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'S4 Holidays API Server',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      health: '/api/health',
      packages: '/api/packages',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
