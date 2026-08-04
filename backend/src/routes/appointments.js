const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const mailer = require('../lib/mailer');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper to map appointment for frontend
function mapAppointment(appointment) {
  return {
    id: appointment.id,
    patientName: appointment.patientName,
    patientEmail: appointment.patientEmail,
    patientPhone: appointment.patientPhone,
    patientAge: appointment.patientAge,
    patientGender: appointment.patientGender,
    departmentId: null,
    department: null,
    doctorId: appointment.doctorId,
    doctor: appointment.doctor ? {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      title: appointment.doctor.specialization || null,
      specialization: appointment.doctor.specialization,
    } : null,
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
  };
}

// Get all appointments with location filter
router.get('/', auth, authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR'), async (req, res) => {
  try {
    const { status, startDate, endDate, doctorId, location } = req.query;
    
    const where = {};
    
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

    // If user is DOCTOR, only show their appointments
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findFirst({
        where: { email: req.user.email },
        select: { id: true },
      });
      if (doctor) {
        where.doctorId = doctor.id;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
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
      },
      orderBy: { date: 'asc' },
    });

    // Map appointments for frontend
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

// Get single appointment
router.get('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR'), async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
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
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    // If user is DOCTOR, check if they own this appointment
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findFirst({
        where: { email: req.user.email },
        select: { id: true },
      });
      if (doctor && appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to view this appointment',
        });
      }
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

// Create appointment - SERVICE ID IS NOW OPTIONAL
router.post('/', [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientEmail').isEmail().withMessage('Valid email is required'),
  body('patientPhone').trim().notEmpty().withMessage('Phone number is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
  body('doctorId').notEmpty().withMessage('Doctor is required'),
  // serviceId is now optional - removed .notEmpty()
  body('serviceId').optional().isString().withMessage('Service ID must be a string'),
  body('location').optional().isString(),
  body('notes').optional().isString(),
  body('symptoms').optional().isString(),
  body('isEmergency').optional().isBoolean(),
  body('patientAge').optional().isInt({ min: 0, max: 150 }),
  body('patientGender').optional().isIn(['MALE', 'FEMALE', 'OTHER']),
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
      patientGender, date, time, doctorId, serviceId,
      notes, symptoms, isEmergency, location 
    } = req.body;

    // Check if doctor exists and is available
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        workingHours: true,
      },
    });

    if (!doctor || !doctor.isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Doctor is not available',
      });
    }

    // Check if service exists - ONLY IF serviceId IS PROVIDED
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

    // Check if time slot is available
    const appointmentDate = new Date(date);
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        time,
        status: {
          notIn: ['CANCELLED', 'COMPLETED'],
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked',
      });
    }

    // Check working hours
    const dayOfWeek = appointmentDate.getDay();
    const workingHour = doctor.workingHours.find(
      wh => wh.dayOfWeek === dayOfWeek && wh.isAvailable
    );

    if (!workingHour) {
      return res.status(400).json({
        success: false,
        error: 'Doctor is not working on this day',
      });
    }

    // Find or create user if authenticated
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
      }
    }

    // Create appointment - serviceId is optional
    const appointmentData = {
      patientName,
      patientEmail,
      patientPhone,
      patientAge: patientAge ? parseInt(patientAge) : null,
      patientGender,
      date: appointmentDate,
      time,
      notes,
      symptoms,
      isEmergency: isEmergency || false,
      doctorId,
      userId: userId,
      location: location || 'Afilas General Hospital',
      status: 'PENDING',
    };

    // Only add serviceId if it's provided
    if (serviceId) {
      appointmentData.serviceId = serviceId;
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    // Send confirmation email
    try {
      await mailer.sendAppointmentConfirmation(appointment, doctor, service);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
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

// Update appointment status
router.patch('/:id/status', auth, authorize('SUPER_ADMIN', 'ADMIN', 'DOCTOR'), [
  body('status').isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
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

    // If user is DOCTOR, check if they own this appointment
    if (req.user.role === 'DOCTOR') {
      const doctor = await prisma.doctor.findFirst({
        where: { email: req.user.email },
        select: { id: true },
      });
      if (doctor && appointment.doctorId !== doctor.id) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to update this appointment',
        });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    // Send notification email for status changes
    if (status === 'CONFIRMED') {
      try {
        await mailer.sendAppointmentConfirmation(updated, updated.doctor, updated.service);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    res.json({
      success: true,
      data: mapAppointment(updated),
      message: `Appointment status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment',
    });
  }
});

// Update appointment details
router.put('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      patientName, patientEmail, patientPhone, 
      patientAge, patientGender, date, time, 
      doctorId, serviceId, notes, symptoms, isEmergency,
      location
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
        doctorId: doctorId || appointment.doctorId,
        serviceId: serviceId !== undefined ? serviceId : appointment.serviceId,
        notes: notes !== undefined ? notes : appointment.notes,
        symptoms: symptoms !== undefined ? symptoms : appointment.symptoms,
        isEmergency: isEmergency !== undefined ? isEmergency : appointment.isEmergency,
        location: location || appointment.location || 'Afilas General Hospital',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
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

// Delete appointment (Admin only)
router.delete('/:id', auth, authorize('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
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

// Cancel appointment (User)
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

    // Check permission
    if (appointment.userId !== req.user.id && req.user.role === 'USER') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to cancel this appointment',
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      data: updated,
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

module.exports = router;