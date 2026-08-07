const express = require('express');
const { body, validationResult, query, param } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ============================================================
// HELPER: Build absolute image URL for the Frontend
// ============================================================
function buildImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  let cleanPath = imagePath;
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  return `http://localhost:5000${cleanPath}`;
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

const validateName = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Name is required');
  }
  if (value.trim().length < 2) {
    throw new Error('Name must be at least 2 characters');
  }
  if (value.trim().length > 100) {
    throw new Error('Name must be less than 100 characters');
  }
  if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) {
    throw new Error('Name contains invalid characters (only letters, spaces, hyphens, apostrophes, and periods allowed)');
  }
  return value.trim();
};

const validateEmail = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Email is required');
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(value.trim())) {
    throw new Error('Please enter a valid email address');
  }
  if (value.trim().length > 255) {
    throw new Error('Email must be less than 255 characters');
  }
  return value.trim().toLowerCase();
};

const validatePhone = (value) => {
  if (!value || value.trim().length === 0) {
    return null; // Phone is optional
  }
  // International phone number format
  const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/;
  if (!phoneRegex.test(value.trim())) {
    throw new Error('Please enter a valid phone number (7-20 characters, numbers, spaces, +, -, (), allowed)');
  }
  return value.trim();
};

const validateSpecialization = (value) => {
  if (!value || value.trim().length === 0) {
    throw new Error('Specialization is required');
  }
  if (value.trim().length < 2) {
    throw new Error('Specialization must be at least 2 characters');
  }
  if (value.trim().length > 100) {
    throw new Error('Specialization must be less than 100 characters');
  }
  if (!/^[a-zA-Z\s\-',.&]+$/.test(value.trim())) {
    throw new Error('Specialization contains invalid characters');
  }
  return value.trim();
};

const validateExperience = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    throw new Error('Experience must be a valid number');
  }
  if (num < 0) {
    throw new Error('Experience cannot be negative');
  }
  if (num > 100) {
    throw new Error('Experience cannot exceed 100 years');
  }
  return num;
};

const validateBio = (value) => {
  if (!value || value.trim().length === 0) {
    return null; // Bio is optional
  }
  if (value.trim().length > 500) {
    throw new Error('Bio must be less than 500 characters');
  }
  return value.trim();
};

const validateConsultationFee = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error('Consultation fee must be a valid number');
  }
  if (num < 0) {
    throw new Error('Consultation fee cannot be negative');
  }
  if (num > 999999) {
    throw new Error('Consultation fee cannot exceed 999,999');
  }
  return num;
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

const validateWorkingHours = (workingHours) => {
  if (!workingHours || !Array.isArray(workingHours)) {
    return null; // No working hours provided
  }
  
  if (workingHours.length === 0) {
    throw new Error('Please provide at least one working day');
  }
  
  const validDays = [];
  const errors = [];
  
  workingHours.forEach((slot, index) => {
    // Validate dayOfWeek
    if (slot.dayOfWeek === undefined || slot.dayOfWeek === null) {
      errors.push(`Slot ${index + 1}: Day of week is required`);
      return;
    }
    if (typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
      errors.push(`Slot ${index + 1}: Invalid day of week (must be 0-6)`);
      return;
    }
    
    // Check for duplicate days
    if (validDays.includes(slot.dayOfWeek)) {
      errors.push(`Slot ${index + 1}: Duplicate day of week (${slot.dayOfWeek})`);
      return;
    }
    validDays.push(slot.dayOfWeek);
    
    // Validate times
    if (!slot.startTime || slot.startTime.trim() === '') {
      errors.push(`Slot ${index + 1}: Start time is required`);
      return;
    }
    if (!slot.endTime || slot.endTime.trim() === '') {
      errors.push(`Slot ${index + 1}: End time is required`);
      return;
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slot.startTime.trim())) {
      errors.push(`Slot ${index + 1}: Invalid start time format (use HH:MM)`);
      return;
    }
    if (!timeRegex.test(slot.endTime.trim())) {
      errors.push(`Slot ${index + 1}: Invalid end time format (use HH:MM)`);
      return;
    }
    
    // Validate time range
    if (slot.startTime >= slot.endTime) {
      errors.push(`Slot ${index + 1}: Start time must be before end time`);
      return;
    }
    
    // Validate isAvailable
    if (slot.isAvailable !== undefined && typeof slot.isAvailable !== 'boolean') {
      errors.push(`Slot ${index + 1}: isAvailable must be a boolean`);
      return;
    }
  });
  
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
  
  return workingHours;
};

