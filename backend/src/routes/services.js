// backend/src/routes/services.js
const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file upload - FIXED PATH
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // FIX: Use uploads directory directly (not public/uploads)
    const uploadDir = path.join(__dirname, '../../uploads/services');
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
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

const validateName = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Service name is required');
  }
  if (value.trim().length < 3) {
    throw new Error('Service name must be at least 3 characters');
  }
  if (value.trim().length > 100) {
    throw new Error('Service name must be less than 100 characters');
  }
  return value.trim();
};

const validateDescription = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Description is required');
  }
  if (value.trim().length < 10) {
    throw new Error('Description must be at least 10 characters');
  }
  if (value.trim().length > 500) {
    throw new Error('Description must be less than 500 characters');
  }
  return value.trim();
};

const validatePrice = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error('Price must be a valid number');
  }
  if (num < 0) {
    throw new Error('Price cannot be negative');
  }
  if (num > 999999) {
    throw new Error('Price cannot exceed 999,999');
  }
  return num;
};

const validateDuration = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    throw new Error('Duration must be a valid number');
  }
  if (num < 5) {
    throw new Error('Duration must be at least 5 minutes');
  }
  if (num > 480) {
    throw new Error('Duration cannot exceed 480 minutes (8 hours)');
  }
  return num;
};

const validateCategory = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Category is required');
  }
  if (value.trim().length > 50) {
    throw new Error('Category must be less than 50 characters');
  }
  return value.trim();
};

const validateLocation = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Afilas General Hospital';
  }
  if (value.trim().length > 100) {
    throw new Error('Location must be less than 100 characters');
  }
  return value.trim();
};

const validateIsActive = (value) => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

// ============================================================
// HELPERS
// ============================================================

function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // FIX: Remove leading slash if it exists for proper URL construction
  let cleanPath = imagePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  return `http://localhost:5000/${cleanPath}`;
}

// ============================================================
// ROUTES
// ============================================================

