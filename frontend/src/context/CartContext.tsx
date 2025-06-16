import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  checkout: (orderData: CheckoutData) => Promise<unknown>;
  totalItems: number;
  subtotal: number;
};

type CheckoutData = {
  order_type: 'delivery' | 'pickup';
  delivery_address_id?: string;
  special_instructions?: string;
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

  const checkout = async (orderData: CheckoutData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to place an order");
      }

      if (!restaurantId) {
        throw new Error("No restaurant selected");
      }

      const orderItems = items.map(item => ({
        menu_item_id: parseInt(item.id),
        quantity: item.quantity,
        special_notes: Object.entries(item.options || {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ') || undefined
      }));

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant_id: parseInt(restaurantId),
          order_type: orderData.order_type,
          delivery_address_id: orderData.delivery_address_id ? parseInt(orderData.delivery_address_id) : undefined,
          items: orderItems,
          special_instructions: orderData.special_instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const order = await response.json();
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id} has been placed.`,
      });

      return order;
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        totalItems,
        subtotal,
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
