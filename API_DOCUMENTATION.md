# Restaurant Online System - Backend API Documentation

## Overview

The backend has been updated with comprehensive API endpoints to support the frontend requirements. The system now includes authentication, admin functionality, menu management, order processing, and more.

## New Features Added

### 1. Authentication & Authorization

-   JWT-based authentication
-   Role-based access control (customer, staff, admin, super_admin)
-   Secure password hashing with bcrypt
-   Admin login separate from customer login

### 2. Database Configuration

-   Updated to use MySQL with existing remote database
-   Proper Sequelize models with associations
-   Database seeding capabilities

### 3. API Endpoints

#### Public Endpoints (No Auth Required)

```
GET /api/public/                    - Get all active restaurants
GET /api/public/search?q=query      - Search restaurants and menu items
GET /api/public/:id                 - Get restaurant details with menu
```

#### User Authentication

```
POST /api/users/login               - Customer login
POST /api/users/register            - Customer registration
POST /api/users/admin/login         - Admin/Staff login
```

#### Menu Management

```
GET /api/menu/restaurant/:id        - Get complete menu for restaurant
GET /api/menu/categories/:restaurantId - Get menu categories
```

#### Admin Routes (Authentication Required)

```
# Restaurant Management (Super Admin)
GET /api/admin/restaurants          - Get all restaurants
POST /api/admin/restaurants         - Create restaurant
PUT /api/admin/restaurants/:id      - Update restaurant
DELETE /api/admin/restaurants/:id   - Delete restaurant

# Current Restaurant (Restaurant Admin)
GET /api/admin/restaurants/current  - Get current restaurant details

# Menu Management (Restaurant Admin)
GET /api/admin/menu                 - Get menu for current restaurant
POST /api/admin/menu/categories     - Create menu category
PUT /api/admin/menu/categories/:id  - Update menu category
DELETE /api/admin/menu/categories/:id - Delete menu category
POST /api/admin/menu/items          - Create menu item
PUT /api/admin/menu/items/:id       - Update menu item
DELETE /api/admin/menu/items/:id    - Delete menu item

# Order Management (Restaurant Admin)
GET /api/admin/orders               - Get orders for current restaurant
PUT /api/admin/orders/:id/status    - Update order status

# User Management (Super Admin)
GET /api/admin/users                - Get platform users
POST /api/admin/users               - Create platform user

# Dashboard Stats
GET /api/admin/dashboard/stats      - Get dashboard statistics
```

#### Order Management

```
POST /api/orders/                   - Create order (checkout)
GET /api/orders/user/:userId        - Get user orders
GET /api/orders/restaurant/:restaurantId - Get restaurant orders
```

## Authentication Flow

### Customer Flow

1. `POST /api/users/register` - Register new customer
2. `POST /api/users/login` - Login and receive JWT token
3. Use token in Authorization header: `Bearer <token>`

### Admin Flow

1. `POST /api/users/admin/login` - Admin login
2. Receive JWT token with admin permissions
3. Access admin endpoints with token

## User Roles

### Customer (`role: 'customer'`)

-   Can browse restaurants and menus
-   Can place orders
-   Can manage their profile and addresses

### Restaurant Admin (`role: 'admin'` with `restaurant_id`)

-   Can manage their restaurant's menu
-   Can view and update orders for their restaurant
-   Can update restaurant information

### Super Admin (`role: 'admin'` with `restaurant_id: null`)

-   Can manage all restaurants
-   Can create/edit/delete restaurants
-   Can manage platform users
-   Can access all restaurant data

## Sample Data

The system includes sample data:

-   3 restaurants (Pizza Palace, Bella Italia, Sushi Heaven)
-   Admin users for each restaurant
-   Super admin for platform management
-   Sample menu items and categories

### Sample Login Credentials

```
Super Admin: admin@platform.com / admin123
Pizza Palace Admin: admin@pizzapalace.com / pizza123
Bella Italia Admin: admin@bellaitalia.com / bella123
Sushi Heaven Admin: admin@sushiheaven.com / sushi123
Customer: demo@example.com / password123
```

## Database Schema

The system uses the following main tables:

-   `restaurants` - Restaurant information
-   `users` - All users (customers, staff, admins)
-   `menu_categories` - Menu categories per restaurant
-   `menu_items` - Menu items per category
-   `orders` - Order information
-   `order_items` - Individual items in an order
-   `addresses` - Customer delivery addresses

## Security Features

-   Password hashing with bcrypt
-   JWT token expiration (7 days)
-   Role-based route protection
-   Restaurant-specific data isolation
-   Input validation and sanitization

## Error Handling

-   Comprehensive error middleware
-   Proper HTTP status codes
-   Detailed error messages in development
-   Generic error messages in production

## Next Steps for Frontend Integration

1. Update frontend AuthContext to use real API endpoints
2. Replace mock data with API calls
3. Implement proper error handling
4. Add loading states
5. Update admin context to use admin API endpoints

The backend is now ready to support the full frontend functionality!
