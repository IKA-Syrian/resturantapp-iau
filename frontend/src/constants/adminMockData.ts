
import { Restaurant } from "@/types/admin";

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Bella Italia",
    slug: "bella-italia",
    email: "info@bellaitalia.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Pizza Palace",
    slug: "pizza-palace",
    email: "info@pizzapalace.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Avenue, City, State 12345",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Sushi Zen",
    slug: "sushi-zen",
    email: "info@sushizen.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Street, City, State 12345",
    status: "pending",
    createdAt: "2024-02-15",
  },
];

export const MOCK_ADMIN_USERS = [
  {
    id: "super1",
    name: "Super Admin",
    email: "admin@platform.com",
    password: "admin123",
    role: "super_admin" as const,
  },
  {
    id: "rest1",
    name: "Bella Italia Manager",
    email: "admin@bellaitalia.com",
    password: "bella123",
    role: "restaurant_admin" as const,
    restaurantId: "1",
  },
  {
    id: "rest2",
    name: "Pizza Palace Manager",
    email: "admin@pizzapalace.com",
    password: "pizza123",
    role: "restaurant_admin" as const,
    restaurantId: "2",
  },
];