// Get all services
router.get('/', [
  query('departmentId').optional().isString().withMessage('Invalid department ID'),
  query('includeInactive').optional().isBoolean().withMessage('includeInactive must be a boolean'),
  query('location').optional().isString().withMessage('Location must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { departmentId, includeInactive, location, search } = req.query;
    
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (includeInactive !== 'true') {
      where.isActive = true;
    }
    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    // Build full image URLs
    const mappedServices = services.map(service => ({
      ...service,
      image: buildImageUrl(service.image)
    }));

    res.json({
      success: true,
      data: mappedServices,
      count: mappedServices.length,
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
router.get('/:id', [
  param('id').isString().withMessage('Invalid service ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

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

    res.json({
      success: true,
      data: {
        ...service,
        image: buildImageUrl(service.image)
      },
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service',
    });
  }
});

// ============================================================
// FIXED: Create service - Only ADMIN role required
// ============================================================
router.post('/',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  upload.single('image'),
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string')
      .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    
    body('description')
      .notEmpty().withMessage('Description is required')
      .isString().withMessage('Description must be a string')
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    
    body('price')
      .optional()
      .isNumeric().withMessage('Price must be a number')
      .custom(value => value >= 0).withMessage('Price cannot be negative')
      .custom(value => value <= 999999).withMessage('Price cannot exceed 999,999'),
    
    body('duration')
      .optional()
      .isInt({ min: 5, max: 480 }).withMessage('Duration must be between 5 and 480 minutes'),
    
    body('category')
      .notEmpty().withMessage('Category is required')
      .isString().withMessage('Category must be a string')
      .isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
    
    body('location')
      .optional()
      .isString().withMessage('Location must be a string')
      .isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
    
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
  ],
  async (req, res) => {
    try {
      console.log('📝 Request body:', req.body);
      console.log('📁 Uploaded file:', req.file);
      console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
      }

      const { name, description, price, duration, category, location, isActive } = req.body;

      // Validate required fields
      let validatedData = {};
      try {
        validatedData.name = validateName(name);
        validatedData.description = validateDescription(description);
        validatedData.price = validatePrice(price);
        validatedData.duration = validateDuration(duration);
        validatedData.category = validateCategory(category);
        validatedData.location = validateLocation(location);
        validatedData.isActive = validateIsActive(isActive);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Check if service with same name exists at same location
      const existing = await prisma.service.findFirst({
        where: {
          name: validatedData.name,
          location: validatedData.location,
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: `A service with name "${validatedData.name}" already exists at ${validatedData.location}. Please use a different name.`,
        });
      }

      // Handle image upload - FIXED PATH
      let imageUrl = null;
      if (req.file) {
        // Store relative path without public
        imageUrl = `/uploads/services/${req.file.filename}`;
        console.log('📁 Image saved:', imageUrl);
      } else {
        // Check if image is provided in the request body as base64 or URL
        if (req.body.image && req.body.image.startsWith('http')) {
          imageUrl = req.body.image;
        }
      }

      // Create service
      const service = await prisma.service.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          duration: validatedData.duration,
          image: imageUrl,
          location: validatedData.location,
          isActive: validatedData.isActive,
        },
      });

      console.log(`✅ Service created successfully: ${service.name}`);
      res.status(201).json({
        success: true,
        data: {
          ...service,
          image: buildImageUrl(service.image)
        },
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

// ============================================================
// FIXED: Update service - Only ADMIN role required
// ============================================================
router.put('/:id',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  upload.single('image'),
  [
    param('id').isString().withMessage('Invalid service ID'),
    
    body('name')
      .optional()
      .isString().withMessage('Name must be a string')
      .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .isString().withMessage('Description must be a string')
      .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
    
    body('price')
      .optional()
      .isNumeric().withMessage('Price must be a number')
      .custom(value => value >= 0).withMessage('Price cannot be negative')
      .custom(value => value <= 999999).withMessage('Price cannot exceed 999,999'),
    
    body('duration')
      .optional()
      .isInt({ min: 5, max: 480 }).withMessage('Duration must be between 5 and 480 minutes'),
    
    body('category')
      .optional()
      .isString().withMessage('Category must be a string')
      .isLength({ max: 50 }).withMessage('Category must be less than 50 characters'),
    
    body('location')
      .optional()
      .isString().withMessage('Location must be a string')
      .isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
    
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log('📝 Update body:', req.body);
      console.log('📁 Update file:', req.file);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
      }

      const { name, description, price, duration, category, location, isActive } = req.body;

      // Check if service exists
      const existing = await prisma.service.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      // Validate data
      let validatedData = {};
      try {
        if (name !== undefined) validatedData.name = validateName(name);
        if (description !== undefined) validatedData.description = validateDescription(description);
        if (price !== undefined) validatedData.price = validatePrice(price);
        if (duration !== undefined) validatedData.duration = validateDuration(duration);
        if (category !== undefined) validatedData.category = validateCategory(category);
        if (location !== undefined) validatedData.location = validateLocation(location);
        if (isActive !== undefined) validatedData.isActive = validateIsActive(isActive);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError.message,
        });
      }

      // Check if service with same name exists (excluding current)
      if (validatedData.name && validatedData.name !== existing.name) {
        const duplicate = await prisma.service.findFirst({
          where: {
            name: validatedData.name,
            location: validatedData.location || existing.location,
            id: { not: id }
          },
        });
        if (duplicate) {
          return res.status(400).json({
            success: false,
            error: `A service with name "${validatedData.name}" already exists at this location.`,
          });
        }
      }

      // Handle image upload - FIXED PATH
      let imageUrl = existing.image;
      if (req.file) {
        // Delete old image if exists
        if (existing.image && !existing.image.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '../../uploads', existing.image.replace('/uploads/', ''));
          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
              console.log('🗑️ Old image deleted:', oldImagePath);
            } catch (unlinkError) {
              console.error('Failed to delete old image:', unlinkError);
            }
          }
        }
        imageUrl = `/uploads/services/${req.file.filename}`;
      } else if (req.body.image !== undefined) {
        // If image field is provided in body, use it (could be URL or empty)
        imageUrl = req.body.image || null;
      }

      // Prepare update data
      const updateData = {};
      if (validatedData.name !== undefined) updateData.name = validatedData.name;
      if (validatedData.description !== undefined) updateData.description = validatedData.description;
      if (validatedData.price !== undefined) updateData.price = validatedData.price;
      if (validatedData.duration !== undefined) updateData.duration = validatedData.duration;
      if (validatedData.category !== undefined) updateData.category = validatedData.category;
      if (validatedData.location !== undefined) updateData.location = validatedData.location;
      if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
      if (imageUrl !== undefined) updateData.image = imageUrl;

      const updated = await prisma.service.update({
        where: { id },
        data: updateData,
      });

      console.log(`✅ Service updated successfully: ${updated.name}`);

      res.json({
        success: true,
        data: {
          ...updated,
          image: buildImageUrl(updated.image)
        },
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

// ============================================================
// FIXED: Patch service - Only ADMIN role required
// ============================================================
router.patch('/:id',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  [
    param('id').isString().withMessage('Invalid service ID'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, isActive, category, location } = req.body;

      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (price !== undefined) updateData.price = parseFloat(price);
      if (duration !== undefined) updateData.duration = parseInt(duration);
      if (category !== undefined) updateData.category = category.trim();
      if (location !== undefined) updateData.location = location.trim();
      if (isActive !== undefined) updateData.isActive = isActive;

      const updated = await prisma.service.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: true,
        data: {
          ...updated,
          image: buildImageUrl(updated.image)
        },
        message: 'Service updated successfully',
      });
    } catch (error) {
      console.error('Patch service error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update service',
      });
    }
  }
);

// ============================================================
// FIXED: Toggle service status - Only ADMIN role required
// ============================================================
router.patch('/:id/toggle-status',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  [
    param('id').isString().withMessage('Invalid service ID'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
      }

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
      });

      res.json({
        success: true,
        data: {
          ...updated,
          image: buildImageUrl(updated.image)
        },
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

// ============================================================
// FIXED: Delete service - Only ADMIN role required
// ============================================================
router.delete('/:id',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  [
    param('id').isString().withMessage('Invalid service ID'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
      }

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

      // Check for active appointments
      if (existing.appointments && existing.appointments.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Cannot delete service with ${existing.appointments.length} active appointment(s). Please cancel or complete all appointments first.`,
          activeAppointments: existing.appointments.length,
        });
      }

      // Delete image if exists - FIXED PATH
      if (existing.image && !existing.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../../uploads', existing.image.replace('/uploads/', ''));
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log('🗑️ Image deleted:', imagePath);
          } catch (unlinkError) {
            console.error('Failed to delete image:', unlinkError);
          }
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
        error: error.message || 'Failed to delete service',
      });
    }
  }
);

// Get services by department
router.get('/department/:departmentId', [
  param('departmentId').isString().withMessage('Invalid department ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { departmentId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    const mappedServices = services.map(service => ({
      ...service,
      image: buildImageUrl(service.image)
    }));

    res.json({
      success: true,
      data: mappedServices,
    });
  } catch (error) {
    console.error('Get services by department error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
    });
  }
});

// ============================================================
// FIXED: Get services stats - Only ADMIN role required
// ============================================================
router.get('/stats',
  auth,
  authorize('ADMIN'), // FIXED: Removed SUPER_ADMIN
  [
    query('location').optional().isString().withMessage('Location must be a string'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
        });
      }

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