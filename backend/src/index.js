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

// Import routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const dashboardRoutes = require('./routes/dashboard');
const serviceRoutes = require('./routes/services');
const uploadRoutes = require('./routes/upload');
const userRoutes = require('./routes/users');
// ✅ ADD THIS: Import pharma orders routes
const pharmaOrdersRoutes = require('./routes/pharmaOrders');

const app = express();

// ===== MIDDLEWARE (Must come before routes) =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// Static files - serve the actual uploads directory
// ============================================================
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Serving uploads from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
// ============================================================

// ===== NOTIFICATION DATA (In-memory storage) =====
let notifications = [];
let notificationIdCounter = 1;

// Helper function to get user ID from request
const getUserId = (req) => {
  if (req.user?.id) return req.user.id;
  if (req.user?.userId) return req.user.userId;
  // For development, use a default admin ID
  return 'admin-123';
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
};

// Create sample notifications
const createSampleNotifications = (userId) => {
  const now = new Date();
  return [
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'New appointment booked by John Doe',
      message: 'Dr. Smith has a new appointment with patient John Doe at 2:30 PM tomorrow.',
      type: 'appointment',
      read: false,
      createdAt: new Date(now.getTime() - 5 * 60000).toISOString(),
    },
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'Patient feedback received from Sarah Smith',
      message: 'Patient Sarah Smith submitted feedback with rating 4.5 stars.',
      type: 'patient',
      read: false,
      createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
    },
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'Dr. Johnson schedule updated for tomorrow',
      message: 'Dr. Johnson has updated their schedule. 2 new slots available.',
      type: 'doctor',
      read: true,
      createdAt: new Date(now.getTime() - 3 * 3600000).toISOString(),
    },
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'System maintenance scheduled for tonight',
      message: 'Maintenance at 11:00 PM. Expected downtime: 30 minutes.',
      type: 'system',
      read: true,
      createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(),
    },
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'New patient registered: Michael Brown',
      message: 'A new patient has registered at Afilas General Hospital.',
      type: 'patient',
      read: true,
      createdAt: new Date(now.getTime() - 2 * 24 * 3600000).toISOString(),
    },
    {
      id: notificationIdCounter++,
      userId: userId,
      title: 'Lab results ready for patient Emily Wilson',
      message: 'Lab results are now available. Please review.',
      type: 'general',
      read: true,
      createdAt: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(),
    },
  ];
};

// ===== NOTIFICATION ROUTES =====

// TEST ROUTE - To verify the route is working
app.get('/api/notifications/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Notification routes are working!',
    timestamp: new Date().toISOString(),
    totalNotifications: notifications.length
  });
});

// GET /api/notifications - Get all notifications
app.get('/api/notifications', (req, res) => {
  try {
    const userId = getUserId(req);
    
    let userNotifications = notifications.filter(n => n.userId === userId);
    if (userNotifications.length === 0) {
      const samples = createSampleNotifications(userId);
      notifications = [...notifications, ...samples];
      userNotifications = notifications.filter(n => n.userId === userId);
    }
    
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    const formatted = userNotifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message || '',
      time: getTimeAgo(n.createdAt),
      read: n.read,
      type: n.type || 'general',
      createdAt: n.createdAt,
    }));
    
    res.json({ 
      success: true,
      notifications: formatted, 
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET /api/notifications/unread/count
app.get('/api/notifications/unread/count', (req, res) => {
  try {
    const userId = getUserId(req);
    const count = notifications.filter(n => n.userId === userId && !n.read).length;
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get count' });
  }
});

// PATCH /api/notifications/:id/read
app.patch('/api/notifications/:id/read', (req, res) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);
    
    const notification = notifications.find(n => n.id === id && n.userId === userId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.read = true;
    notification.readAt = new Date().toISOString();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// PATCH /api/notifications/read/all
app.patch('/api/notifications/read/all', (req, res) => {
  try {
    const userId = getUserId(req);
    let count = 0;
    
    notifications = notifications.map(n => {
      if (n.userId === userId && !n.read) {
        count++;
        return { ...n, read: true, readAt: new Date().toISOString() };
      }
      return n;
    });
    
    res.json({ success: true, updatedCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// DELETE /api/notifications/:id
app.delete('/api/notifications/:id', (req, res) => {
  try {
    const userId = getUserId(req);
    const id = parseInt(req.params.id);
    
    const index = notifications.findIndex(n => n.id === id && n.userId === userId);
    if (index === -1) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    notifications.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// POST /api/notifications - Create new
app.post('/api/notifications', (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, message, type } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const notification = {
      id: notificationIdCounter++,
      userId,
      title,
      message: message || '',
      type: type || 'general',
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    notifications.push(notification);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

// GET /api/notifications/sample - Create samples
app.get('/api/notifications/sample', (req, res) => {
  try {
    const userId = getUserId(req);
    notifications = notifications.filter(n => n.userId !== userId);
    const samples = createSampleNotifications(userId);
    notifications = [...notifications, ...samples];
    
    res.json({ 
      success: true, 
      message: `Created ${samples.length} sample notifications`,
      count: samples.length 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sample notifications' });
  }
});

// ============================================================
// ✅ ADD THIS: Register Pharma Orders Routes
// ============================================================
console.log('📦 Registering pharma orders routes...');
app.use('/api/pharma-orders', pharmaOrdersRoutes);
console.log('✅ Pharma orders routes registered at /api/pharma-orders');

// ===== REGULAR API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// ===== HEALTH AND ROOT ROUTES =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    server: 'Afilas Hospital API',
    jwt_configured: !!process.env.JWT_SECRET,
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Afilas Hospital API is running',
    version: '1.0.0',
    jwt_configured: !!process.env.JWT_SECRET,
  });
});

// ===== ERROR HANDLING (Must be after all routes) =====
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

// 404 handler - This must be LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT: ${process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing!'}`);
  console.log(`CORS enabled for: http://localhost:3000`);
  console.log(`\n Available API endpoints:`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/dashboard/stats`);
  console.log(`   - GET  /api/dashboard/chart`);
  console.log(`   - GET  /api/appointments`);
  console.log(`   - GET  /api/doctors`);
  console.log(`   - GET  /api/services`);
  console.log(`   - GET  /api/blog`);
  console.log(`   - GET  /api/contact`);
  console.log(`   - POST /api/upload`);
  console.log(`   - GET  /api/users`);
  console.log(`   - GET  /api/notifications/test`);
  console.log(`   - GET  /api/notifications`);
  console.log(`   - GET  /api/notifications/unread/count`);
  console.log(`   - PATCH /api/notifications/:id/read`);
  console.log(`   - PATCH /api/notifications/read/all`);
  console.log(`   - DELETE /api/notifications/:id`);
  console.log(`   - POST /api/notifications`);
  console.log(`   - GET  /api/notifications/sample`);
  console.log(`   ✅ NEW: GET  /api/pharma-orders`);
  console.log(`   ✅ NEW: POST /api/pharma-orders`);
  console.log(`   ✅ NEW: PATCH /api/pharma-orders/:id/status`);
  console.log(`   ✅ NEW: DELETE /api/pharma-orders/:id`);
});

module.exports = app;