
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { Trash } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b">
      <div className="flex items-center flex-1">
        {item.imageUrl && (
          <div className="w-16 h-16 mr-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div>
          <h4 className="font-medium">{item.name}</h4>
          {item.options && Object.keys(item.options).length > 0 && (
            <p className="text-sm text-gray-500">
              {Object.entries(item.options)
                .map(([key, value]) => `${value}`)
                .join(", ")}
            </p>
          )}
          <p className="text-brand-orange">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrease}
            className="px-2 h-8 rounded-l rounded-r-none"
          >
            -
          </Button>
          <span className="w-8 h-8 flex items-center justify-center border-t border-b">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrease}
            className="px-2 h-8 rounded-r rounded-l-none"
          >
            +
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => removeItem(item.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
