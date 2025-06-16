require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'deploy',
        password: process.env.DB_PASSWORD || 'QmwcAP9EXhJqTa-g_4',
        database: process.env.DB_NAME || 'restaurant_online_system',
        host: process.env.DB_HOST || '38.242.243.210',
        dialect: 'mysql',
        logging: false
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
};