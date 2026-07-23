// app.js
require('dotenv').config();

// ===== FIX: Verify JWT_SECRET is loaded =====
console.log('🔐 Environment Check:');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ MISSING!');
console.log('  PORT:', process.env.PORT || 5000);
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ MISSING!');

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not defined in .env file!');
  console.error('Please add JWT_SECRET=your-secret-key to .env file');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const galleryRoutes = require('./routes/gallery');
const newsRoutes = require('./routes/news');
const contactRoutes = require('./routes/contact');
const dashboardRoutes = require('./routes/dashboard');
const serviceRoutes = require('./routes/services');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// CORS - Allow frontend to connect
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);

// Health check - ADDED JWT STATUS
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    server: 'Afilas Hospital API',
    jwt_configured: !!process.env.JWT_SECRET,
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Afilas Hospital API is running',
    version: '1.0.0',
    jwt_configured: !!process.env.JWT_SECRET,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing!'}`);
  console.log(` CORS enabled for: http://localhost:3000`);
});

module.exports = app;