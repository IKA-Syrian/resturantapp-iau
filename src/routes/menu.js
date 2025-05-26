const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { MenuCategory, MenuItem, MenuItemOption } = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const { restaurantId } = req.query;
        if (!restaurantId) {
            return res.status(400).json({ message: 'restaurantId query parameter is required' });
        }
        // Find all categories for the restaurant
        const categories = await MenuCategory.findAll({
            where: { restaurant_id: restaurantId },
            attributes: ['id']
        });
        const categoryIds = categories.map(c => c.id);

        // Find all menu items in those categories
        const items = await MenuItem.findAll({
            where: {
                category_id: { [Op.in]: categoryIds },
                is_available: true
            }
        });
        res.json(items.map(item => ({
            ...item.toJSON(),
            imageUrl: item.imageUrl ?? 'https://via.placeholder.com/150',
        })));
    } catch (err) {
        next(err);
    }
});

// Get all menu categories for a restaurant
router.get('/categories/:restaurantId', async (req, res, next) => {
    try {
        const categories = await MenuCategory.findAll({
            where: { restaurant_id: req.params.restaurantId },
            include: [{
                model: MenuItem,
                as: 'menuItems',
                where: { is_available: true },
                required: false,
                include: [{
                    model: MenuItemOption,
                    as: 'options'
                }]
            }],
            order: [
                ['display_order', 'ASC'],
                ['name', 'ASC'],
                [{ model: MenuItem, as: 'menuItems' }, 'name', 'ASC']
            ]
        });
        res.json(categories);
    } catch (err) {
        next(err);
    }
});

// Create menu category
router.post('/categories', async (req, res, next) => {
    try {
        const category = await MenuCategory.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
});

// Update menu category
router.put('/categories/:id', async (req, res, next) => {
    try {
        const [updated] = await MenuCategory.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const category = await MenuCategory.findByPk(req.params.id);
        res.json(category);
    } catch (err) {
        next(err);
    }
});

// Delete menu category
router.delete('/categories/:id', async (req, res, next) => {
    try {
        const deleted = await MenuCategory.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// Get menu item by ID
router.get('/items/:id', async (req, res, next) => {
    try {
        const item = await MenuItem.findOne({
            where: { id: req.params.id, is_available: true },
            include: [{
                model: MenuItemOption,
                as: 'options'
            }]
        });

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json(item);
    } catch (err) {
        next(err);
    }
});

// Create menu item
router.post('/items', async (req, res, next) => {
    try {
        const { options, ...itemData } = req.body;
        const item = await MenuItem.create(itemData);

        if (options && options.length > 0) {
            await MenuItemOption.bulkCreate(
                options.map(option => ({ ...option, menu_item_id: item.id }))
            );
        }

        const createdItem = await MenuItem.findByPk(item.id, {
            include: [{
                model: MenuItemOption,
                as: 'options'
            }]
        });

        res.status(201).json(createdItem);
    } catch (err) {
        next(err);
    }
});

// Update menu item
router.put('/items/:id', async (req, res, next) => {
    try {
        const { options, ...itemData } = req.body;
        const [updated] = await MenuItem.update(itemData, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (options) {
            // Delete existing options
            await MenuItemOption.destroy({
                where: { menu_item_id: req.params.id }
            });

            // Create new options
            if (options.length > 0) {
                await MenuItemOption.bulkCreate(
                    options.map(option => ({ ...option, menu_item_id: req.params.id }))
                );
            }
        }

        const item = await MenuItem.findByPk(req.params.id, {
            include: [{
                model: MenuItemOption,
                as: 'options'
            }]
        });
        res.json(item);
    } catch (err) {
        next(err);
    }
});

// Delete menu item (soft delete)
router.delete('/items/:id', async (req, res, next) => {
    try {
        const item = await MenuItem.findByPk(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        await item.update({ is_available: false });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// Get all menu items for a restaurant by restaurantId (query param)
router.get('/', async (req, res, next) => {
    try {
        const { restaurantId } = req.query;
        if (!restaurantId) {
            return res.status(400).json({ message: 'restaurantId query parameter is required' });
        }
        const items = await MenuItem.findAll({
            where: { restaurant_id: restaurantId, is_available: true },
        });
        res.json(items.map(item => ({
            ...item.toJSON(),
            imageUrl: item.imageUrl ?? 'https://via.placeholder.com/150',
        })));
    } catch (err) {
        next(err);
    }
});

module.exports = router; 