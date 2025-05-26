const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, restaurantController.createRestaurant);
router.put('/:id', authenticateToken, isAdmin, restaurantController.updateRestaurant);
router.delete('/:id', authenticateToken, isAdmin, restaurantController.deleteRestaurant);

module.exports = router; 