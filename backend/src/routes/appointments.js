const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');
const notificationService = require('../lib/notificationService');

const router = express.Router();

// ============================================================
// Helper to map appointment for frontend
// ============================================================
function mapAppointment(appointment) {
  return {
    id: appointment.id,
    patientName: appointment.patientName,
    patientEmail: appointment.patientEmail,
    patientPhone: appointment.patientPhone,
    patientAge: appointment.patientAge,
    patientGender: appointment.patientGender,
    serviceId: appointment.serviceId,
    service: appointment.service ? {
      id: appointment.service.id,
      name: appointment.service.name,
      price: appointment.service.price,
      duration: appointment.service.duration,
    } : null,
    appointmentDate: appointment.date,
    date: appointment.date,
    time: appointment.time,
    note: appointment.notes,
    notes: appointment.notes,
    symptoms: appointment.symptoms,
    isEmergency: appointment.isEmergency,
    status: appointment.status,
    location: appointment.location || null,
    reminderSentAt: appointment.reminderSentAt,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    visitType: appointment.visitType || null,
    city: appointment.city || null,
    subCity: appointment.subCity || null,
    woreda: appointment.woreda || null,
    gpsPin: appointment.gpsPin || null,
    homeAddress: appointment.homeAddress || null,
    userId: appointment.userId,
    doctorId: appointment.doctorId,
    doctor: appointment.doctor ? {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      specialization: appointment.doctor.specialization, // ✅ FIXED: specialty -> specialization
    } : null,
  };
}

// ============================================================
// Helper to validate Ethiopian phone number
// ============================================================
function isValidEthiopianPhone(phone) {
  const phoneRegex = /^0[97]\d{8}$/;
  return phoneRegex.test(phone);
}

// ============================================================
// Helper to check time slot availability
// ============================================================
async function isTimeSlotAvailable(date, time, excludeAppointmentId = null) {
  try {
    const where = {
      date: new Date(date),
      time: time,
      NOT: {
        status: {
          in: ['CANCELLED', 'MISSED']
        }
      }
    };
    
    if (excludeAppointmentId) {
      where.id = { not: excludeAppointmentId };
    }
    
    const existing = await prisma.appointment.findFirst({
      where: where
    });
    
    return !existing;
  } catch (error) {
    console.error('Error checking time slot:', error);
    return true;
  }
}

// ============================================================
// GET all appointments - 🔥 ADMIN and USER only
// ============================================================
router.get('/', auth, authorize('ADMIN', 'USER'), async (req, res) => {
  try {
    const { status, startDate, endDate, location, doctorId } = req.query;
    
    const where = {};
    
    if (req.user.role === 'USER') {
      where.userId = req.user.id;
    }
    
    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (location && location !== 'all' && location !== 'undefined') {
      where.location = location;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true, // ✅ FIXED: specialty -> specialization
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    const mappedAppointments = appointments.map(mapAppointment);

    res.json({
      success: true,
      data: mappedAppointments,
      count: mappedAppointments.length,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments: ' + error.message,
    });
  }
});

// ============================================================
// GET single appointment - 🔥 ADMIN and USER only
// ============================================================
router.get('/:id', auth, authorize('ADMIN', 'USER'), async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true, // ✅ FIXED: specialty -> specialization
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    if (req.user.role === 'USER' && appointment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this appointment',
      });
    }

    res.json({
      success: true,
      data: mapAppointment(appointment),
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment',
    });
  }
});

