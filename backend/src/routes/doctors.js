// backend/src/routes/doctors.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all doctors with filters
router.get('/', async (req, res) => {
  try {
    const { specialization, isAvailable, search, location } = req.query;
    
    const where = {};
    
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
      photoUrl: doc.image || '',
      active: doc.isAvailable,
      email: doc.email,
      phone: doc.phone,
      specialization: doc.specialization,
      experience: doc.experience,
      education: doc.education,
      rating: doc.rating,
      consultationFee: doc.consultationFee,
      scheduleSlots: doc.workingHours || [], // Ensure empty array if no working hours
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
router.get('/available', async (req, res) => {
  try {
    const { date, location } = req.query;
    
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
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('email').isEmail().withMessage('Valid email is required'),
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
      name, title, bio, photoUrl,
      email, phone, specialization, experience, education,
      consultationFee, location, workingHours
    } = req.body;

    // Check if email already exists
    if (email) {
      const existing = await prisma.doctor.findUnique({
        where: { email: email },
      });
      if (existing) {
        console.log(`❌ Email already exists: ${email}`);
        return res.status(400).json({
          success: false,
          error: `Doctor with email "${email}" already exists. Please use a different email.`,
        });
      }
    }

    // Prepare working hours data
    let workingHoursData = undefined;
    if (workingHours && Array.isArray(workingHours) && workingHours.length > 0) {
      // Filter out invalid slots
      const validSlots = workingHours.filter(function(slot) {
        return slot.dayOfWeek !== undefined && 
               slot.dayOfWeek >= 0 && 
               slot.dayOfWeek <= 6 &&
               slot.startTime && 
               slot.endTime && 
               slot.startTime.trim() !== '' && 
               slot.endTime.trim() !== '';
      });

      if (validSlots.length > 0) {
        workingHoursData = {
          create: validSlots.map(function(slot) {
            return {
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
            };
          })
        };
      }
    }

    // Create doctor with working hours
    const doctor = await prisma.doctor.create({
      data: {
        name: name,
        email: email || '',
        phone: phone || '',
        specialization: specialization || title,
        bio: bio || '',
        education: education || '',
        experience: experience ? parseInt(experience) : 0,
        image: photoUrl || '',
        isAvailable: true,
        consultationFee: consultationFee ? parseFloat(consultationFee) : 0,
        location: location || 'Afilas General Hospital',
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
      photoUrl: doctor.image || '',
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
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
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

    // Check email if changed
    if (email && email !== doctor.email) {
      const existing = await prisma.doctor.findUnique({
        where: { email: email },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Doctor with this email already exists',
        });
      }
    }

    // First update the doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: id },
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
        location: location || doctor.location || 'Afilas General Hospital',
      },
    });

    // Handle working hours update
    if (workingHours !== undefined) {
      // Delete all existing working hours
      await prisma.workingHour.deleteMany({
        where: { doctorId: id },
      });

      // Create new working hours if provided
      if (Array.isArray(workingHours) && workingHours.length > 0) {
        // Filter out invalid slots
        const validSlots = workingHours.filter(function(slot) {
          return slot.dayOfWeek !== undefined && 
                 slot.dayOfWeek >= 0 && 
                 slot.dayOfWeek <= 6 &&
                 slot.startTime && 
                 slot.endTime && 
                 slot.startTime.trim() !== '' && 
                 slot.endTime.trim() !== '';
        });

        if (validSlots.length > 0) {
          await prisma.workingHour.createMany({
            data: validSlots.map(function(slot) {
              return {
                doctorId: id,
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
              };
            })
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
      photoUrl: finalDoctor.image || '',
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
router.put('/:id/working-hours', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
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

    if (!workingHours || !Array.isArray(workingHours)) {
      return res.status(400).json({
        success: false,
        error: 'Working hours must be an array',
      });
    }

    // Delete all existing working hours
    await prisma.workingHour.deleteMany({
      where: { doctorId: id },
    });

    // Filter valid slots
    const validSlots = workingHours.filter(function(slot) {
      return slot.dayOfWeek !== undefined && 
             slot.dayOfWeek >= 0 && 
             slot.dayOfWeek <= 6 &&
             slot.startTime && 
             slot.endTime && 
             slot.startTime.trim() !== '' && 
             slot.endTime.trim() !== '';
    });

    // Create new working hours if any valid slots
    if (validSlots.length > 0) {
      await prisma.workingHour.createMany({
        data: validSlots.map(function(slot) {
          return {
            doctorId: id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
          };
        })
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
router.patch('/:id/toggle-status', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
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
      photoUrl: updated.image || '',
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
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
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