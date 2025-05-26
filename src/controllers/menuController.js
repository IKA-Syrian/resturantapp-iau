const { MenuCategory, MenuItem, MenuItemOption } = require('../models');

class MenuController {
    // Get all menu categories for a restaurant
    async getCategories(req, res, next) {
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
    }

    // Create menu category
    async createCategory(req, res, next) {
        try {
            const category = await MenuCategory.create(req.body);
            res.status(201).json(category);
        } catch (err) {
            next(err);
        }
    }

    // Update menu category
    async updateCategory(req, res, next) {
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
    }

    // Delete menu category
    async deleteCategory(req, res, next) {
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
    }

    // Get menu item by ID
    async getMenuItem(req, res, next) {
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
    }

    // Create menu item
    async createMenuItem(req, res, next) {
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
    }

    // Update menu item
    async updateMenuItem(req, res, next) {
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
    }

    // Delete menu item (soft delete)
    async deleteMenuItem(req, res, next) {
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
    }
}

module.exports = new MenuController(); 