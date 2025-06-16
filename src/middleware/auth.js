const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database to ensure they still exist and are active
        const user = await User.findOne({
            where: { id: decoded.userId, is_active: true },
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next();
};

// Middleware to check if user is super admin (platform admin)
const isSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin' || req.user.restaurant_id !== null) {
        return res.status(403).json({ message: 'Super admin access required' });
    }

    next();
};

// Middleware to check if user is restaurant staff or admin
const isRestaurantStaff = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!['staff', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Restaurant staff access required' });
    }

    next();
};

// Middleware to check if user can access specific restaurant
const canAccessRestaurant = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const restaurantId = req.params.restaurantId || req.body.restaurant_id;

    // Super admin can access any restaurant
    if (req.user.role === 'admin' && req.user.restaurant_id === null) {
        return next();
    }

    // Restaurant admin/staff can only access their own restaurant
    if (req.user.restaurant_id && req.user.restaurant_id.toString() === restaurantId) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied to this restaurant' });
};

module.exports = {
    authenticateToken,
    isAdmin,
    isSuperAdmin,
    isRestaurantStaff,
    canAccessRestaurant,
    JWT_SECRET
};
