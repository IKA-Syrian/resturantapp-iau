import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MenuItem, { MenuItemType } from "@/components/MenuItem";
import { Restaurant } from "@/components/RestaurantCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = 'http://localhost:3000/api';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItemType[];
}

interface RestaurantWithMenu extends Restaurant {
  menu: MenuCategory[];
}

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantWithMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetail(id);
    }
  }, [id]);

  const fetchRestaurantDetail = async (restaurantId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/public/${restaurantId}`);
      
      if (!response.ok) {
        throw new Error('Restaurant not found');
      }
      
      const data = await response.json();
      
      // Transform the data to match our frontend format
      const transformedRestaurant: RestaurantWithMenu = {
        id: data.id.toString(),
        name: data.name,
        cuisine: data.cuisine || 'International',
        rating: data.rating || 4.5,
        deliveryTime: data.deliveryTime || '25-35 min',
        minimumOrder: data.minimumOrder || 15,
        imageUrl: data.imageUrl || data.logo_url,
        menu: data.menu.map((category: any) => ({
          id: category.id.toString(),
          name: category.name,
          description: category.description,
          items: category.items?.map((item: any) => ({
            id: item.id.toString(),
            restaurantId: restaurantId,
            name: item.name,
            description: item.description || '',
            price: parseFloat(item.price || '0'),
            imageUrl: item.imageUrl || item.image_url,
            options: [] // We can add options later if needed
          })) || []
        }))
      };
      
      setRestaurant(transformedRestaurant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-orange mx-auto"></div>
            <p className="mt-4 text-lg">Loading restaurant details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Restaurant Not Found</h1>
            <p className="text-muted-foreground">{error || 'The restaurant you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Restaurant Header */}
      <div className="relative h-64 bg-gradient-to-r from-brand-orange to-orange-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {restaurant.cuisine}
              </Badge>
              <span className="flex items-center gap-1">
                ⭐ {restaurant.rating}
              </span>
              <span>{restaurant.deliveryTime}</span>
              <span>Min order: ${restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container-custom py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {restaurant.menu.length > 0 ? (
          <Tabs defaultValue={restaurant.menu[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-auto">
              {restaurant.menu.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {restaurant.menu.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-muted-foreground">{category.description}</p>
                  )}
                </div>
                
                <div className="grid gap-4">
                  {category.items.length > 0 ? (
                    category.items.map((item) => (
                      <MenuItem key={item.id} item={item} />
                    ))
                  ) : (
                    <p className="text-muted-foreground py-8 text-center">
                      No items available in this category
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Menu Coming Soon</h3>
            <p className="text-muted-foreground">
              This restaurant is still setting up their menu. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
