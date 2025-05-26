const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });
            OrderItem.belongsTo(models.MenuItem, {
                foreignKey: 'menu_item_id',
                as: 'menuItem'
            });
            OrderItem.hasMany(models.OrderItemOption, {
                foreignKey: 'order_item_id',
                as: 'options'
            });
        }
    }

    OrderItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        menu_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menu_items',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        item_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        item_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        item_notes: DataTypes.TEXT,
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
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: true,
        underscored: true
    });

    return OrderItem;
}; 