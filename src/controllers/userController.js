const { User, Address, Order } = require('../models');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const { Op } = require('sequelize');

class UserController {
    // Get all users
    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                where: { is_active: true },
                attributes: { exclude: ['password_hash'] }
            });
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    // Get user by ID
    async getUserById(req, res, next) {
        try {
            const user = await User.findOne({
                where: { id: req.params.id, is_active: true },
                attributes: { exclude: ['password_hash'] },
                include: [
                    {
                        model: Address,
                        as: 'addresses'
                    },
                    {
                        model: Order,
                        as: 'orders',
                        include: ['orderItems']
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    // Register new user
    async register(req, res, next) {
        try {
            const { email, password, first_name, last_name, phone_number, role = 'customer' } = req.body;

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
                role
            });

            // Don't send password hash in response
            const { password_hash, ...userWithoutPassword } = user.toJSON();
            res.status(201).json(userWithoutPassword);
        } catch (err) {
            next(err);
        }
    }    // Login user
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email, is_active: true } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Don't send password hash in response
            const { password_hash, ...userWithoutPassword } = user.toJSON();

            res.json({
                user: userWithoutPassword,
                token,
                message: 'Login successful'
            });
        } catch (err) {
            next(err);
        }
    }

    // Admin login (for staff and admin roles)
    async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body; const user = await User.findOne({
                where: {
                    email,
                    is_active: true,
                    role: { [Op.in]: ['staff', 'admin'] } // Only allow staff/admin login through this endpoint
                }
            });

            if (!user) {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }

            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid admin credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role,
                    restaurantId: user.restaurant_id
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Don't send password hash in response
            const { password_hash, ...userWithoutPassword } = user.toJSON();

            // Determine user type for frontend
            const userType = user.restaurant_id === null ? 'super_admin' : 'restaurant_admin';

            res.json({
                user: {
                    ...userWithoutPassword,
                    role: userType
                },
                token,
                message: 'Admin login successful'
            });
        } catch (err) {
            next(err);
        }
    }

    // Update user
    async updateUser(req, res, next) {
        try {
            const { password, ...updateData } = req.body;

            // If password is being updated, hash it
            if (password) {
                updateData.password_hash = password;
            }

            const [updated] = await User.update(updateData, {
                where: { id: req.params.id }
            });

            if (!updated) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password_hash'] }
            });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    // Delete user (soft delete)
    async deleteUser(req, res, next) {
        try {
            const user = await User.findByPk(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.update({ is_active: false });
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }

    // Add user address
    async addAddress(req, res, next) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const address = await Address.create({
                ...req.body,
                user_id: user.id
            });

            res.status(201).json(address);
        } catch (err) {
            next(err);
        }
    }

    // Get user addresses
    async getAddresses(req, res, next) {
        try {
            const addresses = await Address.findAll({
                where: { user_id: req.params.id }
            });
            res.json(addresses);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();