const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Promotion extends Model {
        static associate(models) {
            Promotion.belongsTo(models.Restaurant, {
                foreignKey: 'restaurant_id',
                as: 'restaurant'
            });
            Promotion.hasMany(models.Order, {
                foreignKey: 'promotion_id',
                as: 'orders'
            });
        }
    }

    Promotion.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: DataTypes.TEXT,
        discount_type: {
            type: DataTypes.ENUM('percentage', 'fixed_amount'),
            allowNull: false
        },
        discount_value: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        usage_limit: DataTypes.INTEGER,
        min_order_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        modelName: 'Promotion',
        tableName: 'promotions',
        timestamps: true,
        underscored: true
    });

    return Promotion;
}; 