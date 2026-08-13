// middleware/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { getJwtSecret } = require('../lib/jwt');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required - No token provided',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format. Use: Bearer <token>',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required - Empty token',
      });
    }

    const jwtSecret = getJwtSecret();
    console.log('🔐 Auth middleware - JWT_SECRET length:', jwtSecret.length);
    console.log('🔐 Auth middleware - Token preview:', token.substring(0, 30) + '...');

    const decoded = jwt.verify(token, jwtSecret);
    console.log('✅ Token verified. User ID:', decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        phone: true,
        avatar: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('❌ Auth Error:', error.message);
    console.error('❌ Error Name:', error.name);
    console.error('❌ Error Stack:', error.stack);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: `Invalid token - ${error.message}`,
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Authentication error: ' + error.message,
    });
  }
};

// ============================================================
// AUTHORIZE MIDDLEWARE - Supports ADMIN and USER roles
// ============================================================

// For ADMIN-only routes (create, update, delete services)
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  console.log('🔐 AuthorizeAdmin - User role:', req.user.role);

  // Only allow ADMIN role
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: `Access denied. Only ADMIN users can perform this action. Your role: ${req.user.role}`,
    });
  }

  next();
};

// For USER routes (view services, book appointments)
const authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  console.log('🔐 AuthorizeUser - User role:', req.user.role);

  // Allow both ADMIN and USER roles
  if (req.user.role !== 'ADMIN' && req.user.role !== 'USER') {
    return res.status(403).json({
      success: false,
      error: `Access denied. Your role: ${req.user.role}`,
    });
  }

  next();
};

// Generic authorize function (backward compatible)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    console.log('🔐 Authorize - User role:', req.user.role);
    console.log('🔐 Authorize - Required roles:', roles);

    // Check if user has any of the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = { auth, authorize, authorizeAdmin, authorizeUser };