const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Restaurant extends Model {
        static associate(models) {
            Restaurant.hasMany(models.User, {
                foreignKey: 'restaurant_id',
                as: 'users'
            });
            Restaurant.hasMany(models.User, {
                foreignKey: 'restaurant_id',
                as: 'staff',
                scope: {
                    role: ['staff', 'admin']
                }
            });
            Restaurant.hasMany(models.MenuCategory, {
                foreignKey: 'restaurant_id',
                as: 'menuCategories'
            });
            Restaurant.hasMany(models.Order, {
                foreignKey: 'restaurant_id',
                as: 'orders'
            });
            Restaurant.hasMany(models.Promotion, {
                foreignKey: 'restaurant_id',
                as: 'promotions'
            });
        }
    }

    Restaurant.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        address: DataTypes.TEXT,
        phone_number: DataTypes.STRING(50),
        email: {
            type: DataTypes.STRING(255),
            unique: true
        },
        description: DataTypes.TEXT,
        logo_url: DataTypes.STRING(512),
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
        modelName: 'Restaurant',
        tableName: 'restaurants',
        timestamps: true,
        underscored: true
    });

    return Restaurant;
}; 