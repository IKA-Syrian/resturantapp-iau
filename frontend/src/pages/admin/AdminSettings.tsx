
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Save, Upload } from "lucide-react";

const AdminSettings = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Bella Italia Restaurant",
    description: "Authentic Italian cuisine in the heart of the city",
    phone: "+1 (555) 123-4567",
    email: "info@bellaitalia.com",
    address: "123 Main Street, City, State 12345",
    website: "www.bellaitalia.com",
  });

  const [operatingHours, setOperatingHours] = useState([
    { day: "Monday", open: "11:00", close: "22:00", closed: false },
    { day: "Tuesday", open: "11:00", close: "22:00", closed: false },
    { day: "Wednesday", open: "11:00", close: "22:00", closed: false },
    { day: "Thursday", open: "11:00", close: "22:00", closed: false },
    { day: "Friday", open: "11:00", close: "23:00", closed: false },
    { day: "Saturday", open: "11:00", close: "23:00", closed: false },
    { day: "Sunday", open: "12:00", close: "21:00", closed: false },
  ]);

  const { toast } = useToast();

  const handleSaveRestaurantInfo = () => {
    toast({
      title: "Settings Saved",
      description: "Restaurant information has been updated successfully",
    });
  };

  const handleSaveOperatingHours = () => {
    toast({
      title: "Operating Hours Updated",
      description: "Operating hours have been saved successfully",
    });
  };

  const updateOperatingHours = (index: number, field: string, value: string | boolean) => {
    const updated = [...operatingHours];
    updated[index] = { ...updated[index], [field]: value };
    setOperatingHours(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Settings</h1>
          <p className="text-gray-600">Manage your restaurant profile and configuration</p>
        </div>

        {/* Restaurant Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Restaurant Information</h2>
            <Button onClick={handleSaveRestaurantInfo} className="bg-brand-orange hover:bg-brand-orange/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <Input
                value={restaurantInfo.name}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                value={restaurantInfo.phone}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                type="email"
                value={restaurantInfo.email}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                value={restaurantInfo.website}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, website: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={restaurantInfo.address}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={restaurantInfo.description}
                onChange={(e) => setRestaurantInfo({ ...restaurantInfo, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Logo Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Logo</h2>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-xs">Logo</span>
            </div>
            <div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Logo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                Recommended size: 200x200px, Max file size: 2MB
              </p>
            </div>
          </div>
        </Card>

        {/* Operating Hours */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
            <Button onClick={handleSaveOperatingHours} className="bg-brand-orange hover:bg-brand-orange/90">
              <Save className="h-4 w-4 mr-2" />
              Save Hours
            </Button>
          </div>

          <div className="space-y-4">
            {operatingHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center space-x-4">
                <div className="w-24 font-medium text-sm">
                  {hours.day}
                </div>
                
                {hours.closed ? (
                  <div className="flex-1">
                    <span className="text-gray-500">Closed</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateOperatingHours(index, "open", e.target.value)}
                      className="w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateOperatingHours(index, "close", e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateOperatingHours(index, "closed", !hours.closed)}
                >
                  {hours.closed ? "Open" : "Close"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Fee ($)
              </label>
              <Input type="number" step="0.01" defaultValue="2.99" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order ($)
              </label>
              <Input type="number" step="0.01" defaultValue="15.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Radius (miles)
              </label>
              <Input type="number" defaultValue="5" />
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
