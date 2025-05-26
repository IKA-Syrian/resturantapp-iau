const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItemOption extends Model {
        static associate(models) {
            OrderItemOption.belongsTo(models.OrderItem, {
                foreignKey: 'order_item_id',
                as: 'orderItem'
            });
            OrderItemOption.belongsTo(models.MenuItemOption, {
                foreignKey: 'menu_item_option_id',
                as: 'menuItemOption'
            });
        }
    }

    OrderItemOption.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'order_items',
                key: 'id'
            }
        },
        menu_item_option_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menu_item_options',
                key: 'id'
            }
        },
        option_group_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        option_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        price_adjustment: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'OrderItemOption',
        tableName: 'order_item_options',
        timestamps: false,
        underscored: true
    });

    return OrderItemOption;
}; 