// ============================================================
// ROUTES
// ============================================================

// Get all doctors with filters
router.get('/', [
  query('specialization').optional().isString().withMessage('Specialization must be a string'),
  query('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('location').optional().isString().withMessage('Location must be a string'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { specialization, isAvailable, search, location } = req.query;
    
    const where = {};
    
    if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log('📡 Doctor query with location:', location);

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const mappedDoctors = doctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      title: doc.specialization,
      bio: doc.bio || '',
      photoUrl: buildImageUrl(doc.image),
      active: doc.isAvailable,
      email: doc.email,
      phone: doc.phone,
      specialization: doc.specialization,
      experience: doc.experience,
      education: doc.education,
      rating: doc.rating,
      consultationFee: doc.consultationFee,
      scheduleSlots: doc.workingHours || [], 
      location: doc.location || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    res.json({
      success: true,
      data: mappedDoctors,
      count: mappedDoctors.length,
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctors',
    });
  }
});

// Get single doctor
router.get('/:id', [
  param('id').isString().withMessage('Invalid doctor ID'),
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

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    const mappedDoctor = {
      id: doctor.id,
      name: doctor.name,
      title: doctor.specialization,
      bio: doctor.bio || '',
      photoUrl: buildImageUrl(doctor.image),
      active: doctor.isAvailable,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      education: doctor.education,
      rating: doctor.rating,
      consultationFee: doctor.consultationFee,
      scheduleSlots: doctor.workingHours || [],
      location: doctor.location || null,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };

    res.json({
      success: true,
      data: mappedDoctor,
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doctor',
    });
  }
});

// Get available doctors for appointment
router.get('/available', [
  query('date').isISO8601().withMessage('Date must be a valid ISO date'),
  query('location').optional().isString().withMessage('Location must be a string'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { date, location } = req.query;
    
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    let where = {
      isAvailable: true,
      workingHours: {
        some: {
          dayOfWeek: dayOfWeek,
          isAvailable: true,
        },
      },
    };

    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        workingHours: {
          where: {
            dayOfWeek: dayOfWeek,
            isAvailable: true,
          },
        },
        appointments: {
          where: {
            date: selectedDate,
            status: {
              notIn: ['CANCELLED', 'COMPLETED'],
            },
          },
          select: {
            time: true,
          },
        },
      },
    });

    const availableDoctors = doctors.map(doctor => {
      const bookedTimes = doctor.appointments.map(apt => apt.time);
      return {
        ...doctor,
        bookedTimes: bookedTimes,
        appointments: undefined,
      };
    });

    res.json({
      success: true,
      data: availableDoctors,
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available doctors',
    });
  }
});

