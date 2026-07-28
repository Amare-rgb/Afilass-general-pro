// backend/src/routes/blog.js
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

// ===== GET ALL BLOG POSTS =====
router.get('/', async (req, res) => {
  try {
    const { published, limit, page, location, category, search } = req.query;
    
    const where = {};
    
    // Filter by published status
    if (published === 'true') {
      where.isPublished = true;
      where.publishedAt = { lte: new Date() };
    } else if (published === 'false') {
      where.isPublished = false;
    }

    // Filter by location
    if (location && location !== 'all') {
      where.location = location;
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Search by title, content, or excerpt
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const take = limit ? parseInt(limit) : 20;
    const pageNum = page ? parseInt(page) : 1;
    const skip = (pageNum - 1) * take;

    const [posts, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          videoUrl: true,
          author: true,
          authorId: true,
          category: true,
          location: true,
          tags: true,
          isPublished: true,
          publishedAt: true,
          views: true,
          likes: true,
          comments: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
      details: error.message,
    });
  }
});

// ===== GET BLOG POST BY SLUG =====
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await prisma.news.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    // Check if post is published (for public viewing)
    if (!post.isPublished) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({
          success: false,
          error: 'This post is not published',
        });
      }
    }

    // Increment views
    await prisma.news.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get blog post by slug error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post',
    });
  }
});

// ===== GET SINGLE BLOG POST BY ID =====
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await prisma.news.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post',
    });
  }
});

// ===== CREATE BLOG POST (Admin only) =====
router.post('/',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { 
        title, 
        content, 
        excerpt, 
        image, 
        videoUrl,
        author, 
        authorId,
        category,
        location,
        tags,
        isPublished 
      } = req.body;

      // Generate unique slug
      let slug = generateSlug(title);
      let existing = await prisma.news.findUnique({ where: { slug } });
      
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const post = await prisma.news.create({
        data: {
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 200),
          image: image || '',
          videoUrl: videoUrl || '',
          author,
          authorId: authorId || '',
          category: category || 'General',
          location: location || 'Afilas General Hospital',
          tags: tags || [],
          isPublished: isPublished || false,
          publishedAt: isPublished ? new Date() : null,
          views: 0,
          likes: 0,
          comments: 0,
        },
      });

      console.log(`✅ Blog post created: ${post.title}`);
      res.status(201).json({
        success: true,
        data: post,
        message: 'Blog post created successfully',
      });
    } catch (error) {
      console.error('❌ Create blog post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create blog post',
        details: error.message,
      });
    }
  }
);

// ===== UPDATE BLOG POST (Admin only) =====
router.put('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        title, 
        content, 
        excerpt, 
        image, 
        videoUrl,
        author, 
        authorId,
        category,
        location,
        tags,
        isPublished 
      } = req.body;

      const existing = await prisma.news.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Blog post not found',
        });
      }

      let data = {
        title: title || existing.title,
        content: content || existing.content,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        image: image !== undefined ? image : existing.image,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        author: author || existing.author,
        authorId: authorId !== undefined ? authorId : existing.authorId,
        category: category || existing.category,
        location: location || existing.location,
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

      console.log(`✅ Blog post updated: ${updated.title}`);
      res.json({
        success: true,
        data: updated,
        message: 'Blog post updated successfully',
      });
    } catch (error) {
      console.error('❌ Update blog post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update blog post',
      });
    }
  }
);

// ===== PARTIAL UPDATE BLOG POST (Admin only) =====
router.patch('/:id',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const existing = await prisma.news.findUnique({
        where: { id },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Blog post not found',
        });
      }

      // Handle publication status
      if (updates.isPublished !== undefined && updates.isPublished !== existing.isPublished) {
        updates.publishedAt = updates.isPublished ? new Date() : null;
      }

      const updated = await prisma.news.update({
        where: { id },
        data: updates,
      });

      res.json({
        success: true,
        data: updated,
        message: 'Blog post updated successfully',
      });
    } catch (error) {
      console.error('❌ Patch blog post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update blog post',
      });
    }
  }
);

// ===== DELETE BLOG POST (Admin only) =====
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
          error: 'Blog post not found',
        });
      }

      await prisma.news.delete({
        where: { id },
      });

      console.log(`🗑️ Blog post deleted: ${existing.title}`);
      res.json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      console.error('❌ Delete blog post error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete blog post',
      });
    }
  }
);

// ===== LIKE A BLOG POST =====
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.news.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    const updated = await prisma.news.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    res.json({
      success: true,
      data: { likes: updated.likes },
    });
  } catch (error) {
    console.error('❌ Like blog post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like blog post',
    });
  }
});

// ===== GET BLOG POSTS BY LOCATION =====
router.get('/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { limit, page } = req.query;

    const take = limit ? parseInt(limit) : 10;
    const pageNum = page ? parseInt(page) : 1;
    const skip = (pageNum - 1) * take;

    const where = {
      location: location,
      isPublished: true,
      publishedAt: { lte: new Date() },
    };

    const [posts, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          videoUrl: true,
          author: true,
          category: true,
          tags: true,
          views: true,
          likes: true,
          comments: true,
          createdAt: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Get blog posts by location error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
    });
  }
});

// ===== GET BLOG POSTS BY CATEGORY =====
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit, page } = req.query;

    const take = limit ? parseInt(limit) : 10;
    const pageNum = page ? parseInt(page) : 1;
    const skip = (pageNum - 1) * take;

    const where = {
      category: category,
      isPublished: true,
      publishedAt: { lte: new Date() },
    };

    const [posts, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          videoUrl: true,
          author: true,
          category: true,
          tags: true,
          views: true,
          likes: true,
          comments: true,
          createdAt: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Get blog posts by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts',
    });
  }
});

// ===== GET BLOG STATISTICS (Admin only) =====
router.get('/stats',
  auth,
  authorize('SUPER_ADMIN', 'ADMIN'),
  async (req, res) => {
    try {
      const [total, published, draft, totalViews, totalLikes, byLocation, byCategory] = await Promise.all([
        prisma.news.count(),
        prisma.news.count({ where: { isPublished: true } }),
        prisma.news.count({ where: { isPublished: false } }),
        prisma.news.aggregate({ _sum: { views: true } }),
        prisma.news.aggregate({ _sum: { likes: true } }),
        prisma.news.groupBy({
          by: ['location'],
          _count: true,
        }),
        prisma.news.groupBy({
          by: ['category'],
          _count: true,
        }),
      ]);

      const locationStats = {};
      byLocation.forEach(item => {
        locationStats[item.location] = item._count;
      });

      const categoryStats = {};
      byCategory.forEach(item => {
        categoryStats[item.category] = item._count;
      });

      res.json({
        success: true,
        data: {
          total,
          published,
          draft,
          totalViews: totalViews._sum.views || 0,
          totalLikes: totalLikes._sum.likes || 0,
          byLocation: locationStats,
          byCategory: categoryStats,
        },
      });
    } catch (error) {
      console.error('Get blog stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch blog statistics',
      });
    }
  }
);

module.exports = router;