
export type Restaurant = {
  id: string;
  name: string;
  slug?: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  logo?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "restaurant_admin";
  restaurantId?: string; // Only for restaurant admins
};

export type AdminContextType = {
  adminUser: AdminUser | null;
  currentRestaurant: Restaurant | null;
  restaurants: Restaurant[];
  loading?: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRestaurant: (restaurantId: string) => void;
  addRestaurant: (restaurant: Omit<Restaurant, "id" | "createdAt">) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
};
