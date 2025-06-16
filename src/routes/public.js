const express = require('express');
const router = express.Router();
const { Restaurant, MenuCategory, MenuItem, Order, User } = require('../models');
const { Op } = require('sequelize');

// Get all restaurants for homepage
router.get('/', async (req, res, next) => {
    try {
        const { cuisine, search, sort } = req.query;

        const whereClause = { is_active: true };

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        let orderClause = [['name', 'ASC']];
        if (sort === 'rating') {
            orderClause = [['name', 'ASC']]; // Can add rating field later
        }

        const restaurants = await Restaurant.findAll({
            where: whereClause,
            attributes: ['id', 'name', 'description', 'logo_url', 'address', 'phone_number'],
            order: orderClause
        });

        // Add mock data for frontend compatibility
        const restaurantsWithMeta = restaurants.map(restaurant => ({
            ...restaurant.toJSON(),
            cuisine: 'International', // Can add cuisine field to DB later
            rating: 4.5,
            deliveryTime: '25-35 min',
            minimumOrder: 15,
            imageUrl: restaurant.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
        }));

        res.json(restaurantsWithMeta);
    } catch (err) {
        next(err);
    }
});

// Search restaurants and menu items
router.get('/search', async (req, res, next) => {
    try {
        const { q: query, type = 'all' } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter required' });
        }

        const results = {};

        if (type === 'all' || type === 'restaurants') {
            const restaurants = await Restaurant.findAll({
                where: {
                    is_active: true,
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { description: { [Op.like]: `%${query}%` } }
                    ]
                },
                attributes: ['id', 'name', 'description', 'logo_url'],
                limit: 10
            });

            results.restaurants = restaurants.map(r => ({
                ...r.toJSON(),
                imageUrl: r.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
            }));
        }

        if (type === 'all' || type === 'items') {
            const menuItems = await MenuItem.findAll({
                where: {
                    is_available: true,
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { description: { [Op.like]: `%${query}%` } }
                    ]
                },
                include: [
                    {
                        model: MenuCategory,
                        as: 'category',
                        include: [
                            {
                                model: Restaurant,
                                as: 'restaurant',
                                where: { is_active: true },
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ],
                limit: 20
            });

            results.menuItems = menuItems.map(item => ({
                ...item.toJSON(),
                imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
            }));
        }

        res.json(results);
    } catch (err) {
        next(err);
    }
});

// Get single restaurant with menu
router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({
            where: { id: req.params.id, is_active: true },
            include: [
                {
                    model: MenuCategory,
                    as: 'menuCategories',
                    include: [
                        {
                            model: MenuItem,
                            as: 'menuItems',
                            where: { is_available: true },
                            required: false
                        }
                    ],
                    order: [['display_order', 'ASC']]
                }
            ]
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Format for frontend
        const restaurantData = {
            ...restaurant.toJSON(),
            cuisine: 'International',
            rating: 4.5,
            deliveryTime: '25-35 min',
            minimumOrder: 15,
            imageUrl: restaurant.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
            menu: restaurant.menuCategories.map(category => ({
                ...category.toJSON(),
                items: category.menuItems.map(item => ({
                    ...item.toJSON(),
                    imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
                }))
            }))
        };

        res.json(restaurantData);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
