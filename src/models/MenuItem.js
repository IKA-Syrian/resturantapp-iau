const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MenuItem extends Model {
        static associate(models) {
            MenuItem.belongsTo(models.MenuCategory, {
                foreignKey: 'category_id',
                as: 'category'
            });
            MenuItem.hasMany(models.MenuItemOption, {
                foreignKey: 'menu_item_id',
                as: 'options'
            });
            MenuItem.hasMany(models.OrderItem, {
                foreignKey: 'menu_item_id',
                as: 'orderItems'
            });
        }
    }

    MenuItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'menu_categories',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        image_url: DataTypes.STRING(512),
        is_available: {
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
        modelName: 'MenuItem',
        tableName: 'menu_items',
        timestamps: true,
        underscored: true
    });

    return MenuItem;
}; 