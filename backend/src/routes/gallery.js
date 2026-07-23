// backend/src/routes/gallery.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { includeInactive } = req.query;
    
    const where = {};
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    // Map response to include caption as well
    const mappedGallery = gallery.map(item => ({
      ...item,
      caption: item.description || '',
    }));

    res.json({
      success: true,
      data: mappedGallery,
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery',
    });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      data: {
        ...item,
        caption: item.description || '',
      },
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery item',
    });
  }
});

// Create gallery item (Admin only)
router.post('/', 
  auth, 
  authorize('SUPER_ADMIN', 'ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['IMAGE', 'VIDEO']).withMessage('Type must be IMAGE or VIDEO'),
    body('url').trim().notEmpty().withMessage('URL is required'),
    body('url').custom(isValidUrl).withMessage('Invalid URL format'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { 
        title, 
        description, 
        caption,
        type, 
        url, 
        thumbnail, 
        order 
      } = req.body;

      // Check if URL already exists
      const existing = await prisma.gallery.findFirst({
        where: { url },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'A gallery item with this URL already exists',
        });
      }

      const gallery = await prisma.gallery.create({
        data: {
          title,
          description: description || caption || '',
          type,
          url,
          thumbnail: thumbnail || null,
          order: order || 0,
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          ...gallery,
          caption: gallery.description || '',
        },
        message: 'Gallery item created successfully',
      });
    } catch (error) {
      console.error('Create gallery error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create gallery item',
      });
    }
  }
);

// Update gallery item (Admin only)
router.put('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        caption,
        type, 
        url, 
        thumbnail, 
        isActive, 
        order 
      } = req.body;

      const existing = await prisma.gallery.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Gallery item not found',
        });
      }

      // Check if URL already exists (if changing)
      if (url && url !== existing.url) {
        const urlExists = await prisma.gallery.findFirst({
          where: { 
            url,
            NOT: { id },
          },
        });
        if (urlExists) {
          return res.status(400).json({
            success: false,
            error: 'A gallery item with this URL already exists',
          });
        }
      }

      const updated = await prisma.gallery.update({
        where: { id },
        data: {
          title: title || existing.title,
          description: description !== undefined ? description : caption !== undefined ? caption : existing.description,
          type: type || existing.type,
          url: url || existing.url,
          thumbnail: thumbnail !== undefined ? thumbnail : existing.thumbnail,
          isActive: isActive !== undefined ? isActive : existing.isActive,
          order: order !== undefined ? order : existing.order,
        },
      });

      res.json({
        success: true,
        data: {
          ...updated,
          caption: updated.description || '',
        },
        message: 'Gallery item updated successfully',
      });
    } catch (error) {
      console.error('Update gallery error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update gallery item',
      });
    }
  }
);

// Delete gallery item (Admin only)
router.delete('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.gallery.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Gallery item not found',
        });
      }

      await prisma.gallery.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Gallery item deleted successfully',
      });
    } catch (error) {
      console.error('Delete gallery error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete gallery item',
      });
    }
  }
);

// Reorder gallery items (Admin only)
router.put('/reorder',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          error: 'Items must be an array',
        });
      }

      const updates = items.map((item, index) =>
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: index },
        })
      );

      await prisma.$transaction(updates);

      res.json({
        success: true,
        message: 'Gallery reordered successfully',
      });
    } catch (error) {
      console.error('Reorder gallery error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to reorder gallery',
      });
    }
  }
);

module.exports = router;