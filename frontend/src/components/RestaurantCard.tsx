
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  imageUrl: string;
};

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-white text-black">
              ⭐ {restaurant.rating.toFixed(1)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1 truncate">{restaurant.name}</h3>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-muted">
              {restaurant.cuisine}
            </Badge>
            <span className="text-sm text-gray-500">{restaurant.deliveryTime}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-sm">Min. ${restaurant.minimumOrder.toFixed(2)}</span>
          <Badge className="bg-brand-orange hover:bg-brand-orange/90">View Menu</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
