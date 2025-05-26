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

export type MenuItemType = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  options?: {
    name: string;
    choices: string[];
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
    if (item.options && item.options.length > 0) {
      setIsDialogOpen(true);
    } else {
      addItem({
        id: item.id,
        restaurantId: item.restaurantId,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
      });
    }
  };

  const handleCustomizedAddToCart = () => {
    addItem({
      id: item.id,
      restaurantId: item.restaurantId,
      name: item.name,
      price: item.price,
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

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="flex md:flex-row flex-col">
          {item.imageUrl && (
            <div className="md:w-1/4 w-full h-24 md:h-auto">
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
                <span className="font-semibold text-brand-orange">${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}</span>
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
              <div className="col-span-3 flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-2"
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2"
                >
                  +
                </Button>
              </div>
            </div>

            {item.options?.map((option) => (
              <div key={option.name} className="grid gap-2">
                <Label className="font-medium">{option.name}</Label>
                <RadioGroup
                  defaultValue={option.choices[0]}
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                >
                  {option.choices.map((choice) => (
                    <div key={choice} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice} id={`${option.name}-${choice}`} />
                      <Label htmlFor={`${option.name}-${choice}`}>{choice}</Label>
                    </div>
                  ))}
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
              Add to Cart - ${typeof item.price === 'number' ? (item.price * quantity).toFixed(2) : 'N/A'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItem;
