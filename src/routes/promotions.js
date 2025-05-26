const express = require('express');
const router = express.Router();
const { Promotion } = require('../models');
const { Op } = require('sequelize');

// Get all active promotions for a restaurant
router.get('/restaurant/:restaurantId', async (req, res, next) => {
    try {
        const promotions = await Promotion.findAll({
            where: {
                restaurant_id: req.params.restaurantId,
                is_active: true,
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gt]: new Date() } }
                ],
                start_date: {
                    [Op.or]: [
                        null,
                        { [Op.lte]: new Date() }
                    ]
                }
            }
        });
        res.json(promotions);
    } catch (err) {
        next(err);
    }
});

// Get promotion by code
router.get('/code/:code', async (req, res, next) => {
    try {
        const promotion = await Promotion.findOne({
            where: {
                code: req.params.code,
                is_active: true,
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gt]: new Date() } }
                ],
                start_date: {
                    [Op.or]: [
                        null,
                        { [Op.lte]: new Date() }
                    ]
                }
            }
        });

        if (!promotion) {
            return res.status(404).json({ message: 'Invalid or expired promotion code' });
        }

        res.json(promotion);
    } catch (err) {
        next(err);
    }
});

// Create new promotion
router.post('/', async (req, res, next) => {
    try {
        const {
            restaurant_id,
            code,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date,
            usage_limit,
            min_order_amount
        } = req.body;

        // Check if code already exists
        const existingPromotion = await Promotion.findOne({
            where: { code }
        });

        if (existingPromotion) {
            return res.status(400).json({ message: 'Promotion code already exists' });
        }

        const promotion = await Promotion.create({
            restaurant_id,
            code,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date,
            usage_limit,
            min_order_amount
        });

        res.status(201).json(promotion);
    } catch (err) {
        next(err);
    }
});

// Update promotion
router.put('/:id', async (req, res, next) => {
    try {
        const [updated] = await Promotion.update(req.body, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        const promotion = await Promotion.findByPk(req.params.id);
        res.json(promotion);
    } catch (err) {
        next(err);
    }
});

// Deactivate promotion
router.delete('/:id', async (req, res, next) => {
    try {
        const promotion = await Promotion.findByPk(req.params.id);

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        await promotion.update({ is_active: false });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

// Validate promotion code for an order
router.post('/validate', async (req, res, next) => {
    try {
        const { code, restaurant_id, order_amount } = req.body;

        const promotion = await Promotion.findOne({
            where: {
                code,
                restaurant_id,
                is_active: true,
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gt]: new Date() } }
                ],
                start_date: {
                    [Op.or]: [
                        null,
                        { [Op.lte]: new Date() }
                    ]
                }
            }
        });

        if (!promotion) {
            return res.status(400).json({
                valid: false,
                message: 'Invalid or expired promotion code'
            });
        }

        if (promotion.min_order_amount && order_amount < promotion.min_order_amount) {
            return res.status(400).json({
                valid: false,
                message: `Minimum order amount of $${promotion.min_order_amount} required`
            });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (promotion.discount_type === 'percentage') {
            discountAmount = (order_amount * promotion.discount_value) / 100;
        } else {
            discountAmount = promotion.discount_value;
        }

        res.json({
            valid: true,
            promotion,
            discountAmount
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router; 