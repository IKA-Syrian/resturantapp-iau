const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });
        }
    }

    Payment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        payment_method: DataTypes.STRING(50),
        payment_gateway_ref: {
            type: DataTypes.STRING(255),
            unique: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
            defaultValue: 'pending'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD'
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
        modelName: 'Payment',
        tableName: 'payments',
        timestamps: true,
        underscored: true
    });

    return Payment;
}; 