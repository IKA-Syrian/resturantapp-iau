
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Minus } from "lucide-react";

export type MenuItemType = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  options?: {
    name: string;
    choices: { name: string; price: number }[];
  }[];
};

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const handleAddToCart = () => {
    setIsDialogOpen(true);
  };

  const calculateTotalPrice = () => {
    let totalPrice = item.price;
    
    if (item.options) {
      item.options.forEach(option => {
        const selectedChoice = selectedOptions[option.name];
        if (selectedChoice) {
          const choice = option.choices.find(c => c.name === selectedChoice);
          if (choice) {
            totalPrice += choice.price;
          }
        }
      });
    }
    
    return totalPrice * quantity;
  };

  const handleCustomizedAddToCart = () => {
    addItem({
      id: item.id,
      restaurantId: item.restaurantId,
      name: item.name,
      price: calculateTotalPrice() / quantity, // Store unit price including options
      quantity,
      options: selectedOptions,
      imageUrl: item.imageUrl,
    });
    setIsDialogOpen(false);
    setQuantity(1);
    setSelectedOptions({});
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getOptionPrice = (optionName: string, choiceName: string) => {
    const option = item.options?.find(opt => opt.name === optionName);
    const choice = option?.choices.find(c => c.name === choiceName);
    return choice?.price || 0;
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex md:flex-row flex-col">
          {item.imageUrl && (
            <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <span className="font-semibold text-brand-orange">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
            </div>
            <Button
              onClick={handleAddToCart}
              variant="default"
              size="sm"
              className="mt-2 self-end bg-brand-orange hover:bg-brand-orange/90"
            >
              Add to Cart
            </Button>
          </CardContent>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize your order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseQuantity}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {item.options?.map((option) => (
              <div key={option.name} className="grid gap-2">
                <Label className="font-medium">{option.name}</Label>
                <RadioGroup
                  defaultValue={option.choices[0]?.name}
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                >
                  {option.choices.map((choice) => {
                    const extraPrice = choice.price;
                    return (
                      <div key={choice.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={choice.name} id={`${option.name}-${choice.name}`} />
                          <Label htmlFor={`${option.name}-${choice.name}`}>{choice.name}</Label>
                        </div>
                        {extraPrice > 0 && (
                          <span className="text-sm text-brand-orange font-medium">
                            +${extraPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleCustomizedAddToCart}
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              Add to Cart - ${calculateTotalPrice().toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItem;
