import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiPost } from "@/lib/api";

export type CartItem = {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  options?: { [key: string]: string };
  imageUrl?: string;
};

type CartContextType = {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  submitOrder: (orderDetails: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedRestaurantId = localStorage.getItem("cartRestaurantId");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedRestaurantId) {
      setRestaurantId(savedRestaurantId);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem("cartRestaurantId", restaurantId);
    }
  }, [items, restaurantId]);

  const addItem = (item: CartItem) => {
    // Check if we need to clear the cart (items from a different restaurant)
    if (restaurantId && item.restaurantId !== restaurantId && items.length > 0) {
      toast({
        title: "Cart Cleared",
        description: "Your cart contained items from another restaurant",
      });
      setItems([{ ...item, quantity: item.quantity || 1 }]);
      setRestaurantId(item.restaurantId);
      return;
    }

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity || 1;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });

    if (!restaurantId) {
      setRestaurantId(item.restaurantId);
    }

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });

    // If cart is empty, clear restaurant ID
    if (items.length <= 1) {
      setRestaurantId(null);
      localStorage.removeItem("cartRestaurantId");
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartRestaurantId");
    toast({
      title: "Cart Cleared",
      description: "Your cart has been cleared.",
    });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const submitOrder = async (orderDetails: Record<string, unknown>): Promise<Record<string, unknown>> => {
    // You can customize orderDetails as needed
    return apiPost("/orders", orderDetails);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        submitOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
