// Sample data population script for development
require('dotenv').config();
const db = require('./models');

async function seed() {
    await db.sequelize.sync({ force: true });

    // Create users
    const user = await db.User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password_hash: 'password123', // In production, hash passwords!
        role: 'customer',
    });

    // Create restaurants
    const restaurant = await db.Restaurant.create({
        name: 'Pizza Palace',
        cuisine: 'Italian',
        is_active: true,
        // Add these fields if your model supports them:
        address: '123 Main St',
        phone_number: '555-1234',
        email: 'contact@pizzapalace.com',
        description: 'Best pizza in town!',
        logo_url: 'https://via.placeholder.com/150',
        // Add frontend-expected fields as custom fields if not in model:
        rating: 4.7,
        minimumOrder: 15,
        deliveryTime: '20-30 min',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    });

    // Create menu category
    const category = await db.MenuCategory.create({
        restaurant_id: restaurant.id,
        name: 'Pizza',
        description: 'Delicious pizzas',
        display_order: 1,
    });

    // Create menu items
    const menuItem1 = await db.MenuItem.create({
        name: 'Margherita Pizza',
        price: 12.99,
        restaurant_id: restaurant.id,
        category_id: category.id,
        is_available: true,
        // Add frontend-expected fields as custom fields if not in model:
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    });
    const menuItem2 = await db.MenuItem.create({
        name: 'Pepperoni Pizza',
        price: 14.99,
        restaurant_id: restaurant.id,
        category_id: category.id,
        is_available: true,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    });

    // Create an order
    const order = await db.Order.create({
        user_id: user.id,
        restaurant_id: restaurant.id,
        order_type: 'delivery',
        subtotal: 27.98,
        total_amount: 27.98,
        status: 'pending',
        order_number: `ORD${Date.now()}`,
    });

    await db.OrderItem.create({
        order_id: order.id,
        menu_item_id: menuItem1.id,
        quantity: 1,
        unit_price: 12.99,
        item_name: menuItem1.name,
        item_total: 12.99,
    });
    await db.OrderItem.create({
        order_id: order.id,
        menu_item_id: menuItem2.id,
        quantity: 1,
        unit_price: 14.99,
        item_name: menuItem2.name,
        item_total: 14.99,
    });

    console.log('Sample data created!');
    process.exit();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});