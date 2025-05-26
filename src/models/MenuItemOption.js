const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MenuItemOption extends Model {
        static associate(models) {
            MenuItemOption.belongsTo(models.MenuItem, {
                foreignKey: 'menu_item_id',
                as: 'menuItem'
            });
            MenuItemOption.hasMany(models.OrderItemOption, {
                foreignKey: 'menu_item_option_id',
                as: 'orderItemOptions'
            });
        }
    }

    MenuItemOption.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        menu_item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menu_items',
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
            defaultValue: 0.00
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        modelName: 'MenuItemOption',
        tableName: 'menu_item_options',
        timestamps: true,
        underscored: true
    });

    return MenuItemOption;
}; 