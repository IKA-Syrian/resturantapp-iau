const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MenuCategory extends Model {
        static associate(models) {
            MenuCategory.belongsTo(models.Restaurant, {
                foreignKey: 'restaurant_id',
                as: 'restaurant'
            });
            MenuCategory.hasMany(models.MenuItem, {
                foreignKey: 'category_id',
                as: 'menuItems'
            });
        }
    }

    MenuCategory.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'restaurants',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        modelName: 'MenuCategory',
        tableName: 'menu_categories',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['restaurant_id', 'name']
            }
        ]
    });

    return MenuCategory;
}; 