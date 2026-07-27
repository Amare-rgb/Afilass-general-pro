// backend/src/routes/doctors.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all doctors with filters - ADDED location filter
router.get('/', async (req, res) => {
  try {
    const { departmentId, specialization, isAvailable, search, location } = req.query;
    
    const where = {};
    
    if (departmentId) where.departmentId = departmentId;
    if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    console.log('📡 Doctor query with location:', location);
    console.log('📡 Where clause:', where);

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        workingHours: true,
      },
      orderBy: { name: 'asc' },
    });

    const mappedDoctors = doctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      title: doc.specialization,
      bio: doc.bio || '',
      photoUrl: doc.image || '',
      departmentId: doc.departmentId,
      department: doc.department,
      active: doc.isAvailable,
      email: doc.email,
      phone: doc.phone,
      specialization: doc.specialization,
      experience: doc.experience,
      education: doc.education,
      rating: doc.rating,
      consultationFee: doc.consultationFee,
      scheduleSlots: doc.workingHours,
      location: doc.location || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    res.json({
      success: true,
      data: mappedDoctors,
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        department: true,
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
      photoUrl: doctor.image || '',
      departmentId: doctor.departmentId,
      department: doctor.department,
      active: doctor.isAvailable,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      education: doctor.education,
      rating: doctor.rating,
      consultationFee: doctor.consultationFee,
      scheduleSlots: doctor.workingHours,
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
router.get('/available', async (req, res) => {
  try {
    const { date, serviceId, location } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required',
      });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    let where = {
      isAvailable: true,
      workingHours: {
        some: {
          dayOfWeek,
          isAvailable: true,
        },
      },
    };

    if (location && location !== 'all' && location !== 'undefined' && location !== 'null') {
      where.location = location;
    }

    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { departmentId: true },
      });
      
      if (service) {
        where.departmentId = service.departmentId;
      }
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        workingHours: {
          where: {
            dayOfWeek,
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
        bookedTimes,
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

// Create doctor (Admin only) - ADDED location field
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('departmentId').notEmpty().withMessage('Department ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { 
      name, title, bio, photoUrl, departmentId,
      email, phone, specialization, experience, education,
      consultationFee, location
    } = req.body;

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(400).json({
        success: false,
        error: 'Department not found',
      });
    }

    if (email) {
      const existing = await prisma.doctor.findUnique({
        where: { email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Doctor with this email already exists',
        });
      }
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        email: email || '',
        phone: phone || '',
        specialization: specialization || title,
        bio: bio || '',
        education: education || '',
        experience: experience ? parseInt(experience) : 0,
        image: photoUrl || '',
        isAvailable: true,
        consultationFee: consultationFee ? parseFloat(consultationFee) : 0,
        departmentId,
        location: location || 'Afilas General Hospital',
      },
      include: {
        department: true,
        workingHours: true,
      },
    });

    const mappedDoctor = {
      id: doctor.id,
      name: doctor.name,
      title: doctor.specialization,
      bio: doctor.bio || '',
      photoUrl: doctor.image || '',
      departmentId: doctor.departmentId,
      department: doctor.department,
      active: doctor.isAvailable,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      education: doctor.education,
      rating: doctor.rating,
      consultationFee: doctor.consultationFee,
      scheduleSlots: doctor.workingHours,
      location: doctor.location,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    };

    res.status(201).json({
      success: true,
      data: mappedDoctor,
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create doctor',
    });
  }
});

// Update doctor (Admin only) - ADDED location field
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, title, bio, photoUrl, departmentId,
      email, phone, specialization, experience, education,
      consultationFee, active, location
    } = req.body;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    if (email && email !== doctor.email) {
      const existing = await prisma.doctor.findUnique({
        where: { email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Doctor with this email already exists',
        });
      }
    }

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        name: name || doctor.name,
        email: email || doctor.email,
        phone: phone || doctor.phone,
        specialization: specialization || doctor.specialization,
        bio: bio !== undefined ? bio : doctor.bio,
        education: education !== undefined ? education : doctor.education,
        experience: experience !== undefined ? parseInt(experience) : doctor.experience,
        image: photoUrl !== undefined ? photoUrl : doctor.image,
        isAvailable: active !== undefined ? active : doctor.isAvailable,
        consultationFee: consultationFee !== undefined ? parseFloat(consultationFee) : doctor.consultationFee,
        departmentId: departmentId || doctor.departmentId,
        location: location || doctor.location || 'Afilas General Hospital',
      },
      include: {
        department: true,
        workingHours: true,
      },
    });

    const mappedDoctor = {
      id: updated.id,
      name: updated.name,
      title: updated.specialization,
      bio: updated.bio || '',
      photoUrl: updated.image || '',
      departmentId: updated.departmentId,
      department: updated.department,
      active: updated.isAvailable,
      email: updated.email,
      phone: updated.phone,
      specialization: updated.specialization,
      experience: updated.experience,
      education: updated.education,
      rating: updated.rating,
      consultationFee: updated.consultationFee,
      scheduleSlots: updated.workingHours,
      location: updated.location,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    res.json({
      success: true,
      data: mappedDoctor,
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update doctor',
    });
  }
});

// Toggle doctor availability (Admin only)
router.patch('/:id/toggle-status', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
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
        department: true,
        workingHours: true,
      },
    });

    const mappedDoctor = {
      id: updated.id,
      name: updated.name,
      title: updated.specialization,
      bio: updated.bio || '',
      photoUrl: updated.image || '',
      departmentId: updated.departmentId,
      department: updated.department,
      active: updated.isAvailable,
      email: updated.email,
      phone: updated.phone,
      specialization: updated.specialization,
      experience: updated.experience,
      education: updated.education,
      rating: updated.rating,
      consultationFee: updated.consultationFee,
      scheduleSlots: updated.workingHours,
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
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id },
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
        where: { id },
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

// Clear all doctors (Admin only)
router.delete('/clear-all', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const result = await prisma.$transaction([
      prisma.appointment.deleteMany({}),
      prisma.workingHour.deleteMany({}),
      prisma.doctor.deleteMany({}),
    ]);

    res.json({
      success: true,
      message: 'All doctors cleared successfully',
      data: {
        appointments: result[0].count,
        workingHours: result[1].count,
        doctors: result[2].count,
      },
    });
  } catch (error) {
    console.error('Clear all doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear doctors',
    });
  }
});

module.exports = router;