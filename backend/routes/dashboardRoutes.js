const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Example protected route
router.get('/', verifyToken, (req, res) => {
  res.json({ msg: 'Welcome to the dashboard!' });
});

module.exports = router;
