// middleware/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { getJwtSecret } = require('../lib/jwt');

// ===== USE THE SAME FUNCTION AS AUTH ROUTES =====
// const JWT_SECRET = getJwtSecret(); // Use this instead of hardcoding

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

    // ===== FIX: Use the SAME function as auth routes =====
    const jwtSecret = getJwtSecret();
    console.log('🔐 Auth middleware - JWT_SECRET length:', jwtSecret.length);
    console.log('🔐 Auth middleware - Token preview:', token.substring(0, 30) + '...');

    // Verify token with the SAME secret
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

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions. Required roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { auth, authorize };