const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Register new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

// Admin login
router.post('/admin/login', userController.adminLogin);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (soft delete)
router.delete('/:id', userController.deleteUser);

// Add user address
router.post('/:id/addresses', userController.addAddress);

// Get user addresses
router.get('/:id/addresses', userController.getAddresses);

module.exports = router;