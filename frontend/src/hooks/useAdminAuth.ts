import { useState, useEffect } from "react";
import { AdminUser, Restaurant } from "@/types/admin";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = 'http://localhost:3000/api';

export const useAdminAuth = (restaurants: Restaurant[]) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Restore admin user immediately on mount (independent of restaurants)
  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminUser");
    const savedToken = localStorage.getItem("adminToken");
    
    if (savedAdmin && savedToken) {
      const admin = JSON.parse(savedAdmin);
      setAdminUser(admin);
      setToken(savedToken);
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Check local storage for saved admin user
    const savedAdmin = localStorage.getItem("adminUser");
    const savedRestaurant = localStorage.getItem("currentRestaurant");
    const savedToken = localStorage.getItem("adminToken");
    
    if (savedAdmin && savedToken) {
      const admin = JSON.parse(savedAdmin);
      setAdminUser(admin);
      setToken(savedToken);
      
      // For restaurant admin, we might need to fetch their restaurant
      if (admin.role === "restaurant_admin" && admin.restaurantId) {
        // First try to find in existing restaurants
        const restaurant = restaurants.find(r => r.id === admin.restaurantId);
        if (restaurant) {
          setCurrentRestaurant(restaurant);
        } else if (savedToken) {
          // If not found, fetch current restaurant from API
          fetchCurrentRestaurant(savedToken);
        }
      } else if (savedRestaurant) {
        // For super admin or if restaurant data is saved
        setCurrentRestaurant(JSON.parse(savedRestaurant));
      }
    }
  }, [restaurants]); // Keep dependency to update when restaurants load

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      const adminUser: AdminUser = {
        id: data.user.id.toString(),
        name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email,
        email: data.user.email,
        role: data.user.role, // 'super_admin' or 'restaurant_admin'
        restaurantId: data.user.restaurant_id?.toString() || null,
      };

      setAdminUser(adminUser);
      setToken(data.token);
      localStorage.setItem("adminUser", JSON.stringify(adminUser));
      localStorage.setItem("adminToken", data.token);

      // Auto-set restaurant for restaurant admins or fetch current restaurant
      if (adminUser.role === "restaurant_admin" && adminUser.restaurantId) {
        // Fetch current restaurant details
        await fetchCurrentRestaurant(data.token);
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${adminUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid admin credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchCurrentRestaurant = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/restaurants/current`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const restaurant = await response.json();
        setCurrentRestaurant(restaurant);
        localStorage.setItem("currentRestaurant", JSON.stringify(restaurant));
      }
    } catch (error) {
      console.error('Failed to fetch current restaurant:', error);
    }
  };

  const logout = () => {
    setAdminUser(null);
    setCurrentRestaurant(null);
    setToken(null);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("currentRestaurant");
    localStorage.removeItem("adminToken");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const switchRestaurant = async (restaurantId: string) => {
    if (adminUser?.role !== "super_admin" || !token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/public/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const restaurant = await response.json();
        setCurrentRestaurant(restaurant);
        localStorage.setItem("currentRestaurant", JSON.stringify(restaurant));
        toast({
          title: "Restaurant Switched",
          description: `Now managing ${restaurant.name}`,
        });
      }
    } catch (error) {
      console.error('Failed to switch restaurant:', error);
      toast({
        title: "Error",
        description: "Failed to switch restaurant",
        variant: "destructive",
      });
    }
  };

  return {
    adminUser,
    currentRestaurant,
    setCurrentRestaurant,
    token,
    login,
    logout,
    switchRestaurant,
  };
};
