
import { useState, useEffect, useCallback } from "react";
import { Restaurant } from "@/types/admin";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = 'http://localhost:3000/api';

export const useRestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAuthToken = () => {
    // Try to get admin token first, then regular token
    return localStorage.getItem("adminToken") || localStorage.getItem("token");
  };

  const fetchRestaurants = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('No auth token available for restaurant fetch');
        return;
      }

      setLoading(true);
      console.log('Fetching restaurants with token...');
      const response = await fetch(`${API_BASE_URL}/admin/restaurants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        const formattedRestaurants = data.map((r: {
          id: number;
          name: string;
          email: string;
          phone_number: string;
          address: string;
          description: string;
          logo_url: string;
          is_active: boolean;
          created_at: string;
        }) => ({
          id: r.id.toString(),
          name: r.name,
          email: r.email || '',
          phone: r.phone_number || '',
          address: r.address || '',
          description: r.description || '',
          logo: r.logo_url || '',
          status: r.is_active ? 'active' as const : 'inactive' as const,
          createdAt: new Date(r.created_at).toLocaleDateString(),
        }));
        setRestaurants(formattedRestaurants);
      } else {
        console.error('Failed to fetch restaurants:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const addRestaurant = async (restaurantData: Omit<Restaurant, "id" | "createdAt">) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/admin/restaurants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantData.name,
          email: restaurantData.email,
          phone_number: restaurantData.phone,
          address: restaurantData.address,
          description: restaurantData.description,
          logo_url: restaurantData.logo,
          is_active: restaurantData.status === 'active',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }

      const newRestaurant = await response.json();
      const formattedRestaurant: Restaurant = {
        id: newRestaurant.id.toString(),
        name: newRestaurant.name,
        email: newRestaurant.email || '',
        phone: newRestaurant.phone_number || '',
        address: newRestaurant.address || '',
        description: newRestaurant.description || '',
        logo: newRestaurant.logo_url || '',
        status: newRestaurant.is_active ? 'active' : 'inactive',
        createdAt: new Date(newRestaurant.created_at).toLocaleDateString(),
      };

      setRestaurants([...restaurants, formattedRestaurant]);
      toast({
        title: "Restaurant Added",
        description: `${formattedRestaurant.name} has been added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add restaurant",
        variant: "destructive",
      });
    }
  };

  const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updates.name,
          email: updates.email,
          phone_number: updates.phone,
          address: updates.address,
          description: updates.description,
          logo_url: updates.logo,
          is_active: updates.status === 'active',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      setRestaurants(restaurants.map(r => 
        r.id === id ? { ...r, ...updates } : r
      ));
      
      toast({
        title: "Restaurant Updated",
        description: "Restaurant information has been updated successfully",
      });
      
      return restaurants.find(r => r.id === id);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update restaurant",
        variant: "destructive",
      });
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }

      setRestaurants(restaurants.filter(r => r.id !== id));
      toast({
        title: "Restaurant Deleted",
        description: "Restaurant has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete restaurant",
        variant: "destructive",
      });
    }
  };

  return {
    restaurants,
    loading,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    refreshRestaurants: fetchRestaurants,
  };
};
