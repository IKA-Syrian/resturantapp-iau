
import { AdminUser, Restaurant } from "@/types/admin";
import { MOCK_ADMIN_USERS } from "@/constants/adminMockData";

export const authenticateAdmin = (email: string, password: string): AdminUser | null => {
  const user = MOCK_ADMIN_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    const { password: _, ...adminData } = user;
    return adminData;
  }
  return null;
};

export const generateRestaurantId = (existingRestaurants: Restaurant[]): string => {
  return String(existingRestaurants.length + 1);
};

export const generateSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
