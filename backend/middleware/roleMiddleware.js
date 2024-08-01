// middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Permission denied' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  