module.exports = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user in request' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}` 
            });
        }

        next();
    };
};