// ============================================================
// CREATE appointment - PUBLIC (no auth required)
// ============================================================
router.post('/', [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientEmail').isEmail().withMessage('Valid email is required'),
  body('patientPhone').trim().notEmpty().withMessage('Phone number is required')
    .custom((value) => {
      if (!isValidEthiopianPhone(value)) {
        throw new Error('Invalid Ethiopian phone number (e.g., 0912345678)');
      }
      return true;
    }),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Valid date is required (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Date cannot be in the past');
      }
      return true;
    }),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
  body('serviceId').optional().isString(),
  body('doctorId').optional().isString().withMessage('Invalid doctor ID'),
  body('location').optional().isString(),
  body('notes').optional().isString(),
  body('symptoms').optional().isString(),
  body('isEmergency').optional().isBoolean(),
  body('patientAge').optional().isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('patientGender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
  body('visitType').optional().isIn(['HOSPITAL', 'HOME']).withMessage('Visit type must be HOSPITAL or HOME'),
  body('city').optional().isString(),
  body('subCity').optional().isString(),
  body('woreda').optional().isString(),
  body('gpsPin').optional().isString(),
  body('homeAddress').optional().isString(),
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
      patientName, patientEmail, patientPhone, patientAge,
      patientGender, date, time, serviceId, doctorId,
      notes, symptoms, isEmergency, location,
      visitType, city, subCity, woreda, gpsPin, homeAddress
    } = req.body;

    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Please use YYYY-MM-DD',
      });
    }

    // Check time slot availability
    const isAvailable = await isTimeSlotAvailable(appointmentDate, time);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        error: 'This time slot is already booked. Please choose another time.',
      });
    }

    let service = null;
    if (serviceId) {
      service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!service || !service.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Service is not available',
        });
      }
    }

    // Check doctor availability if doctorId is provided
    if (doctorId) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
      });

      if (!doctor || !doctor.isAvailable) {
        return res.status(400).json({
          success: false,
          error: 'Doctor is not available',
        });
      }
    }

    // Find or create user
    let userId = null;
    if (req.user) {
      userId = req.user.id;
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email: patientEmail },
        select: { id: true },
      });
      if (existingUser) {
        userId = existingUser.id;
      } else {
        try {
          const newUser = await prisma.user.create({
            data: {
              name: patientName,
              email: patientEmail,
              phone: patientPhone,
              role: 'USER',
              password: 'temporary_password_' + Date.now(),
            },
            select: { id: true },
          });
          userId = newUser.id;
        } catch (createError) {
          console.warn('Could not create user:', createError.message);
        }
      }
    }

    // Build appointment data
    const appointmentData = {
      patientName,
      patientEmail,
      patientPhone,
      patientAge: patientAge ? parseInt(patientAge) : null,
      patientGender,
      date: appointmentDate,
      time,
      notes: notes || '',
      symptoms: symptoms || '',
      isEmergency: isEmergency || false,
      location: location || 'Afilas General Hospital',
      status: 'PENDING',
      visitType: visitType || null,
      city: city || null,
      subCity: subCity || null,
      woreda: woreda || null,
      gpsPin: gpsPin || null,
      homeAddress: homeAddress || null,
    };

    // Add relations if they exist
    if (serviceId) {
      appointmentData.serviceId = serviceId;
    }
    if (doctorId) {
      appointmentData.doctorId = doctorId;
    }
    if (userId) {
      appointmentData.userId = userId;
    }

    // Build include options dynamically
    const includeOptions = {
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    };

    // Only include doctor if doctorId exists
    if (doctorId) {
      includeOptions.doctor = {
        select: {
          id: true,
          name: true,
          specialization: true, // ✅ FIXED: specialty -> specialization
        },
      };
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: includeOptions,
    });

    console.log(`✅ Appointment created: ${appointment.id} for ${appointment.patientName}`);

    // Send confirmation notification
    try {
      if (notificationService.sendAppointmentConfirmation) {
        await notificationService.sendAppointmentConfirmation(appointment);
        console.log('📧 Confirmation notification sent');
      }
    } catch (notifyError) {
      console.warn('⚠️ Failed to send confirmation notification:', notifyError.message);
    }

    res.status(201).json({
      success: true,
      data: mapAppointment(appointment),
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment: ' + error.message,
    });
  }
});

// ============================================================
// UPDATE appointment status - 🔥 ADMIN only
// ============================================================
router.patch('/:id/status', auth, authorize('ADMIN'), [
  body('status').isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'MISSED']),
  body('doctorId').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { status, doctorId } = req.body;

    console.log(`📡 Updating appointment ${id} to status: ${status}`);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    const updateData = { status };
    if (doctorId) {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
      });
      if (!doctor || !doctor.isAvailable) {
        return res.status(400).json({
          success: false,
          error: 'Doctor is not available',
        });
      }
      updateData.doctorId = doctorId;
    }

    const oldStatus = appointment.status;
    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true, // ✅ FIXED: specialty -> specialization
          },
        },
      },
    });

    console.log(`✅ Appointment ${id} status updated from ${oldStatus} to ${status}`);

    let notifications = { email: false, sms: false };
    
    if (status === 'CONFIRMED' && oldStatus !== 'CONFIRMED') {
      console.log(`📧 Sending CONFIRMED notification for appointment ${id}`);
      try {
        if (notificationService.sendAppointmentApproved) {
          const result = await notificationService.sendAppointmentApproved(updated);
          notifications.email = result.email?.success || false;
          notifications.sms = result.sms?.success || false;
        }
      } catch (error) {
        console.error('❌ Failed to send confirmation notification:', error);
      }
    }

    if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
      console.log(`📧 Sending CANCELLED notification for appointment ${id}`);
      try {
        if (notificationService.sendAppointmentRejected) {
          const result = await notificationService.sendAppointmentRejected(updated);
          notifications.email = result.email?.success || false;
          notifications.sms = result.sms?.success || false;
        }
      } catch (error) {
        console.error('❌ Failed to send cancellation notification:', error);
      }
    }

    res.json({
      success: true,
      data: mapAppointment(updated),
      message: `Appointment status updated to ${status}`,
      notifications: {
        emailSent: notifications.email,
        smsSent: notifications.sms
      }
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
    });
  }
});

