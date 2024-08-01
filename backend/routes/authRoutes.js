
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const multer = require('multer');
const { Readable } = require('stream');
const verifyToken = require('../middleware/verifyToken');

// Initialize GridFS
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Signup route
router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty().isIn(['staff', 'doctor']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      // Check if username or email already exists
      let existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username or email already exists' });
      }

      // Create new user
      const newUser = new User({ username, email, password, role });

      // Save new user (password will be hashed by the pre-save middleware)
      await newUser.save();

      // Generate JWT token
      const payload = { user: { id: newUser.id, role: newUser.role } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.log('JWT Signing Error:', err);
          return res.status(500).json({ msg: 'Token generation failed' });
        }
        res.status(201).json({ token, msg: 'User registered successfully' });
      });

      // Create user directory in GridFS
      const userDir = path.join(__dirname, "../workshop/patients", username);
      try {
        if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
          console.log('Directory created:', userDir);
        }
      } catch (err) {
        console.error('Error creating directory:', err);
        return res.status(500).json({ msg: 'Failed to create user directory' });
      }
    } catch (error) {
      console.error('Signup Error:', error.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);
// Login route
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty().isIn(['staff', 'doctor']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check if the role matches
      if (user.role !== role) {
        return res.status(400).json({ msg: 'Invalid role selected' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Generate JWT token
      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token,userId: user.id });
      });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token, authorization denied' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) return res.status(401).json({ msg: 'User not found' });

    const payload = { user: { id: user.id, role: user.role } };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh Token Error:', err);
    res.status(401).json({ msg: 'Invalid refresh token' });
  }
});
// Middleware to check roles
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Permission denied' });
    }
    next();
  };
};

// @route    POST api/auth/upload
// @desc     Upload file
// @access   Private
router.post('/upload', verifyToken, roleMiddleware(['staff']), upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file provided' });
  }

  const file = req.file;
  const userId = req.user.id; // Get user ID from authentication middleware

  if (!gfs) {
    return res.status(500).json({ msg: 'GridFS not initialized' });
  }

  const uploadStream = gfs.createWriteStream({
    filename: file.originalname,
    content_type: file.mimetype,
    metadata: { userId } // Add user ID to metadata
  });

  const readableStream = new Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  readableStream.pipe(uploadStream);

  uploadStream.on('finish', () => {
    res.status(201).json({ msg: 'File uploaded successfully' });
  });

  uploadStream.on('error', (err) => {
    console.error('Upload Error:', err.message);
    res.status(500).json({ msg: 'Failed to upload file' });
  });
});

// @route    GET api/auth/files/:filename
// @desc     Get a file by filename
// @access   Private
router.get('/files/:filename', verifyToken, (req, res) => {
  if (!gfs) {
    return res.status(500).json({ msg: 'GridFS not initialized' });
  }

  const userId = req.user.id; // Get user ID from authentication middleware
  const userRole = req.user.role;

  gfs.files.findOne({ filename: req.params.filename, 'metadata.userId': userId }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ msg: 'No file found' });
    }

    if (userRole === 'doctor' && file.metadata.userId !== userId) {
      return res.status(403).json({ msg: 'Permission denied' });
    }

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.pipe(res);
  });
});

module.exports = router;
