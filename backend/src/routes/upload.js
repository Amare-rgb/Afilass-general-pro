// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['doctors', 'departments', 'gallery', 'news', 'services'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
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
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];

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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
  },
});

// ===== FIX: Return absolute URL so Next.js frontend (port 3000) can load images from backend (port 5000) =====
router.post('/', auth, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const type = req.query.type || 'doctors';
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${type}/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
    });
  }
});

// Upload single file (with type parameter)
router.post('/single', auth, authorize('SUPER_ADMIN', 'ADMIN'), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const type = req.query.type || 'general';
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${type}/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
    });
  }
});

// Upload multiple files
router.post('/multiple', auth, authorize('SUPER_ADMIN', 'ADMIN'), upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
    }

    const type = req.query.type || 'general';
    const files = req.files.map(file => ({
      filename: file.filename,
      url: `${req.protocol}://${req.get('host')}/uploads/${type}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
    });
  }
});

// Delete file
router.delete('/:type/:filename', auth, authorize('SUPER_ADMIN', 'ADMIN'), (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    fs.unlinkSync(filePath);

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