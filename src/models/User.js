const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Restaurant, {
                foreignKey: 'restaurant_id',
                as: 'restaurant'
            });
            User.hasMany(models.Address, {
                foreignKey: 'user_id',
                as: 'addresses'
            });
            User.hasMany(models.Order, {
                foreignKey: 'user_id',
                as: 'orders'
            });
        }

        // Instance method to check password
        async validatePassword(password) {
            return bcrypt.compare(password, this.password_hash);
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        first_name: DataTypes.STRING(100),
        last_name: DataTypes.STRING(100),
        phone_number: DataTypes.STRING(50),
        role: {
            type: DataTypes.ENUM('customer', 'staff', 'admin'),
            allowNull: false
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'restaurants',
                key: 'id'
            }
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
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,
        hooks: {
            beforeSave: async (user) => {
                if (user.changed('password_hash')) {
                    user.password_hash = await bcrypt.hash(user.password_hash, 10);
                }
            }
        }
    });

    return User;
}; 