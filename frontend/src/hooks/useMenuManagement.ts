
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface MenuOption {
  name: string;
  choices: { name: string; price: number }[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  options?: MenuOption[];
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export const useMenuManagement = () => {
  const { toast } = useToast();

  const categories: Category[] = [
    { id: "pizza", name: "Pizza", order: 1 },
    { id: "appetizers", name: "Appetizers", order: 2 },
    { id: "salads", name: "Salads", order: 3 },
    { id: "pasta", name: "Pasta", order: 4 },
    { id: "beverages", name: "Beverages", order: 5 },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      category: "pizza",
      price: 18.99,
      description: "Fresh tomatoes, mozzarella, basil",
      image: "/placeholder.svg",
      available: true,
      options: [
        { name: "Size", choices: [
          { name: "Small", price: 0 },
          { name: "Medium", price: 3 },
          { name: "Large", price: 6 }
        ]},
        { name: "Extra Toppings", choices: [
          { name: "Extra Cheese", price: 2 },
          { name: "Pepperoni", price: 3 },
          { name: "Mushrooms", price: 2 }
        ]}
      ]
    },
    {
      id: "2", 
      name: "Caesar Salad",
      category: "salads",
      price: 12.99,
      description: "Romaine lettuce, parmesan, croutons, caesar dressing",
      image: "/placeholder.svg",
      available: true,
      options: [
        { name: "Size", choices: [
          { name: "Regular", price: 0 },
          { name: "Large", price: 4 }
        ]},
        { name: "Add Protein", choices: [
          { name: "Grilled Chicken", price: 5 },
          { name: "Shrimp", price: 7 }
        ]}
      ]
    },
  ];

  const saveItem = (formData: any) => {
    toast({
      title: "Item Saved",
      description: `${formData.name} has been updated successfully`,
    });
  };

  const deleteItem = (itemId: string, itemName: string) => {
    toast({
      title: "Item Deleted",
      description: `${itemName} has been removed from the menu`,
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  return {
    categories,
    menuItems,
    saveItem,
    deleteItem,
    getCategoryName,
  };
};
