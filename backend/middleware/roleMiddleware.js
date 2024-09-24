const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
      if (!requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  