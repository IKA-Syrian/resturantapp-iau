# Restaurant Online System

A modern web and mobile application for restaurant management, featuring online ordering, table reservations, and real-time order tracking.

## Features

-   🍽️ Online Food Ordering
-   📅 Table Reservations
-   📱 Mobile App Support
-   🔍 Menu Management
-   📊 Order Tracking
-   💳 Payment Integration

## Tech Stack

-   **Frontend**: React.js, React Native
-   **Backend**: Node.js with Express
-   **Database**: MongoDB
-   **Runtime**: Bun
-   **Mobile**: React Native APP

## Prerequisites

-   [Bun](https://bun.sh) v1.2.12 or higher
-   Node.js (for development)
-   MongoDB (for database)
-   React Native development environment (for mobile app)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ikasyrian/resrturant-online-system.git
cd resrturant-online-system
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add necessary environment variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Backend Server

```bash
bun run index.ts
```

### Mobile App

```bash
cd mobile
npm install
npm run android  # for Android
npm run ios     # for iOS
```

## Development

-   Backend API runs on `http://localhost:8080`

## Project Structure

```
resrturant-online-system/
├── mobile/           # React Native mobile app
├── src/             # Backend source code
├── public/          # Static files
└── README.md        # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@restaurant-online-system.com or open an issue in the repository.
