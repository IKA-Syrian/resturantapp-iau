const express = require('express');
const router = express.Router();
const { Restaurant, User, MenuCategory, MenuItem, Order, OrderItem } = require('../models');
const { authenticateToken, isAdmin, isSuperAdmin, canAccessRestaurant } = require('../middleware/auth');

// =========== RESTAURANT MANAGEMENT ===========

// Get all restaurants (Super Admin only)
router.get('/restaurants', authenticateToken, isSuperAdmin, async (req, res, next) => {
    try {
        const restaurants = await Restaurant.findAll({
            include: [
                {
                    model: User,
                    as: 'staff',
                    where: { role: ['staff', 'admin'] },
                    required: false,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'role']
                }
            ]
        });
        res.json(restaurants);
    } catch (err) {
        next(err);
    }
});

// Get current restaurant (Restaurant Admin)
router.get('/restaurants/current', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        if (!req.user.restaurant_id) {
            return res.status(404).json({ message: 'No restaurant assigned' });
        }

        const restaurant = await Restaurant.findByPk(req.user.restaurant_id, {
            include: [
                {
                    model: MenuCategory,
                    as: 'menuCategories',
                    include: [
                        {
                            model: MenuItem,
                            as: 'menuItems'
                        }
                    ]
                }
            ]
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (err) {
        next(err);
    }
});

// Create restaurant (Super Admin only)
router.post('/restaurants', authenticateToken, isSuperAdmin, async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    } catch (err) {
        next(err);
    }
});

// Update restaurant
router.put('/restaurants/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.params.id;

        // Super admin can update any restaurant, restaurant admin can only update their own
        if (req.user.restaurant_id !== null && req.user.restaurant_id.toString() !== restaurantId) {
            return res.status(403).json({ message: 'Access denied to this restaurant' });
        }

        const [updatedRowsCount] = await Restaurant.update(req.body, {
            where: { id: restaurantId }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const updatedRestaurant = await Restaurant.findByPk(restaurantId);
        res.json(updatedRestaurant);
    } catch (err) {
        next(err);
    }
});

// Delete restaurant (Super Admin only)
router.delete('/restaurants/:id', authenticateToken, isSuperAdmin, async (req, res, next) => {
    try {
        const deletedRowsCount = await Restaurant.destroy({
            where: { id: req.params.id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// =========== MENU MANAGEMENT ===========

// Get menu for current restaurant
router.get('/menu', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.user.restaurant_id;
        if (!restaurantId) {
            return res.status(404).json({ message: 'No restaurant assigned' });
        }

        const categories = await MenuCategory.findAll({
            where: { restaurant_id: restaurantId },
            include: [
                {
                    model: MenuItem,
                    as: 'menuItems'
                }
            ],
            order: [['display_order', 'ASC'], [{ model: MenuItem, as: 'menuItems' }, 'id', 'ASC']]
        });

        res.json(categories);
    } catch (err) {
        next(err);
    }
});

// Create menu category
router.post('/menu/categories', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.user.restaurant_id;
        if (!restaurantId) {
            return res.status(400).json({ message: 'No restaurant assigned' });
        }

        const category = await MenuCategory.create({
            ...req.body,
            restaurant_id: restaurantId
        });

        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
});

// Update menu category
router.put('/menu/categories/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.user.restaurant_id;
        const [updatedRowsCount] = await MenuCategory.update(req.body, {
            where: {
                id: req.params.id,
                restaurant_id: restaurantId
            }
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await MenuCategory.findByPk(req.params.id);
        res.json(updatedCategory);
    } catch (err) {
        next(err);
    }
});

// Delete menu category
router.delete('/menu/categories/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.user.restaurant_id;
        const deletedRowsCount = await MenuCategory.destroy({
            where: {
                id: req.params.id,
                restaurant_id: restaurantId
            }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// Create menu item
router.post('/menu/items', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const { category_id, ...itemData } = req.body;

        // Verify category belongs to restaurant
        const category = await MenuCategory.findOne({
            where: {
                id: category_id,
                restaurant_id: req.user.restaurant_id
            }
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const menuItem = await MenuItem.create({
            ...itemData,
            category_id
        });

        res.status(201).json(menuItem);
    } catch (err) {
        next(err);
    }
});

// Update menu item
router.put('/menu/items/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findOne({
            where: { id: req.params.id },
            include: [{
                model: MenuCategory,
                as: 'category',
                where: { restaurant_id: req.user.restaurant_id }
            }]
        });

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        await menuItem.update(req.body);
        res.json(menuItem);
    } catch (err) {
        next(err);
    }
});

// Delete menu item
router.delete('/menu/items/:id', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const deletedRowsCount = await MenuItem.destroy({
            where: { id: req.params.id },
            include: [{
                model: MenuCategory,
                as: 'category',
                where: { restaurant_id: req.user.restaurant_id }
            }]
        });

        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// =========== ORDER MANAGEMENT ===========

// Get orders for current restaurant
router.get('/orders', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;
        const restaurantId = req.user.restaurant_id;

        if (!restaurantId) {
            return res.status(400).json({ message: 'No restaurant assigned' });
        }

        const whereClause = { restaurant_id: restaurantId };
        if (status) {
            whereClause.status = status;
        }

        const orders = await Order.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone_number']
                },
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: MenuItem,
                            as: 'menuItem',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json(orders);
    } catch (err) {
        next(err);
    }
});

