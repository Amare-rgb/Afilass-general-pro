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
  };
}

// ============================================================
// GET all appointments - 🔥 ADMIN and USER only
// ============================================================
router.get('/', auth, authorize('ADMIN', 'USER'), async (req, res) => {
  try {
    const { status, startDate, endDate, location } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
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
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
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
// Users can book appointments without login
// ============================================================
router.post('/', [
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientEmail').isEmail().withMessage('Valid email is required'),
  body('patientPhone').trim().notEmpty().withMessage('Phone number is required'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Valid date is required (YYYY-MM-DD)'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required (HH:MM)'),
  body('serviceId').optional().isString(),
  body('location').optional().isString(),
  body('notes').optional().isString(),
  body('symptoms').optional().isString(),
  body('isEmergency').optional().isBoolean(),
  body('patientAge').optional().isInt({ min: 0, max: 150 }),
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
      patientGender, date, time, serviceId,
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

    // Build appointment data - NO doctor fields
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

    if (serviceId) {
      appointmentData.serviceId = serviceId;
    }

    if (userId) {
      appointmentData.user = {
        connect: { id: userId }
      };
    }

    const appointment = await prisma.appointment.create({
      data: appointmentData,
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
      },
    });

    console.log(`✅ Appointment created: ${appointment.id} for ${appointment.patientName}`);

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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

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
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    const oldStatus = appointment.status;
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
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

    console.log(`✅ Appointment ${id} status updated from ${oldStatus} to ${status}`);

    // ============================================================
    // 🔥 SEND NOTIFICATIONS
    // ============================================================
    let notifications = { email: false, sms: false };
    
    // ✅ APPROVED - when status changes to CONFIRMED
    if (status === 'CONFIRMED' && oldStatus !== 'CONFIRMED') {
      console.log(`📧 Sending APPROVED notification for appointment ${id}`);
      try {
        const result = await notificationService.sendAppointmentApproved(updated);
        notifications.email = result.email?.success || false;
        notifications.sms = result.sms?.success || false;
        
        if (notifications.email) {
          console.log(`✅ Approval email sent to ${appointment.patientEmail}`);
        }
        if (notifications.sms) {
          console.log(`✅ Approval SMS sent to ${appointment.patientPhone}`);
        }
      } catch (error) {
        console.error('❌ Failed to send approval notification:', error);
      }
    }

    // ❌ REJECTED - when status changes to CANCELLED
    if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
      console.log(`📧 Sending REJECTED notification for appointment ${id}`);
      try {
        const result = await notificationService.sendAppointmentRejected(updated);
        notifications.email = result.email?.success || false;
        notifications.sms = result.sms?.success || false;
        
        if (notifications.email) {
          console.log(`✅ Rejection email sent to ${appointment.patientEmail}`);
        }
        if (notifications.sms) {
          console.log(`✅ Rejection SMS sent to ${appointment.patientPhone}`);
        }
      } catch (error) {
        console.error('❌ Failed to send rejection notification:', error);
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
      serviceId, notes, symptoms, isEmergency, location,
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