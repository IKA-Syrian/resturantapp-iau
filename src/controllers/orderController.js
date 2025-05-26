const { Order, OrderItem, MenuItem, User, Address, Restaurant } = require('../models');
const { ValidationError, Op } = require('sequelize');

class OrderController {
    // Get all orders (with filtering options)
    async getAllOrders(req, res, next) {
        try {
            const { status, userId, restaurantId, startDate, endDate } = req.query;
            const where = {};

            if (status) {
                where.status = status;
            }
            if (userId) {
                where.user_id = userId;
            }
            if (restaurantId) {
                where.restaurant_id = restaurantId;
            }
            if (startDate && endDate) {
                where.created_at = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }

            const orders = await Order.findAll({
                where,
                include: [
                    {
                        model: OrderItem,
                        include: [MenuItem]
                    },
                    {
                        model: User,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: Restaurant,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Address,
                        as: 'deliveryAddress'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    // Get order by ID
    async getOrderById(req, res, next) {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [MenuItem]
                    },
                    {
                        model: User,
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: Restaurant,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Address,
                        as: 'deliveryAddress'
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json(order);
        } catch (err) {
            next(err);
        }
    }

    // Create new order
    async createOrder(req, res, next) {
        try {
            const {
                restaurant_id,
                delivery_address_id,
                items,
                special_instructions,
                delivery_time
            } = req.body;

            // Validate restaurant exists
            const restaurant = await Restaurant.findByPk(restaurant_id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            // Calculate total amount
            let total_amount = 0;
            const orderItems = [];

            // Validate and prepare order items
            for (const item of items) {
                const menuItem = await MenuItem.findByPk(item.menu_item_id);
                if (!menuItem) {
                    return res.status(404).json({
                        message: `Menu item not found: ${item.menu_item_id}`
                    });
                }
                if (!menuItem.is_available) {
                    return res.status(400).json({
                        message: `Menu item not available: ${menuItem.name}`
                    });
                }

                const itemTotal = menuItem.price * item.quantity;
                total_amount += itemTotal;

                orderItems.push({
                    menu_item_id: menuItem.id,
                    quantity: item.quantity,
                    unit_price: menuItem.price,
                    total_price: itemTotal,
                    special_requests: item.special_requests
                });
            }

            // Create order
            const order = await Order.create({
                user_id: req.user.id, // Assuming user is attached by auth middleware
                restaurant_id,
                delivery_address_id,
                total_amount,
                status: 'pending',
                special_instructions,
                delivery_time
            });

            // Create order items
            await OrderItem.bulkCreate(
                orderItems.map(item => ({
                    ...item,
                    order_id: order.id
                }))
            );

            // Fetch complete order with associations
            const createdOrder = await Order.findByPk(order.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [MenuItem]
                    },
                    {
                        model: Address,
                        as: 'deliveryAddress'
                    }
                ]
            });

            res.status(201).json(createdOrder);
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    // Update order status
    async updateOrderStatus(req, res, next) {
        try {
            const { status } = req.body;
            const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'in_delivery', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
                });
            }

            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Validate status transition
            if (order.status === 'cancelled' || order.status === 'delivered') {
                return res.status(400).json({
                    message: 'Cannot update status of cancelled or delivered orders'
                });
            }

            await order.update({ status });

            const updatedOrder = await Order.findByPk(order.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [MenuItem]
                    },
                    {
                        model: Address,
                        as: 'deliveryAddress'
                    }
                ]
            });

            res.json(updatedOrder);
        } catch (err) {
            next(err);
        }
    }

    // Cancel order
    async cancelOrder(req, res, next) {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (!['pending', 'confirmed'].includes(order.status)) {
                return res.status(400).json({
                    message: 'Only pending or confirmed orders can be cancelled'
                });
            }

            await order.update({ status: 'cancelled' });
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }

    // Get user's order history
    async getUserOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: { user_id: req.params.userId },
                include: [
                    {
                        model: OrderItem,
                        include: [MenuItem]
                    },
                    {
                        model: Restaurant,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Address,
                        as: 'deliveryAddress'
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.json(orders);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new OrderController(); 