
// const jwt = require('jsonwebtoken');
// const config = require('config'); // Include config if you're using it for secrets

// const verifyToken = (req, res, next) => {
//   // Get token from headers
//   const token = req.headers['x-auth-token'] || req.headers.authorization?.split(' ')[1]; // Handle Bearer token format

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     // Verify token
//     const secret = config.get('jwtSecret') || process.env.JWT_SECRET; // Use config or environment variable for secret
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded.user; // Attach user info to request
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// module.exports = verifyToken;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the secret used in your signup

const verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('No token, authorization denied');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user; // Attach user information to the request
    next();
  } catch (err) {
    console.error('Token is not valid:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
