// backend/src/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['doctors', 'departments', 'gallery', 'news', 'services', 'blog'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created upload directory: ${dirPath}`);
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'doctors';
    const uploadPath = path.join(__dirname, '../../uploads', type);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const filename = `${cleanName}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and MP4 videos are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  },
});

// ============================================================
// FIXED: Upload route - Only ADMIN (removed SUPER_ADMIN)
// ============================================================

// ===== MAIN UPLOAD ROUTE - Accepts 'image' field name =====
router.post('/', auth, authorize('ADMIN'), (req, res) => {
  console.log('📤 Upload request received');
  console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);
  console.log('📁 Query type:', req.query.type);

  // ✅ Check if user is authenticated
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  upload.single('image')(req, res, function(err) {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 10MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const type = req.query.type || 'doctors';
      const relativePath = `/uploads/${type}/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      console.log(`✅ File uploaded: ${req.file.filename}`);
      console.log(`📁 Relative path: ${relativePath}`);
      console.log(`🔗 Full URL: ${fullUrl}`);

      res.json({
        success: true,
        url: relativePath,
        fullUrl: fullUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        success: false,
        error: 'File upload failed',
      });
    }
  });
});

// ===== UPLOAD WITH 'file' FIELD NAME =====
router.post('/file', auth, authorize('ADMIN'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const type = req.query.type || 'doctors';
      const relativePath = `/uploads/${type}/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      res.json({
        success: true,
        url: relativePath,
        fullUrl: fullUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        success: false,
        error: 'File upload failed',
      });
    }
  });
});

// Upload single file
router.post('/single', auth, authorize('ADMIN'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const type = req.query.type || 'general';
      const relativePath = `/uploads/${type}/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      res.json({
        success: true,
        data: {
          filename: req.file.filename,
          url: relativePath,
          fullUrl: fullUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        success: false,
        error: 'File upload failed',
      });
    }
  });
});

// Upload multiple files
router.post('/multiple', auth, authorize('ADMIN'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  upload.array('files', 10)(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
        });
      }

      const type = req.query.type || 'general';
      const files = req.files.map(file => {
        const relativePath = `/uploads/${type}/${file.filename}`;
        return {
          filename: file.filename,
          url: relativePath,
          fullUrl: `${req.protocol}://${req.get('host')}${relativePath}`,
          size: file.size,
          mimetype: file.mimetype,
        };
      });

      res.json({
        success: true,
        data: files,
        count: files.length,
      });
    } catch (error) {
      console.error('Upload multiple error:', error);
      res.status(500).json({
        success: false,
        error: 'File upload failed',
      });
    }
  });
});

// Delete file
router.delete('/:type/:filename', auth, authorize('ADMIN'), (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (filename.includes('..') || type.includes('..')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file path',
      });
    }
    
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    fs.unlinkSync(filePath);

    console.log(`✅ File deleted: ${filePath}`);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
    });
  }
});

module.exports = router;