const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const mailer = require('../lib/mailer');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Submit contact form
router.post('/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().notEmpty(),
    body('message').trim().notEmpty().isLength({ min: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, phone, subject, message } = req.body;

      // Check for spam (simple check - 3 messages per hour)
      const recentMessages = await prisma.contact.count({
        where: {
          email,
          createdAt: {
            gte: new Date(Date.now() - 3600000), // Last hour
          },
        },
      });

      if (recentMessages >= 3) {
        return res.status(429).json({
          success: false,
          error: 'Too many messages. Please try again later.',
        });
      }

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'UNREAD',
        },
      });

      // Send confirmation email
      try {
        await mailer.sendContactConfirmation(contact);
      } catch (emailError) {
        console.error('Failed to send contact confirmation:', emailError);
      }

      res.status(201).json({
        success: true,
        data: contact,
        message: 'Your message has been sent successfully.',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
      });
    }
  }
);

// Get all contacts (Admin only)
router.get('/',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { status, limit, page } = req.query;
      
      const where = {};
      if (status) where.status = status;

      const take = limit ? parseInt(limit) : 20;
      const skip = page ? (parseInt(page) - 1) * take : 0;

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take,
          skip,
        }),
        prisma.contact.count({ where }),
      ]);

      res.json({
        success: true,
        data: contacts,
        pagination: {
          total,
          page: page ? parseInt(page) : 1,
          limit: take,
          pages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contacts',
      });
    }
  }
);

// Get single contact (Admin only)
router.get('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found',
        });
      }

      // Mark as read if unread
      if (contact.status === 'UNREAD') {
        await prisma.contact.update({
          where: { id },
          data: { status: 'READ' },
        });
        contact.status = 'READ';
      }

      res.json({
        success: true,
        data: contact,
      });
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch contact',
      });
    }
  }
);

// Update contact status (Admin only)
router.patch('/:id/status',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  [
    body('status').isIn(['UNREAD', 'READ', 'REPLIED']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found',
        });
      }

      const updated = await prisma.contact.update({
        where: { id },
        data: { status },
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Update contact status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update contact status',
      });
    }
  }
);

// Delete contact (Admin only)
router.delete('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        return res.status(404).json({
          success: false,
          error: 'Contact not found',
        });
      }

      await prisma.contact.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Contact deleted successfully',
      });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete contact',
      });
    }
  }
);

module.exports = router;