// ============================================================
// UPDATE appointment details - 🔥 ADMIN only
// ============================================================
router.put('/:id', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      patientName, patientEmail, patientPhone, 
      patientAge, patientGender, date, time, 
      serviceId, doctorId, notes, symptoms, isEmergency, location,
      visitType, city, subCity, woreda, gpsPin, homeAddress
    } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    if (date && time) {
      const newDate = new Date(date);
      const isAvailable = await isTimeSlotAvailable(newDate, time, id);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          error: 'This time slot is already booked. Please choose another time.',
        });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        patientName: patientName || appointment.patientName,
        patientEmail: patientEmail || appointment.patientEmail,
        patientPhone: patientPhone || appointment.patientPhone,
        patientAge: patientAge !== undefined ? parseInt(patientAge) : appointment.patientAge,
        patientGender: patientGender || appointment.patientGender,
        date: date ? new Date(date) : appointment.date,
        time: time || appointment.time,
        serviceId: serviceId !== undefined ? serviceId : appointment.serviceId,
        doctorId: doctorId !== undefined ? doctorId : appointment.doctorId,
        notes: notes !== undefined ? notes : appointment.notes,
        symptoms: symptoms !== undefined ? symptoms : appointment.symptoms,
        isEmergency: isEmergency !== undefined ? isEmergency : appointment.isEmergency,
        location: location || appointment.location || 'Afilas General Hospital',
        visitType: visitType !== undefined ? visitType : appointment.visitType,
        city: city !== undefined ? city : appointment.city,
        subCity: subCity !== undefined ? subCity : appointment.subCity,
        woreda: woreda !== undefined ? woreda : appointment.woreda,
        gpsPin: gpsPin !== undefined ? gpsPin : appointment.gpsPin,
        homeAddress: homeAddress !== undefined ? homeAddress : appointment.homeAddress,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true, // ✅ FIXED: specialty -> specialization
          },
        },
      },
    });

    res.json({
      success: true,
      data: mapAppointment(updated),
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
    });
  }
});

// ============================================================
// DELETE appointment - 🔥 ADMIN only
// ============================================================
router.delete('/:id', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment',
    });
  }
});

// ============================================================
// CANCEL appointment - 🔥 USER can cancel their own appointments
// ============================================================
router.delete('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    if (appointment.userId !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to cancel this appointment',
      });
    }

    if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel appointment with status: ${appointment.status}`,
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    try {
      if (notificationService.sendAppointmentCancelled) {
        await notificationService.sendAppointmentCancelled(updated);
        console.log(`📧 Cancellation notification sent for appointment ${id}`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to send cancellation notification:', error.message);
    }

    res.json({
      success: true,
      data: mapAppointment(updated),
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel appointment',
    });
  }
});

// ============================================================
// GET available time slots for a date
// ============================================================
router.get('/available-slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { doctorId } = req.query;
    
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
      });
    }

    const where = {
      date: appointmentDate,
      NOT: {
        status: {
          in: ['CANCELLED', 'MISSED']
        }
      }
    };
    
    if (doctorId) {
      where.doctorId = doctorId;
    }

    const bookedAppointments = await prisma.appointment.findMany({
      where,
      select: {
        time: true,
      },
    });

    const bookedSlots = bookedAppointments.map(a => a.time);

    // Define all possible time slots (9 AM to 5 PM, 30 min intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(time);
      }
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: {
        date: date,
        availableSlots: availableSlots,
        bookedSlots: bookedSlots,
        totalSlots: allSlots.length,
        availableCount: availableSlots.length,
      },
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots',
    });
  }
});

module.exports = router;