// Create doctor (Admin only)
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/).withMessage('Name contains invalid characters'),
  
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Valid email is required')
    .isLength({ max: 255 }).withMessage('Email must be less than 255 characters')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .matches(/^[\+\d\s\-\(\)]{7,20}$/).withMessage('Invalid phone number format'),
  
  body('specialization')
    .notEmpty().withMessage('Specialization is required')
    .isString().withMessage('Specialization must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Specialization must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-',.&]+$/).withMessage('Specialization contains invalid characters'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Experience must be between 0 and 100 years'),
  
  body('bio')
    .optional()
    .isString().withMessage('Bio must be a string')
    .isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  
  body('consultationFee')
    .optional()
    .isFloat({ min: 0, max: 999999 }).withMessage('Consultation fee must be between 0 and 999,999'),
  
  body('location')
    .optional()
    .isString().withMessage('Location must be a string')
    .isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  
  body('photoUrl')
    .optional()
    .isString().withMessage('Photo URL must be a string')
    .isURL().withMessage('Photo URL must be a valid URL')
    .isLength({ max: 500 }).withMessage('Photo URL must be less than 500 characters'),
  
  body('workingHours')
    .optional()
    .isArray().withMessage('Working hours must be an array')
    .custom((value) => {
      if (!value || value.length === 0) {
        throw new Error('At least one working day is required');
      }
      return true;
    }),
  
  body('workingHours.*.dayOfWeek')
    .if(body('workingHours').exists())
    .isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  
  body('workingHours.*.startTime')
    .if(body('workingHours').exists())
    .notEmpty().withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (use HH:MM)'),
  
  body('workingHours.*.endTime')
    .if(body('workingHours').exists())
    .notEmpty().withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (use HH:MM)')
    .custom((value, { req }) => {
      const index = req.body.workingHours.findIndex(slot => slot.endTime === value);
      if (index !== -1 && req.body.workingHours[index]) {
        const startTime = req.body.workingHours[index].startTime;
        if (startTime && startTime >= value) {
          throw new Error('End time must be after start time');
        }
      }
      return true;
    }),
  
  body('workingHours.*.isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { 
      name, title, bio, photoUrl,
      email, phone, specialization, experience, education,
      consultationFee, location, workingHours
    } = req.body;

    // Validate and clean data
    let validatedData = {};
    try {
      validatedData.name = validateName(name);
      validatedData.email = validateEmail(email);
      validatedData.phone = validatePhone(phone);
      validatedData.specialization = validateSpecialization(specialization);
      validatedData.experience = validateExperience(experience);
      validatedData.bio = validateBio(bio);
      validatedData.consultationFee = validateConsultationFee(consultationFee);
      validatedData.location = validateLocation(location);
      
      if (workingHours) {
        validatedData.workingHours = validateWorkingHours(workingHours);
      }
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.message,
      });
    }

    // Check if email already exists
    if (validatedData.email) {
      const existing = await prisma.doctor.findUnique({
        where: { email: validatedData.email },
      });
      if (existing) {
        console.log(`❌ Email already exists: ${validatedData.email}`);
        return res.status(400).json({
          success: false,
          error: `Doctor with email "${validatedData.email}" already exists. Please use a different email.`,
        });
      }
    }

    // Prepare working hours data
    let workingHoursData = undefined;
    if (validatedData.workingHours && Array.isArray(validatedData.workingHours) && validatedData.workingHours.length > 0) {
      const validSlots = validatedData.workingHours.filter(slot => 
        slot.dayOfWeek !== undefined && 
        slot.dayOfWeek >= 0 && 
        slot.dayOfWeek <= 6 &&
        slot.startTime && 
        slot.endTime && 
        slot.startTime.trim() !== '' && 
        slot.endTime.trim() !== ''
      );

      if (validSlots.length > 0) {
        workingHoursData = {
          create: validSlots.map(slot => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
          }))
        };
      }
    }

    // Create doctor with working hours
    const doctor = await prisma.doctor.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || '',
        specialization: validatedData.specialization,
        bio: validatedData.bio || '',
        education: education || '',
        experience: validatedData.experience,
        image: photoUrl || '', // This stores the database path
        isAvailable: true,
        consultationFee: validatedData.consultationFee,
        location: validatedData.location,
        workingHours: workingHoursData
      },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    const mappedDoctor = {
      id: doctor.id,
      name: doctor.name,
      title: doctor.specialization,
      bio: doctor.bio || '',
      photoUrl: buildImageUrl(doctor.image),
      active: doctor.isAvailable,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      education: doctor.education,
      rating: doctor.rating,
      consultationFee: doctor.consultationFee,
      scheduleSlots: doctor.workingHours || [],
      location: doctor.location,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };

    console.log(`✅ Doctor created successfully: ${doctor.name} (${doctor.email})`);
    console.log(`📅 Working hours created: ${doctor.workingHours.length} slots`);
    
    res.status(201).json({
      success: true,
      data: mappedDoctor,
      message: 'Doctor created successfully',
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    
    // Check for Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A doctor with this email already exists. Please use a different email.',
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create doctor',
    });
  }
});

