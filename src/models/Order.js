const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Order.belongsTo(models.Restaurant, {
                foreignKey: 'restaurant_id',
                as: 'restaurant'
            });
            Order.belongsTo(models.Address, {
                foreignKey: 'delivery_address_id',
                as: 'deliveryAddress'
            });
            Order.belongsTo(models.Promotion, {
                foreignKey: 'promotion_id',
                as: 'promotion'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'order_id',
                as: 'orderItems'
            });
            Order.hasOne(models.Payment, {
                foreignKey: 'order_id',
                as: 'payment'
            });
        }
    }

    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        },
        order_number: {
            type: DataTypes.STRING(20),
            unique: true
        },
        order_type: {
            type: DataTypes.ENUM('pickup', 'delivery'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(
                'pending',
                'confirmed',
                'preparing',
                'ready_for_pickup',
                'out_for_delivery',
                'completed',
                'cancelled'
            ),
            defaultValue: 'pending'
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        tax_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        delivery_address_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'addresses',
                key: 'id'
            }
        },
        pickup_delivery_time: DataTypes.DATE,
        estimated_delivery_time: DataTypes.DATE,
        actual_delivery_pickup_time: DataTypes.DATE,
        special_instructions: DataTypes.TEXT,
        promotion_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'promotions',
                key: 'id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        underscored: true
    });

    return Order;
}; 