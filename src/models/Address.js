const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Address extends Model {
        static associate(models) {
            Address.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Address.hasMany(models.Order, {
                foreignKey: 'delivery_address_id',
                as: 'orders'
            });
        }
    }

    Address.init({
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
        street_address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        state_province: DataTypes.STRING(100),
        postal_code: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        country: DataTypes.STRING(100),
        address_type: DataTypes.STRING(50),
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
        modelName: 'Address',
        tableName: 'addresses',
        timestamps: true,
        underscored: true
    });

    return Address;
}; 