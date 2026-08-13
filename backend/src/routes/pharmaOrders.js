// backend/src/routes/pharmaOrders.js

const express = require('express');
const { body, validationResult, query, param } = require('express-validator');

const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');
const notificationService = require('../lib/notificationService');

const router = express.Router();

// ============================================================
// GET all pharma orders (Admin only)
// ============================================================
router.get('/', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { status, customerEmail, customerPhone } = req.query;
    const where = {};
    
    if (status) where.status = status.toUpperCase();
    if (customerEmail) {
      where.customerEmail = { contains: customerEmail, mode: 'insensitive' };
    }
    if (customerPhone) {
      where.customerPhone = { contains: customerPhone };
    }

    console.log('📡 Fetching pharma orders with where:', where);

    const orders = await prisma.pharmaOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Found ${orders.length} pharma orders`);

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get pharma orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pharma orders: ' + error.message
    });
  }
});

// ============================================================
// ✅ FIXED: CREATE pharma order (Public - no auth)
// ============================================================
router.post('/', [
  body('customerName')
    .notEmpty().withMessage('Full name is required')
    .isString()
    .isLength({ min: 2, max: 100 }),
  body('customerEmail')
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .normalizeEmail(),
  body('customerPhone')
    .notEmpty().withMessage('Phone number is required')
    .isString()
    .matches(/^[\+\d\s\-\(\)]{7,20}$/),
  body('drugName')
    .notEmpty().withMessage('Drug name is required')
    .isString()
    .isLength({ min: 2, max: 200 }),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 100000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { customerName, customerEmail, customerPhone, drugName, quantity } = req.body;

    console.log('📝 Creating pharma order:', { customerName, customerEmail, drugName, quantity });

    // ✅ Get current date and time
    const now = new Date();
    const orderDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const orderTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    // ✅ Create order with ALL required fields
    const order = await prisma.pharmaOrder.create({
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        drugName: drugName.trim(),
        quantity: parseInt(quantity),
        status: 'PENDING',
        orderDate: orderDate,   // ✅ Required field
        orderTime: orderTime,   // ✅ Required field
      }
    });

    console.log(`✅ New pharma order created: ${order.id}`);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Create pharma order error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to place order'
    });
  }
});

// ============================================================
// UPDATE status (Admin only) - WITH NOTIFICATIONS
// ============================================================
router.patch('/:id/status', auth, authorize('ADMIN'), [
  param('id').isString().withMessage('Invalid order ID'),
  body('status')
    .notEmpty()
    .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await prisma.pharmaOrder.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const oldStatus = existingOrder.status;
    const updatedOrder = await prisma.pharmaOrder.update({
      where: { id },
      data: { status }
    });

    console.log(`✅ Order ${id} status updated from ${oldStatus} to ${status}`);

    // ============================================================
    // 🔥 SEND NOTIFICATIONS USING notificationService
    // ============================================================
    let notifications = { email: false, sms: false };
    
    // ✅ APPROVED - when status changes to COMPLETED
    if (status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
      console.log(`📧 Sending APPROVED notification for order ${id}`);
      try {
        const result = await notificationService.sendPharmaOrderApproved(updatedOrder);
        notifications.email = result.email?.success || false;
        notifications.sms = result.sms?.success || false;
        
        if (notifications.email) {
          console.log(`✅ Approval email sent to ${updatedOrder.customerEmail}`);
        }
        if (notifications.sms) {
          console.log(`✅ Approval SMS sent to ${updatedOrder.customerPhone}`);
        }
      } catch (error) {
        console.error('❌ Failed to send approval notification:', error);
      }
    }

    // ❌ REJECTED - when status changes to CANCELLED
    if (status === 'CANCELLED' && oldStatus !== 'CANCELLED') {
      console.log(`📧 Sending REJECTED notification for order ${id}`);
      try {
        const result = await notificationService.sendPharmaOrderRejected(updatedOrder);
        notifications.email = result.email?.success || false;
        notifications.sms = result.sms?.success || false;
        
        if (notifications.email) {
          console.log(`✅ Rejection email sent to ${updatedOrder.customerEmail}`);
        }
        if (notifications.sms) {
          console.log(`✅ Rejection SMS sent to ${updatedOrder.customerPhone}`);
        }
      } catch (error) {
        console.error('❌ Failed to send rejection notification:', error);
      }
    }

    res.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`,
      notifications: {
        emailSent: notifications.email,
        smsSent: notifications.sms
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order status'
    });
  }
});

// ============================================================
// DELETE order (Admin only)
// ============================================================
router.delete('/:id', auth, authorize('ADMIN'), [
  param('id').isString().withMessage('Invalid order ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;

    const existingOrder = await prisma.pharmaOrder.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await prisma.pharmaOrder.delete({
      where: { id }
    });

    console.log(`🗑️ Order ${id} deleted successfully`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete order'
    });
  }
});

// ============================================================
// GET pharma order statistics (Admin only)
// ============================================================
router.get('/stats/summary', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const [total, pending, processing, completed, cancelled] = await Promise.all([
      prisma.pharmaOrder.count(),
      prisma.pharmaOrder.count({ where: { status: 'PENDING' } }),
      prisma.pharmaOrder.count({ where: { status: 'PROCESSING' } }),
      prisma.pharmaOrder.count({ where: { status: 'COMPLETED' } }),
      prisma.pharmaOrder.count({ where: { status: 'CANCELLED' } }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        processing,
        completed,
        cancelled
      }
    });
  } catch (error) {
    console.error('Get pharma orders stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;