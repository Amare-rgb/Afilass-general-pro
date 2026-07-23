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
    const { departmentId, includeInactive } = req.query;
    
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (includeInactive !== 'true') {
      where.isActive = true;
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
// IMPORTANT: multer MUST come BEFORE validation
router.post('/',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'), // Multer first to parse FormData
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('departmentId').notEmpty().withMessage('Department ID is required'),
  ],
  async (req, res) => {
    try {
      // Log received data after multer has parsed it
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

      const { name, description, price, duration, departmentId } = req.body;

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

      if (!departmentId) {
        return res.status(400).json({
          success: false,
          error: 'Department ID is required'
        });
      }

      // Check if department exists
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        return res.status(400).json({
          success: false,
          error: 'Department not found',
        });
      }

      // Handle image upload
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/services/${req.file.filename}`;
      }

      // Parse price and duration - handle empty strings and undefined
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

      // Create service
      const service = await prisma.service.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          price: parsedPrice,
          duration: parsedDuration,
          image: imageUrl,
          departmentId: departmentId,
          isActive: true,
        },
        include: {
          department: true,
        },
      });

      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully',
      });
    } catch (error) {
      console.error('❌ Create service error:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'A service with this name already exists. Please use a different name.',
        });
      }
      
      // Handle other errors
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create service. Please try again.',
      });
    }
  }
);

// Update service with image upload (Admin only)
// IMPORTANT: multer MUST come BEFORE validation
router.put('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, isActive, departmentId } = req.body;

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
        // Delete old image if exists
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

      const updated = await prisma.service.update({
        where: { id },
        data: {
          name: name || existing.name,
          description: description || existing.description,
          price: parsedPrice,
          duration: parsedDuration,
          image: imageUrl,
          isActive: isActive !== undefined ? isActive : existing.isActive,
          departmentId: departmentId || existing.departmentId,
        },
        include: {
          department: true,
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

module.exports = router;