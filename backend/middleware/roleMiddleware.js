const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
        }
        next();
    };
};

module.exports = roleMiddleware;
