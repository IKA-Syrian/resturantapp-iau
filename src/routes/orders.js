const express = require('express');
const router = express.Router();
const { Order, OrderItem, OrderItemOption, MenuItem, Payment } = require('../models');

// Get all orders for a restaurant
router.get('/restaurant/:restaurantId', async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { restaurant_id: req.params.restaurantId },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['options']
                },
                'user',
                'deliveryAddress',
                'payment'
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.params.userId },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['options']
                },
                'restaurant',
                'deliveryAddress',
                'payment'
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['options']
                },
                'user',
                'restaurant',
                'deliveryAddress',
                'payment',
                'promotion'
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
});

// Create new order
router.post('/', async (req, res, next) => {
    try {
        const {
            user_id,
            restaurant_id,
            order_type,
            delivery_address_id,
            items,
            special_instructions,
            promotion_id
        } = req.body;

        // Calculate order totals
        let subtotal = 0;
        const orderItems = [];

        // Prepare order items
        for (const item of items) {
            const menuItem = await MenuItem.findByPk(item.menu_item_id);
            if (!menuItem || !menuItem.is_available) {
                return res.status(400).json({
                    message: `Menu item ${item.menu_item_id} not available`
                });
            }

            let itemTotal = menuItem.price * item.quantity;

            // Calculate options cost
            const itemOptions = [];
            if (item.options) {
                for (const option of item.options) {
                    itemTotal += option.price_adjustment * item.quantity;
                    itemOptions.push({
                        menu_item_option_id: option.menu_item_option_id,
                        option_group_name: option.option_group_name,
                        option_name: option.option_name,
                        price_adjustment: option.price_adjustment
                    });
                }
            }

            orderItems.push({
                menu_item_id: menuItem.id,
                quantity: item.quantity,
                unit_price: menuItem.price,
                item_name: menuItem.name,
                item_total: itemTotal,
                item_notes: item.notes,
                options: itemOptions
            });

            subtotal += itemTotal;
        }

        // Create order
        const order = await Order.create({
            user_id,
            restaurant_id,
            order_type,
            delivery_address_id,
            special_instructions,
            promotion_id,
            subtotal,
            total_amount: subtotal, // Will be updated after applying discounts and tax
            status: 'pending',
            order_number: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
        });

        // Create order items and their options
        for (const item of orderItems) {
            const { options, ...itemData } = item;
            const orderItem = await OrderItem.create({
                ...itemData,
                order_id: order.id
            });

            if (options && options.length > 0) {
                await OrderItemOption.bulkCreate(
                    options.map(option => ({
                        ...option,
                        order_item_id: orderItem.id
                    }))
                );
            }
        }

        // Create initial payment record
        await Payment.create({
            order_id: order.id,
            amount: order.total_amount,
            status: 'pending'
        });

        // Fetch complete order with all relations
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['options']
                },
                'user',
                'restaurant',
                'deliveryAddress',
                'payment',
                'promotion'
            ]
        });

        res.status(201).json(completeOrder);
    } catch (err) {
        next(err);
    }
});

// Update order status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update({ status });

        const updatedOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: ['options']
                },
                'user',
                'restaurant',
                'deliveryAddress',
                'payment'
            ]
        });

        res.json(updatedOrder);
    } catch (err) {
        next(err);
    }
});

// Cancel order
router.post('/:id/cancel', async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                message: 'Order cannot be cancelled in current status'
            });
        }

        await order.update({ status: 'cancelled' });

        // Update payment status if exists
        const payment = await Payment.findOne({ where: { order_id: order.id } });
        if (payment && payment.status === 'pending') {
            await payment.update({ status: 'failed' });
        }

        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 