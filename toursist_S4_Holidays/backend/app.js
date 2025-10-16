const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(compression());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Optimized MongoDB connection for Vercel
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Reduced from 30000
      socketTimeoutMS: 10000, // Reduced from 45000
      maxPoolSize: 10, // Connection pooling
      minPoolSize: 2,
      maxIdleTimeMS: 10000,
      connectTimeoutMS: 5000,
    };

    await mongoose.connect(process.env.MONGO_URI, opts);
    
    cachedDb = mongoose.connection;
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    throw err;
  }
};

// Connect on startup
connectDB().catch(err => console.error('Initial connection failed:', err));

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected - will reconnect');
});

// API Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB(); // Ensure connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'S4 Holidays API Server',
    status: 'running',
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

// For Vercel serverless
const PORT = process.env.PORT || 5000;

// Only listen if not on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