// Update order status
router.put('/orders/:id/status', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const restaurantId = req.user.restaurant_id;

        const [updatedRowsCount] = await Order.update(
            { status },
            {
                where: {
                    id: req.params.id,
                    restaurant_id: restaurantId
                }
            }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const updatedOrder = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: OrderItem,
                    as: 'orderItems'
                }
            ]
        });

        res.json(updatedOrder);
    } catch (err) {
        next(err);
    }
});

// =========== USER MANAGEMENT ===========

// Get platform users (Super Admin only)
router.get('/users', authenticateToken, isSuperAdmin, async (req, res, next) => {
    try {
        const { role, restaurant_id } = req.query;
        const whereClause = { is_active: true };

        if (role) whereClause.role = role;
        if (restaurant_id) whereClause.restaurant_id = restaurant_id;

        const users = await User.findAll({
            where: whereClause,
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: Restaurant,
                    as: 'restaurant',
                    attributes: ['id', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(users);
    } catch (err) {
        next(err);
    }
});

// Create platform user (Super Admin only)
router.post('/users', authenticateToken, isSuperAdmin, async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, phone_number, role, restaurant_id } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = await User.create({
            email,
            password_hash: password, // Will be hashed by model hook
            first_name,
            last_name,
            phone_number,
            role,
            restaurant_id: role === 'customer' ? null : restaurant_id
        });

        // Don't send password hash in response
        const { password_hash, ...userWithoutPassword } = user.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
});

// =========== DASHBOARD STATS ===========

// Get dashboard statistics
router.get('/dashboard/stats', authenticateToken, isAdmin, async (req, res, next) => {
    try {
        const restaurantId = req.user.restaurant_id;

        if (!restaurantId) {
            // Super admin - get platform-wide stats
            const totalRestaurants = await Restaurant.count();
            const totalUsers = await User.count({ where: { role: 'customer' } });
            const totalOrders = await Order.count();
            const totalRevenue = await Order.sum('total_amount', {
                where: { status: 'completed' }
            });

            return res.json({
                totalRestaurants,
                totalUsers,
                totalOrders,
                totalRevenue: totalRevenue || 0
            });
        }

        // Restaurant admin - get restaurant-specific stats
        const totalOrders = await Order.count({
            where: { restaurant_id: restaurantId }
        });

        const pendingOrders = await Order.count({
            where: { restaurant_id: restaurantId, status: 'pending' }
        });

        const totalRevenue = await Order.sum('total_amount', {
            where: { restaurant_id: restaurantId, status: 'completed' }
        });

        const totalMenuItems = await MenuItem.count({
            include: [{
                model: MenuCategory,
                as: 'category',
                where: { restaurant_id: restaurantId }
            }]
        });

        res.json({
            totalOrders,
            pendingOrders,
            totalRevenue: totalRevenue || 0,
            totalMenuItems
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
