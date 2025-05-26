const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin, isRestaurantStaff } = require('../middleware/auth');

// Routes accessible by authenticated users
router.get('/user/:userId', authenticateToken, orderController.getUserOrders);
router.post('/', authenticateToken, orderController.createOrder);
router.post('/:id/cancel', authenticateToken, orderController.cancelOrder);

// Routes accessible by restaurant staff and admin
router.get('/', authenticateToken, isRestaurantStaff, orderController.getAllOrders);
router.get('/:id', authenticateToken, isRestaurantStaff, orderController.getOrderById);
router.put('/:id/status', authenticateToken, isRestaurantStaff, orderController.updateOrderStatus);

module.exports = router; 