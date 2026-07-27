// backend/src/routes/users.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const { role, search, location } = req.query;
    
    const where = {};
    if (role) where.role = role;
    if (location && location !== 'all') where.location = location;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        location: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        location: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

// Create user
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'USER']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, password, phone, role, location, isActive } = req.body;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone || '',
        role: role,
        location: location || 'Afilas General Hospital',
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

// Update user
router.put('/:id', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'USER']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, location, isActive, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check email if changed
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    const updateData = {
      name: name,
      email: email,
      phone: phone || '',
      role: role,
      location: location || 'Afilas General Hospital',
      isActive: isActive !== undefined ? isActive : user.isActive,
    };

    // Only update password if provided
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

// Toggle user status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const updated = await prisma.user.update({
      where: { id: id },
      data: { isActive: isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        location: true,
      },
    });

    res.json({
      success: true,
      data: updated,
      message: isActive ? 'User activated successfully' : 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle user status',
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Prevent deleting the last SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      const superAdmins = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      });
      if (superAdmins <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete the last Super Admin',
        });
      }
    }

    await prisma.user.delete({
      where: { id: id },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const [total, byRole, byLocation, activeCount, inactiveCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.groupBy({
        by: ['location'],
        _count: true,
      }),
      prisma.user.count({
        where: { isActive: true },
      }),
      prisma.user.count({
        where: { isActive: false },
      }),
    ]);

    const roleStats = {};
    byRole.forEach(item => {
      roleStats[item.role] = item._count;
    });

    const locationStats = {};
    byLocation.forEach(item => {
      locationStats[item.location] = item._count;
    });

    res.json({
      success: true,
      data: {
        total,
        byRole: roleStats,
        byLocation: locationStats,
        active: activeCount,
        inactive: inactiveCount,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
    });
  }
});

module.exports = router;