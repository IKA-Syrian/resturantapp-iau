const { User, Restaurant, MenuCategory, MenuItem } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('Starting to seed database...');

        // Create restaurants
        const restaurants = await Restaurant.bulkCreate([
            {
                name: 'Pizza Palace',
                address: '123 Main St, Downtown',
                phone_number: '(555) 123-4567',
                email: 'contact@pizzapalace.com',
                description: 'Authentic Italian pizza with fresh ingredients',
                logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
                is_active: true
            },
            {
                name: 'Bella Italia',
                address: '456 Oak Ave, Little Italy',
                phone_number: '(555) 234-5678',
                email: 'info@bellaitalia.com',
                description: 'Traditional Italian cuisine in a cozy atmosphere',
                logo_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
                is_active: true
            },
            {
                name: 'Sushi Heaven',
                address: '789 Pine St, Japan Town',
                phone_number: '(555) 345-6789',
                email: 'hello@sushiheaven.com',
                description: 'Fresh sushi and Japanese cuisine',
                logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
                is_active: true
            }
        ]);

        console.log('✅ Restaurants created');        // Create super admin with hashed password
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const superAdmin = await User.create({
            email: 'admin@platform.com',
            password_hash: hashedAdminPassword,
            first_name: 'Super',
            last_name: 'Admin',
            phone_number: '(555) 000-0000',
            role: 'admin',
            restaurant_id: null, // Super admin is not tied to any restaurant
            is_active: true
        });

        console.log('✅ Super admin created');

        // Hash passwords for restaurant admins
        const hashedPizzaPassword = await bcrypt.hash('pizza123', 10);
        const hashedBellaPassword = await bcrypt.hash('bella123', 10);
        const hashedSushiPassword = await bcrypt.hash('sushi123', 10);        // Create restaurant admins with hashed passwords
        const restaurantAdmins = await User.bulkCreate([
            {
                email: 'admin@pizzapalace.com',
                password_hash: hashedPizzaPassword,
                first_name: 'Tony',
                last_name: 'Soprano',
                phone_number: '(555) 123-0001',
                role: 'admin',
                restaurant_id: restaurants[0].id,
                is_active: true
            },
            {
                email: 'admin@bellaitalia.com',
                password_hash: hashedBellaPassword,
                first_name: 'Mario',
                last_name: 'Rossi',
                phone_number: '(555) 234-0001',
                role: 'admin',
                restaurant_id: restaurants[1].id,
                is_active: true
            },
            {
                email: 'admin@sushiheaven.com',
                password_hash: hashedSushiPassword,
                first_name: 'Akira',
                last_name: 'Tanaka',
                phone_number: '(555) 345-0001',
                role: 'admin',
                restaurant_id: restaurants[2].id,
                is_active: true
            }
        ], { hooks: false }); // Skip hooks to avoid double hashingconsole.log('✅ Restaurant admins created');

        // Hash password for customers
        const hashedCustomerPassword = await bcrypt.hash('password123', 10);        // Create some customers with hashed passwords
        const customers = await User.bulkCreate([
            {
                email: 'demo@example.com',
                password_hash: hashedCustomerPassword,
                first_name: 'Demo',
                last_name: 'User',
                phone_number: '(555) 111-2222',
                role: 'customer',
                restaurant_id: null,
                is_active: true
            },
            {
                email: 'john@example.com',
                password_hash: hashedCustomerPassword,
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '(555) 222-3333',
                role: 'customer',
                restaurant_id: null,
                is_active: true
            }
        ], { hooks: false }); // Skip hooks to avoid double hashing

        console.log('✅ Customers created');

        // Create menu categories for Pizza Palace
        const pizzaCategories = await MenuCategory.bulkCreate([
            {
                restaurant_id: restaurants[0].id,
                name: 'Pizzas',
                description: 'Delicious wood-fired pizzas',
                display_order: 1
            },
            {
                restaurant_id: restaurants[0].id,
                name: 'Appetizers',
                description: 'Start your meal right',
                display_order: 2
            },
            {
                restaurant_id: restaurants[0].id,
                name: 'Beverages',
                description: 'Refresh yourself',
                display_order: 3
            }
        ]);

        // Create menu items for Pizza Palace
        const pizzaItems = await MenuItem.bulkCreate([
            {
                category_id: pizzaCategories[0].id,
                name: 'Margherita Pizza',
                description: 'Classic tomato sauce, mozzarella, and fresh basil',
                price: 18.99,
                image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
                is_available: true
            },
            {
                category_id: pizzaCategories[0].id,
                name: 'Pepperoni Pizza',
                description: 'Tomato sauce, mozzarella, and spicy pepperoni',
                price: 21.99,
                image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
                is_available: true
            },
            {
                category_id: pizzaCategories[1].id,
                name: 'Garlic Bread',
                description: 'Fresh baked bread with garlic butter',
                price: 8.99,
                image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5',
                is_available: true
            },
            {
                category_id: pizzaCategories[2].id,
                name: 'Coca Cola',
                description: 'Classic refreshing cola',
                price: 3.99,
                image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330',
                is_available: true
            }
        ]);

        console.log('✅ Pizza Palace menu created');

        // Create menu categories for Bella Italia
        const bellaCategories = await MenuCategory.bulkCreate([
            {
                restaurant_id: restaurants[1].id,
                name: 'Pasta',
                description: 'Traditional Italian pasta dishes',
                display_order: 1
            },
            {
                restaurant_id: restaurants[1].id,
                name: 'Entrees',
                description: 'Main course selections',
                display_order: 2
            }
        ]);

        const bellaItems = await MenuItem.bulkCreate([
            {
                category_id: bellaCategories[0].id,
                name: 'Spaghetti Carbonara',
                description: 'Classic Roman pasta with eggs, cheese, and pancetta',
                price: 22.99,
                image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
                is_available: true
            },
            {
                category_id: bellaCategories[1].id,
                name: 'Chicken Parmigiana',
                description: 'Breaded chicken breast with marinara and mozzarella',
                price: 26.99,
                image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
                is_available: true
            }
        ]);

        console.log('✅ Bella Italia menu created');

        console.log('🎉 Database seeded successfully!');
        console.log('\n📧 Login credentials:');
        console.log('Super Admin: admin@platform.com / admin123');
        console.log('Pizza Palace Admin: admin@pizzapalace.com / pizza123');
        console.log('Bella Italia Admin: admin@bellaitalia.com / bella123');
        console.log('Sushi Heaven Admin: admin@sushiheaven.com / sushi123');
        console.log('Customer: demo@example.com / password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};

module.exports = seedData;
