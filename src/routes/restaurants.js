const express = require('express');
const router = express.Router();
const { Restaurant, User, MenuCategory } = require('../models');

// Get all restaurants
router.get('/', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.findAll({
            where: { is_active: true },
            attributes: { exclude: ['created_at', 'updated_at'] }
        });
        res.json(restaurants.map(r => ({
            ...r.toJSON(),
            rating: r.rating ?? 4.5,
            minimumOrder: r.minimumOrder ?? 10,
            deliveryTime: r.deliveryTime ?? '30-40 min',
            imageUrl: r.imageUrl ?? 'https://via.placeholder.com/150',
        })));
    } catch (err) {
        next(err);
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({
            where: { id: req.params.id, is_active: true },
            include: [
                {
                    model: MenuCategory,
                    as: 'menuCategories',
                    include: ['menuItems']
                }
            ]
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const r = restaurant.toJSON();
        res.json({
            ...r,
            rating: r.rating ?? 4.5,
            minimumOrder: r.minimumOrder ?? 10,
            deliveryTime: r.deliveryTime ?? '30-40 min',
            imageUrl: r.imageUrl ?? 'https://via.placeholder.com/150',
        });
    } catch (err) {
        next(err);
    }
});

// Create new restaurant
router.post('/', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json(restaurant);
    } catch (err) {
        next(err);
    }
});

// Update restaurant
router.put('/:id', async (req, res, next) => {
    try {
        const [updated] = await Restaurant.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const restaurant = await Restaurant.findByPk(req.params.id);
        res.json(restaurant);
    } catch (err) {
        next(err);
    }
});

// Delete restaurant (soft delete)
router.delete('/:id', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        await restaurant.update({ is_active: false });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router; 