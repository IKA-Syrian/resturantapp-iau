#!/usr/bin/env node
require('dotenv').config();
const db = require('./models');
const bcrypt = require('bcryptjs');

const updatePasswords = async () => {
    try {
        console.log('🔄 Updating user passwords with proper hashing...');

        // Hash passwords
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedPizzaPassword = await bcrypt.hash('pizza123', 10);
        const hashedBellaPassword = await bcrypt.hash('bella123', 10);
        const hashedSushiPassword = await bcrypt.hash('sushi123', 10);
        const hashedCustomerPassword = await bcrypt.hash('password123', 10);

        // Update existing users with hashed passwords
        await db.User.update(
            { password_hash: hashedAdminPassword },
            { where: { email: 'admin@platform.com' } }
        );

        await db.User.update(
            { password_hash: hashedPizzaPassword },
            { where: { email: 'admin@pizzapalace.com' } }
        );

        await db.User.update(
            { password_hash: hashedBellaPassword },
            { where: { email: 'admin@bellaitalia.com' } }
        );

        await db.User.update(
            { password_hash: hashedSushiPassword },
            { where: { email: 'admin@sushiheaven.com' } }
        );

        await db.User.update(
            { password_hash: hashedCustomerPassword },
            { where: { email: 'demo@example.com' } }
        );

        await db.User.update(
            { password_hash: hashedCustomerPassword },
            { where: { email: 'john@example.com' } }
        );

        console.log('✅ All user passwords updated with proper hashing!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating passwords:', error);
        process.exit(1);
    }
};

updatePasswords();
