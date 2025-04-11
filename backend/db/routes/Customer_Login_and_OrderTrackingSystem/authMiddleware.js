const jwt = require('jsonwebtoken');

const authenticateCustomer = (req, res, next) => {
    try {
        // Get token from cookies (preferred) or Authorization header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.customer = decoded;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        // Clear invalid token cookie if present
        if (req.cookies.token) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = {
    authenticateCustomer
};