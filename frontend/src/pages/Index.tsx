import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RestaurantCard, { Restaurant } from "@/components/RestaurantCard";
import Navigation from "@/components/Navigation";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

const cuisines = ["All", "Italian", "Japanese", "American", "Mexican", "Chinese"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const { data: restaurantsData = [], isLoading, error } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => apiGet<Restaurant[]>("/restaurants"),
  });

  const filteredRestaurants = restaurantsData
    .filter((restaurant) => 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCuisine === "All" || restaurant.cuisine === selectedCuisine)
    )
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "deliveryTime") {
        const aTime = parseInt(a.deliveryTime.split("-")[0]);
        const bTime = parseInt(b.deliveryTime.split("-")[0]);
        return aTime - bTime;
      } else if (sortBy === "minimumOrder") {
        return a.minimumOrder - b.minimumOrder;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-orange to-orange-400 text-white py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Delicious Food Delivered
              </h1>
              <p className="text-xl mb-8">
                Order from your favorite restaurants and enjoy at home
              </p>
              <div className="relative max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search for restaurants..."
                  className="w-full pl-10 py-6 bg-white text-black rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Listing Section */}
        <section className="py-10">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">
                Restaurants Near You
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
                    <SelectItem value="minimumOrder">Minimum Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20">Loading...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">Failed to load restaurants</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {filteredRestaurants.length === 0 && !isLoading && !error && (
              <div className="text-center py-20">
                <h3 className="text-xl">No restaurants found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FoodDelivery</h3>
              <p>The best food delivery service in town.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand-orange">About Us</a></li>
                <li><a href="#" className="hover:text-brand-orange">Partner With Us</a></li>
                <li><a href="#" className="hover:text-brand-orange">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p>Email: support@fooddelivery.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
