const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get all news
router.get('/', async (req, res) => {
  try {
    const { published, limit, page } = req.query;
    
    const where = {};
    if (published === 'true') {
      where.isPublished = true;
      where.publishedAt = { lte: new Date() };
    } else if (published === 'false') {
      where.isPublished = false;
    }

    const take = limit ? parseInt(limit) : 10;
    const skip = page ? (parseInt(page) - 1) * take : 0;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.news.count({ where }),
    ]);

    res.json({
      success: true,
      data: news,
      pagination: {
        total,
        page: page ? parseInt(page) : 1,
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
    });
  }
});

// Get news by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const news = await prisma.news.findUnique({
      where: { slug },
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }

    // Increment views
    await prisma.news.update({
      where: { id: news.id },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Get news by slug error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
    });
  }
});

// Get single news
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: 'News not found',
      });
    }

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
    });
  }
});

// Create news (Admin only)
router.post('/',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('author').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, content, excerpt, image, author, isPublished, tags } = req.body;

      // Generate unique slug
      let slug = generateSlug(title);
      let existing = await prisma.news.findUnique({ where: { slug } });
      
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const news = await prisma.news.create({
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 200),
          image,
          author,
          isPublished: isPublished || false,
          publishedAt: isPublished ? new Date() : null,
          tags: tags || [],
        },
      });

      res.status(201).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Create news error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create news',
      });
    }
  }
);

// Update news (Admin only)
router.put('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, excerpt, image, author, isPublished, tags } = req.body;

      const existing = await prisma.news.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'News not found',
        });
      }

      let data = {
        title: title || existing.title,
        content: content || existing.content,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        image: image !== undefined ? image : existing.image,
        author: author || existing.author,
        tags: tags !== undefined ? tags : existing.tags,
      };

      // Update slug if title changed
      if (title && title !== existing.title) {
        let slug = generateSlug(title);
        let slugExists = await prisma.news.findFirst({
          where: { slug, id: { not: id } },
        });
        if (slugExists) {
          slug = `${slug}-${Date.now()}`;
        }
        data.slug = slug;
      }

      // Handle publication status
      if (isPublished !== undefined && isPublished !== existing.isPublished) {
        data.isPublished = isPublished;
        data.publishedAt = isPublished ? new Date() : null;
      }

      const updated = await prisma.news.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Update news error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update news',
      });
    }
  }
);

// Delete news (Admin only)
router.delete('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.news.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'News not found',
        });
      }

      await prisma.news.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'News deleted successfully',
      });
    } catch (error) {
      console.error('Delete news error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete news',
      });
    }
  }
);

module.exports = router;