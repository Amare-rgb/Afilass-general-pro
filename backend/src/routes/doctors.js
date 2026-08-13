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
    return null;
  }
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
    return null;
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
    return null;
  }
  
  if (workingHours.length === 0) {
    return null;
  }
  
  const validDays = [];
  const errors = [];
  
  workingHours.forEach((slot, index) => {
    if (slot.dayOfWeek === undefined || slot.dayOfWeek === null) {
      errors.push(`Slot ${index + 1}: Day of week is required`);
      return;
    }
    if (typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
      errors.push(`Slot ${index + 1}: Invalid day of week (must be 0-6)`);
      return;
    }
    
    if (validDays.includes(slot.dayOfWeek)) {
      errors.push(`Slot ${index + 1}: Duplicate day of week (${slot.dayOfWeek})`);
      return;
    }
    validDays.push(slot.dayOfWeek);
    
    if (!slot.startTime || slot.startTime.trim() === '') {
      errors.push(`Slot ${index + 1}: Start time is required`);
      return;
    }
    if (!slot.endTime || slot.endTime.trim() === '') {
      errors.push(`Slot ${index + 1}: End time is required`);
      return;
    }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slot.startTime.trim())) {
      errors.push(`Slot ${index + 1}: Invalid start time format (use HH:MM)`);
      return;
    }
    if (!timeRegex.test(slot.endTime.trim())) {
      errors.push(`Slot ${index + 1}: Invalid end time format (use HH:MM)`);
      return;
    }
    
    if (slot.startTime >= slot.endTime) {
      errors.push(`Slot ${index + 1}: Start time must be before end time`);
      return;
    }
    
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
// GET ROUTES
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

// ============================================================
// CREATE DOCTOR
// ============================================================
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  body('name').notEmpty().withMessage('Name is required').isString(),
  body('email').notEmpty().withMessage('Email is required').isEmail(),
  body('specialization').notEmpty().withMessage('Specialization is required').isString(),
  body('phone').optional().isString(),
  body('experience').optional().isInt({ min: 0, max: 100 }),
  body('bio').optional().isString(),
  body('education').optional().isString(),
  body('consultationFee').optional().isFloat({ min: 0 }),
  body('location').optional().isString(),
  body('workingHours').optional().isArray(),
  body('photoUrl').optional().isString(),
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
      name, email, phone, specialization, experience, 
      bio, education, consultationFee, location, 
      workingHours, photoUrl 
    } = req.body;

    // Check if doctor exists
    const existing = await prisma.doctor.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Doctor with this email already exists',
      });
    }

    // Create doctor with working hours
    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        specialization: specialization.trim(),
        bio: bio || '',
        education: education || '',
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        location: location || 'Afilas General Hospital',
        image: photoUrl || '',
        isAvailable: true,
        workingHours: workingHours && workingHours.length > 0 ? {
          create: workingHours.map(slot => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true,
          })),
        } : undefined,
      },
      include: {
        workingHours: true,
      },
    });

    console.log(`✅ Doctor created: ${doctor.name}`);

    res.status(201).json({
      success: true,
      data: doctor,
      message: 'Doctor created successfully',
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create doctor',
    });
  }
});

// ============================================================
// UPDATE DOCTOR
// ============================================================
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('specialization').optional().isString(),
  body('phone').optional().isString(),
  body('experience').optional().isInt({ min: 0, max: 100 }),
  body('bio').optional().isString(),
  body('education').optional().isString(),
  body('consultationFee').optional().isFloat({ min: 0 }),
  body('location').optional().isString(),
  body('active').optional().isBoolean(),
  body('workingHours').optional().isArray(),
  body('photoUrl').optional().isString(),
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
      name, email, phone, specialization, experience, 
      bio, education, consultationFee, location, 
      active, workingHours, photoUrl 
    } = req.body;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Check if email is taken by another doctor
    if (email && email !== doctor.email) {
      const existing = await prisma.doctor.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Doctor with this email already exists',
        });
      }
    }

    // Update doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : doctor.name,
        email: email !== undefined ? email.toLowerCase().trim() : doctor.email,
        phone: phone !== undefined ? phone : doctor.phone,
        specialization: specialization !== undefined ? specialization.trim() : doctor.specialization,
        bio: bio !== undefined ? bio : doctor.bio,
        education: education !== undefined ? education : doctor.education,
        experience: experience !== undefined ? experience : doctor.experience,
        consultationFee: consultationFee !== undefined ? consultationFee : doctor.consultationFee,
        location: location !== undefined ? location : doctor.location,
        image: photoUrl !== undefined ? photoUrl : doctor.image,
        isAvailable: active !== undefined ? active : doctor.isAvailable,
      },
    });

    // Update working hours if provided
    if (workingHours !== undefined) {
      // Delete existing working hours
      await prisma.workingHour.deleteMany({
        where: { doctorId: id },
      });

      // Create new working hours
      if (workingHours.length > 0) {
        await prisma.workingHour.createMany({
          data: workingHours.map(slot => ({
            doctorId: id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true,
          })),
        });
      }
    }

    // Fetch updated doctor with working hours
    const finalDoctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        workingHours: true,
      },
    });

    console.log(`✅ Doctor updated: ${finalDoctor.name}`);

    res.json({
      success: true,
      data: finalDoctor,
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

// ============================================================
// TOGGLE DOCTOR AVAILABILITY
// ============================================================
router.patch('/:id/toggle-status', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
], async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        isAvailable: !doctor.isAvailable,
      },
      include: {
        workingHours: true,
      },
    });

    console.log(`✅ Doctor ${updated.name} ${updated.isAvailable ? 'activated' : 'deactivated'}`);

    res.json({
      success: true,
      data: updated,
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

// ============================================================
// 🔥 FIXED: DELETE DOCTOR - COMPLETELY SEPARATE FROM APPOINTMENTS
// ============================================================
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  param('id').isString().withMessage('Invalid doctor ID'),
], async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`📡 Deleting doctor: ${id}`);

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id },
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

    // 🔥 ONLY DELETE WORKING HOURS AND DOCTOR
    // DO NOT TOUCH APPOINTMENTS - THEY ARE SEPARATE
    
    // Delete working hours first (if any)
    if (doctor.workingHours.length > 0) {
      await prisma.workingHour.deleteMany({
        where: { doctorId: id },
      });
      console.log(`✅ Deleted ${doctor.workingHours.length} working hours`);
    }

    // Delete the doctor only - appointments remain untouched!
    await prisma.doctor.delete({
      where: { id },
    });

    console.log(`✅ Doctor "${doctor.name}" deleted successfully. Appointments remain intact.`);

    res.json({
      success: true,
      message: `Doctor "${doctor.name}" deleted successfully. Appointments remain intact.`,
      data: {
        deletedDoctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
        },
        appointmentsUnaffected: true,
      },
    });

  } catch (error) {
    console.error('❌ Delete doctor error:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete doctor because they have related records. Please delete working hours first.',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete doctor',
    });
  }
});

module.exports = router;