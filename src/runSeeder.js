#!/usr/bin/env node
require('dotenv').config();
const db = require('./models');
const seedData = require('./seedData');

const runSeeder = async () => {
    try {
        // Sync database - force recreate for clean state
        await db.sequelize.sync({ force: true });
        console.log('✅ Database synced (tables recreated)');

        // Run seeder
        await seedData();

        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error running seeder:', error);
        process.exit(1);
    }
};

runSeeder();
