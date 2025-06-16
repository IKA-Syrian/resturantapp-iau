
import React, { createContext, useContext } from "react";
import { AdminContextType, Restaurant } from "@/types/admin";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRestaurantManagement } from "@/hooks/useRestaurantManagement";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { restaurants, loading, addRestaurant, updateRestaurant, deleteRestaurant, refreshRestaurants } = useRestaurantManagement();
  
  const {
    adminUser,
    currentRestaurant,
    setCurrentRestaurant,
    token,
    login,
    logout,
    switchRestaurant,
  } = useAdminAuth(restaurants);

  // Refresh restaurants when admin user is restored
  React.useEffect(() => {
    if (adminUser && token) {
      refreshRestaurants();
    }
  }, [adminUser, token, refreshRestaurants]);

  // Enhanced updateRestaurant to handle current restaurant state
  const handleUpdateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    const updatedRestaurant = updateRestaurant(id, updates);
    if (currentRestaurant?.id === id && updatedRestaurant) {
      const newCurrentRestaurant = { ...currentRestaurant, ...updates };
      setCurrentRestaurant(newCurrentRestaurant);
      localStorage.setItem("currentRestaurant", JSON.stringify(newCurrentRestaurant));
    }
  };

  // Enhanced deleteRestaurant to handle current restaurant state
  const handleDeleteRestaurant = (id: string) => {
    deleteRestaurant(id);
    if (currentRestaurant?.id === id) {
      setCurrentRestaurant(null);
      localStorage.removeItem("currentRestaurant");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        currentRestaurant,
        restaurants,
        loading,
        isAuthenticated: !!adminUser,
        isSuperAdmin: adminUser?.role === "super_admin",
        login,
        logout,
        switchRestaurant,
        addRestaurant,
        updateRestaurant: handleUpdateRestaurant,
        deleteRestaurant: handleDeleteRestaurant,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
