const { Restaurant, Address, MenuCategory, MenuItem } = require('../models');
const { ValidationError, Op } = require('sequelize');

class RestaurantController {
    // Get all restaurants with optional filtering
    async getAllRestaurants(req, res) {
        try {
            const { name, cuisine, rating } = req.query;
            const where = {};

            if (name) {
                where.name = { [Op.like]: `%${name}%` };
            }
            if (cuisine) {
                where.cuisine = cuisine;
            }
            if (rating) {
                where.rating = { [Op.gte]: parseFloat(rating) };
            }

            const restaurants = await Restaurant.findAll({
                where,
                include: [
                    {
                        model: Address,
                        attributes: ['street', 'city', 'state', 'zipCode']
                    }
                ]
            });

            res.json(restaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            res.status(500).json({ error: 'Failed to fetch restaurants' });
        }
    }

    // Get a single restaurant by ID
    async getRestaurantById(req, res) {
        try {
            const restaurant = await Restaurant.findByPk(req.params.id, {
                include: [
                    {
                        model: Address,
                        attributes: ['street', 'city', 'state', 'zipCode']
                    },
                    {
                        model: MenuCategory,
                        include: [MenuItem]
                    }
                ]
            });

            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            res.json(restaurant);
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            res.status(500).json({ error: 'Failed to fetch restaurant' });
        }
    }

    // Create a new restaurant
    async createRestaurant(req, res) {
        try {
            const {
                name,
                description,
                cuisine,
                openingHours,
                address
            } = req.body;

            const restaurant = await Restaurant.create({
                name,
                description,
                cuisine,
                openingHours
            });

            if (address) {
                await Address.create({
                    ...address,
                    restaurantId: restaurant.id
                });
            }

            const createdRestaurant = await Restaurant.findByPk(restaurant.id, {
                include: [Address]
            });

            res.status(201).json(createdRestaurant);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error creating restaurant:', error);
            res.status(500).json({ error: 'Failed to create restaurant' });
        }
    }

    // Update a restaurant
    async updateRestaurant(req, res) {
        try {
            const {
                name,
                description,
                cuisine,
                openingHours,
                address
            } = req.body;

            const restaurant = await Restaurant.findByPk(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            await restaurant.update({
                name,
                description,
                cuisine,
                openingHours
            });

            if (address) {
                await Address.update(address, {
                    where: { restaurantId: restaurant.id }
                });
            }

            const updatedRestaurant = await Restaurant.findByPk(restaurant.id, {
                include: [Address]
            });

            res.json(updatedRestaurant);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error updating restaurant:', error);
            res.status(500).json({ error: 'Failed to update restaurant' });
        }
    }

    // Delete a restaurant
    async deleteRestaurant(req, res) {
        try {
            const restaurant = await Restaurant.findByPk(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            await restaurant.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            res.status(500).json({ error: 'Failed to delete restaurant' });
        }
    }
}

module.exports = new RestaurantController(); 