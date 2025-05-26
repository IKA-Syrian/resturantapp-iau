import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MenuItem, { MenuItemType } from "@/components/MenuItem";
import { Restaurant } from "@/components/RestaurantCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: restaurant, isLoading: loadingRestaurant, error: errorRestaurant } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => apiGet<Restaurant>(`/restaurants/${id}`),
    enabled: !!id,
  });
  const { data: menuItems = [], isLoading: loadingMenu, error: errorMenu } = useQuery({
    queryKey: ["menu", id],
    queryFn: () => apiGet<MenuItemType[]>(`/menu?restaurantId=${id}`),
    enabled: !!id,
  });
  // Extract unique categories from menu items if available
  const categories = Array.from(new Set(menuItems.map(item => item.options?.[0]?.name).filter(Boolean)));
  const [activeCategory, setActiveCategory] = useState<string>("");
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [menuItems]);
  if (loadingRestaurant || loadingMenu) {
    return <div className="min-h-screen"><Navigation /><div className="container-custom py-20 text-center">Loading...</div></div>;
  }
  if (errorRestaurant || errorMenu || !restaurant) {
    return <div className="min-h-screen"><Navigation /><div className="container-custom py-20 text-center text-red-500">Failed to load restaurant or menu</div></div>;
  }
  // Filter menu items by active category if categories exist
  const filteredMenuItems = activeCategory ? menuItems.filter(item => item.options?.[0]?.name === activeCategory) : menuItems;
  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Restaurant Header */}
      <div 
        className="relative bg-cover bg-center h-56"
        style={{ backgroundImage: `url(${restaurant.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container-custom relative h-full flex items-end pb-6 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Badge className="bg-white text-black">
                ⭐ {restaurant.rating.toFixed(1)}
              </Badge>
              <span>{restaurant.cuisine}</span>
              <span>📍 123 Main St</span>
              <span>🕒 {restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Menu Tabs */}
      <div className="container-custom py-8">
        {categories.length > 0 ? (
          <Tabs 
            defaultValue={activeCategory} 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="mb-6 w-full overflow-x-auto flex justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <h2 className="text-xl font-bold mb-4">{category}</h2>
                <div className="space-y-4">
                  {menuItems.filter(item => item.options?.[0]?.name === category).map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
