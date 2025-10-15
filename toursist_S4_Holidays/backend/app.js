const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect MongoDB Atlas with improved error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('🔍 Check your .env file and MongoDB Atlas Network Access settings');
    console.error('🔧 Make sure 0.0.0.0/0 is whitelisted in MongoDB Atlas');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

// API Routes (MUST BE BEFORE SSR HANDLER)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// SSR Configuration
const isProduction = process.env.NODE_ENV === 'production';
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendPath = path.resolve(__dirname, '../frontend');

if (isProduction) {
  // Production: Serve static files and SSR
  const clientPath = path.join(frontendDistPath, 'client');
  const serverPath = path.join(frontendDistPath, 'server');
  
  // Serve static assets
  app.use(express.static(clientPath, { index: false }));
  
  // SSR Handler for all frontend routes (Express 5 compatible)
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }

    try {
      const template = fs.readFileSync(
        path.join(clientPath, 'index.html'),
        'utf-8'
      );

      const { render } = require(path.join(serverPath, 'entry-server.js'));
      const { html: appHtml, head: headTags } = render(req.url);

      const html = template
        .replace('<!--ssr-head-->', headTags || '')
        .replace('<!--ssr-outlet-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.error('SSR Error:', error);
      res.status(500).end(error.message);
    }
  });
} else {
  // Development: Use Vite dev server
  const { createServer: createViteServer } = require('vite');
  
  createViteServer({
    root: frontendPath,  // Tell Vite where frontend folder is
    server: { middlewareMode: true },
    appType: 'custom'
  }).then((vite) => {
    app.use(vite.middlewares);

    // SSR Handler for all frontend routes (Express 5 compatible)
    app.use(async (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }

      try {
        const url = req.originalUrl;

        let template = fs.readFileSync(
          path.join(frontendPath, 'index.html'),
          'utf-8'
        );

        template = await vite.transformIndexHtml(url, template);

        const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
        const { html: appHtml, head: headTags } = render(url);

        const html = template
          .replace('<!--ssr-head-->', headTags || '')
          .replace('<!--ssr-outlet-->', appHtml);

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error('SSR Error:', error);
        res.status(500).end(error.message);
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Start server after database connection
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT} and accessible from network`);
    console.log(`🌐 Mode: ${isProduction ? 'PRODUCTION (SSR)' : 'DEVELOPMENT (SSR)'}`);
    console.log('🔐 Secure OTP system initialized');
    console.log('📧 Email service configured for s4holidaysblr@gmail.com');
    console.log('🌐 Network access enabled - accessible at 192.168.1.6:' + PORT);
    console.log('🏥 Health check: http://localhost:' + PORT + '/api/health');
  });
};

startServer();