// Update doctor (Admin only)
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
  
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'.]+$/).withMessage('Name contains invalid characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Valid email is required')
    .isLength({ max: 255 }).withMessage('Email must be less than 255 characters')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .matches(/^[\+\d\s\-\(\)]{7,20}$/).withMessage('Invalid phone number format'),
  
  body('specialization')
    .optional()
    .isString().withMessage('Specialization must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Specialization must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-',.&]+$/).withMessage('Specialization contains invalid characters'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Experience must be between 0 and 100 years'),
  
  body('bio')
    .optional()
    .isString().withMessage('Bio must be a string')
    .isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  
  body('consultationFee')
    .optional()
    .isFloat({ min: 0, max: 999999 }).withMessage('Consultation fee must be between 0 and 999,999'),
  
  body('location')
    .optional()
    .isString().withMessage('Location must be a string')
    .isLength({ max: 100 }).withMessage('Location must be less than 100 characters'),
  
  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),
  
  body('photoUrl')
    .optional()
    .isString().withMessage('Photo URL must be a string')
    .isLength({ max: 500 }).withMessage('Photo URL must be less than 500 characters'),
  
  body('workingHours')
    .optional()
    .isArray().withMessage('Working hours must be an array'),
  
  body('workingHours.*.dayOfWeek')
    .if(body('workingHours').exists())
    .isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  
  body('workingHours.*.startTime')
    .if(body('workingHours').exists())
    .notEmpty().withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (use HH:MM)'),
  
  body('workingHours.*.endTime')
    .if(body('workingHours').exists())
    .notEmpty().withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (use HH:MM)'),
  
  body('workingHours.*.isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
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
    const { 
      name, title, bio, photoUrl,
      email, phone, specialization, experience, education,
      consultationFee, active, location, workingHours
    } = req.body;

    const doctor = await prisma.doctor.findUnique({
      where: { id: id },
      include: {
        workingHours: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Validate and clean data
    let validatedData = {};
    try {
      if (name) validatedData.name = validateName(name);
      if (email) validatedData.email = validateEmail(email);
      if (phone !== undefined) validatedData.phone = validatePhone(phone);
      if (specialization) validatedData.specialization = validateSpecialization(specialization);
      if (experience !== undefined) validatedData.experience = validateExperience(experience);
      if (bio !== undefined) validatedData.bio = validateBio(bio);
      if (consultationFee !== undefined) validatedData.consultationFee = validateConsultationFee(consultationFee);
      if (location !== undefined) validatedData.location = validateLocation(location);
      
      if (workingHours !== undefined) {
        validatedData.workingHours = validateWorkingHours(workingHours);
      }
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.message,
      });
    }

    // Check email if changed
    if (validatedData.email && validatedData.email !== doctor.email) {
      const existing = await prisma.doctor.findUnique({
        where: { email: validatedData.email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Doctor with this email already exists',
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.specialization) updateData.specialization = validatedData.specialization;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (education !== undefined) updateData.education = education;
    if (validatedData.experience !== undefined) updateData.experience = validatedData.experience;
    if (photoUrl !== undefined) updateData.image = photoUrl;
    if (active !== undefined) updateData.isAvailable = active;
    if (validatedData.consultationFee !== undefined) updateData.consultationFee = validatedData.consultationFee;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;

    // First update the doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: id },
      data: updateData,
    });

    // Handle working hours update
    if (workingHours !== undefined) {
      // Delete all existing working hours
      await prisma.workingHour.deleteMany({
        where: { doctorId: id },
      });

      // Create new working hours if provided
      if (Array.isArray(workingHours) && workingHours.length > 0) {
        const validSlots = workingHours.filter(slot => 
          slot.dayOfWeek !== undefined && 
          slot.dayOfWeek >= 0 && 
          slot.dayOfWeek <= 6 &&
          slot.startTime && 
          slot.endTime && 
          slot.startTime.trim() !== '' && 
          slot.endTime.trim() !== ''
        );

        if (validSlots.length > 0) {
          await prisma.workingHour.createMany({
            data: validSlots.map(slot => ({
              doctorId: id,
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
            }))
          });
        }
      }
    }

    // Fetch the complete updated doctor with working hours
    const finalDoctor = await prisma.doctor.findUnique({
      where: { id: id },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    const mappedDoctor = {
      id: finalDoctor.id,
      name: finalDoctor.name,
      title: finalDoctor.specialization,
      bio: finalDoctor.bio || '',
      photoUrl: buildImageUrl(finalDoctor.image),
      active: finalDoctor.isAvailable,
      email: finalDoctor.email,
      phone: finalDoctor.phone,
      specialization: finalDoctor.specialization,
      experience: finalDoctor.experience,
      education: finalDoctor.education,
      rating: finalDoctor.rating,
      consultationFee: finalDoctor.consultationFee,
      scheduleSlots: finalDoctor.workingHours || [],
      location: finalDoctor.location,
      createdAt: finalDoctor.createdAt,
      updatedAt: finalDoctor.updatedAt,
    };

    console.log(`✅ Doctor updated successfully: ${finalDoctor.name}`);
    console.log(`📅 Working hours: ${finalDoctor.workingHours.length} slots`);

    res.json({
      success: true,
      data: mappedDoctor,
      message: 'Doctor updated successfully',
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update doctor',
    });
  }
});

// Bulk update working hours (Admin only)
router.put('/:id/working-hours', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
  body('workingHours').isArray().withMessage('Working hours must be an array'),
  body('workingHours.*.dayOfWeek')
    .isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  body('workingHours.*.startTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (use HH:MM)'),
  body('workingHours.*.endTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (use HH:MM)'),
  body('workingHours.*.isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
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
    const { workingHours } = req.body;

    const doctor = await prisma.doctor.findUnique({
      where: { id: id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Validate working hours
    try {
      validateWorkingHours(workingHours);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError.message,
      });
    }

    // Delete all existing working hours
    await prisma.workingHour.deleteMany({
      where: { doctorId: id },
    });

    // Filter valid slots
    const validSlots = workingHours.filter(slot => 
      slot.dayOfWeek !== undefined && 
      slot.dayOfWeek >= 0 && 
      slot.dayOfWeek <= 6 &&
      slot.startTime && 
      slot.endTime && 
      slot.startTime.trim() !== '' && 
      slot.endTime.trim() !== ''
    );

    // Create new working hours if any valid slots
    if (validSlots.length > 0) {
      await prisma.workingHour.createMany({
        data: validSlots.map(slot => ({
          doctorId: id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
        }))
      });
    }

    // Fetch updated doctor with working hours
    const updatedDoctor = await prisma.doctor.findUnique({
      where: { id: id },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: {
        doctorId: updatedDoctor.id,
        workingHours: updatedDoctor.workingHours,
        count: updatedDoctor.workingHours.length
      },
      message: `Working hours updated successfully (${updatedDoctor.workingHours.length} slots)`,
    });
  } catch (error) {
    console.error('Update working hours error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update working hours',
    });
  }
});

// Toggle doctor availability (Admin only)
router.patch('/:id/toggle-status', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
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

    const doctor = await prisma.doctor.findUnique({
      where: { id: id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    const updated = await prisma.doctor.update({
      where: { id: id },
      data: {
        isAvailable: !doctor.isAvailable,
      },
      include: {
        workingHours: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    const mappedDoctor = {
      id: updated.id,
      name: updated.name,
      title: updated.specialization,
      bio: updated.bio || '',
      photoUrl: buildImageUrl(updated.image),
      active: updated.isAvailable,
      email: updated.email,
      phone: updated.phone,
      specialization: updated.specialization,
      experience: updated.experience,
      education: updated.education,
      rating: updated.rating,
      consultationFee: updated.consultationFee,
      scheduleSlots: updated.workingHours || [],
      location: updated.location,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    res.json({
      success: true,
      data: mappedDoctor,
      message: `Doctor ${updated.isAvailable ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Toggle doctor status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle doctor status',
    });
  }
});

// Delete doctor (Admin only)
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
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

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: id },
      include: {
        appointments: {
          where: {
            status: { notIn: ['CANCELLED', 'COMPLETED'] },
          },
        },
        workingHours: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Check for active appointments
    if (doctor.appointments.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete doctor with ${doctor.appointments.length} active appointment(s). Please cancel or complete all appointments first.`,
        activeAppointments: doctor.appointments.length,
      });
    }

    // Delete working hours and doctor in a transaction
    await prisma.$transaction([
      prisma.workingHour.deleteMany({
        where: { doctorId: id },
      }),
      prisma.doctor.delete({
        where: { id: id },
      }),
    ]);

    res.json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete doctor',
    });
  }
});

module.exports = router;