// backend/src/routes/services.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads/services');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'service-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const { departmentId, includeInactive, location, search } = req.query;
    
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (includeInactive !== 'true') {
      where.isActive = true;
    }
    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
    });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service',
    });
  }
});

// Create service with image upload (Admin only)
router.post('/',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('departmentId').optional(),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  ],
  async (req, res) => {
    try {
      console.log('📝 Request body after multer:', req.body);
      console.log('📁 Uploaded file:', req.file);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { 
        name, description, price, duration, departmentId, 
        location, category, isActive 
      } = req.body;

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Name is required'
        });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Description is required'
        });
      }

      // Check if department exists (only if departmentId is provided)
      if (departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: departmentId },
        });
        if (!department) {
          return res.status(400).json({
            success: false,
            error: 'Department not found',
          });
        }
      }

      // Handle image upload
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/services/${req.file.filename}`;
      }

      // Parse price and duration
      let parsedPrice = null;
      if (price !== undefined && price !== null && price !== '') {
        parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          return res.status(400).json({
            success: false,
            error: 'Invalid price value. Please enter a valid positive number.',
          });
        }
      }

      let parsedDuration = null;
      if (duration !== undefined && duration !== null && duration !== '') {
        parsedDuration = parseInt(duration);
        if (isNaN(parsedDuration) || parsedDuration < 1) {
          return res.status(400).json({
            success: false,
            error: 'Invalid duration value. Please enter a positive integer.',
          });
        }
      }

      // Check if service with same name exists at same location
      const existing = await prisma.service.findFirst({
        where: { 
          name: name.trim(),
          location: location || 'Afilas General Hospital'
        },
      });
      
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'A service with this name already exists at this location. Please use a different name.',
        });
      }

      // Create service
      const service = await prisma.service.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          price: parsedPrice,
          duration: parsedDuration,
          image: imageUrl,
          departmentId: departmentId || null,
          location: location || 'Afilas General Hospital',
          isActive: isActive !== undefined ? isActive : true,
        },
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      console.log(`✅ Service created successfully: ${service.name}`);
      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully',
      });
    } catch (error) {
      console.error('❌ Create service error:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'A service with this name already exists. Please use a different name.',
        });
      }
      
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create service. Please try again.',
      });
    }
  }
);

// Update service with image upload (Admin only)
router.put('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'),
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('departmentId').optional(),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        name, description, price, duration, isActive, departmentId,
        location, category
      } = req.body;

      console.log('📝 Update body:', req.body);
      console.log('📁 Update file:', req.file);

      const existing = await prisma.service.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      // Check if department exists (only if departmentId is provided)
      if (departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: departmentId },
        });
        if (!department) {
          return res.status(400).json({
            success: false,
            error: 'Department not found',
          });
        }
      }

      // Handle image upload
      let imageUrl = existing.image;
      if (req.file) {
        if (existing.image) {
          const oldImagePath = path.join(__dirname, '../../public', existing.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = `/uploads/services/${req.file.filename}`;
      }

      // Parse price and duration
      let parsedPrice = existing.price;
      if (price !== undefined && price !== null && price !== '') {
        parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          return res.status(400).json({
            success: false,
            error: 'Invalid price value. Please enter a valid positive number.',
          });
        }
      }

      let parsedDuration = existing.duration;
      if (duration !== undefined && duration !== null && duration !== '') {
        parsedDuration = parseInt(duration);
        if (isNaN(parsedDuration) || parsedDuration < 1) {
          return res.status(400).json({
            success: false,
            error: 'Invalid duration value. Please enter a positive integer.',
          });
        }
      }

      // Check if service with same name exists (excluding current)
      if (name && name.trim() !== existing.name) {
        const duplicate = await prisma.service.findFirst({
          where: { 
            name: name.trim(),
            location: location || existing.location,
            id: { not: id }
          },
        });
        if (duplicate) {
          return res.status(400).json({
            success: false,
            error: 'A service with this name already exists at this location.',
          });
        }
      }

      const updated = await prisma.service.update({
        where: { id },
        data: {
          name: name ? name.trim() : existing.name,
          description: description ? description.trim() : existing.description,
          price: parsedPrice,
          duration: parsedDuration,
          image: imageUrl,
          isActive: isActive !== undefined ? isActive : existing.isActive,
          departmentId: departmentId !== undefined ? departmentId : existing.departmentId,
          location: location || existing.location,
        },
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: 'Service updated successfully',
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update service',
      });
    }
  }
);

// Toggle service status (Admin only)
router.patch('/:id/toggle-status',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      const updated = await prisma.service.update({
        where: { id },
        data: {
          isActive: !service.isActive,
        },
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: updated,
        message: `Service ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Toggle service status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle service status',
      });
    }
  }
);

// Delete service (Admin only)
router.delete('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.service.findUnique({
        where: { id },
        include: {
          appointments: {
            where: {
              status: { notIn: ['CANCELLED', 'COMPLETED'] },
            },
          },
        },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      if (existing.appointments.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete service with active appointments',
        });
      }

      // Delete image if exists
      if (existing.image) {
        const imagePath = path.join(__dirname, '../../public', existing.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.service.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete service',
      });
    }
  }
);

// Get services by department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Get services by department error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
    });
  }
});

// Get services stats (Admin only)
router.get('/stats',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { location } = req.query;
      
      const where = {};
      if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
        where.location = location;
      }

      const [total, active, inactive, byLocation] = await Promise.all([
        prisma.service.count({ where }),
        prisma.service.count({ where: { ...where, isActive: true } }),
        prisma.service.count({ where: { ...where, isActive: false } }),
        prisma.service.groupBy({
          by: ['location'],
          _count: true,
        }),
      ]);

      const locationStats = {};
      byLocation.forEach(item => {
        locationStats[item.location] = item._count;
      });

      res.json({
        success: true,
        data: {
          total,
          active,
          inactive,
          byLocation: locationStats,
        },
      });
    } catch (error) {
      console.error('Get service stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch service statistics',
      });
    }
  }
);

module.exports = router;