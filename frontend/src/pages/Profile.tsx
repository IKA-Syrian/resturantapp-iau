import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import AddressForm, { type Address } from "@/components/AddressForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Clock, MapPin, LogOut, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock order history - in a real app, this would come from your backend
  const orderHistory = [
    {
      id: "1",
      orderNumber: "ABC123",
      date: "2024-01-15",
      restaurant: "Pizza Palace",
      total: 24.99,
      status: "Delivered",
      items: ["Margherita Pizza", "Garlic Bread"]
    },
    {
      id: "2",
      orderNumber: "DEF456",
      date: "2024-01-10",
      restaurant: "Burger Barn",
      total: 18.50,
      status: "Delivered",
      items: ["Classic Burger", "Fries", "Coke"]
    }
  ];

  // Mock saved addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      address: "123 Main St, City, State 12345",
      isDefault: true
    },
    {
      id: "2",
      label: "Work",
      address: "456 Office Blvd, City, State 12345",
      isDefault: false
    }
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-4">Please log in</h1>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your profile</p>
            <Link to="/login">
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would make an API call to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been successfully changed",
    });
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setAddressFormOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressFormOpen(true);
  };

  const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addressData, id: editingAddress.id }
          : addressData.isDefault 
            ? { ...addr, isDefault: false }
            : addr
      ));
      toast({
        title: "Address Updated",
        description: "Your address has been successfully updated",
      });
    } else {
      // Add new address
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString(),
      };
      
      // If this is set as default, make others not default
      if (addressData.isDefault) {
        setAddresses([...addresses.map(addr => ({ ...addr, isDefault: false })), newAddress]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
      
      toast({
        title: "Address Added",
        description: "New address has been added to your account",
      });
    }
  };

  const removeAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    toast({
      title: "Address Removed",
      description: "The address has been removed from your account",
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast({
      title: "Default Address Updated",
      description: "Default address has been updated",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                    activeTab === "profile" ? "bg-brand-orange text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                    activeTab === "orders" ? "bg-brand-orange text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                    activeTab === "addresses" ? "bg-brand-orange text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>My Addresses</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!editMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  {editMode && (
                    <Button onClick={handleSaveProfile} className="bg-brand-orange hover:bg-brand-orange/90">
                      Save Changes
                    </Button>
                  )}

                  {/* Change Password Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleChangePassword} className="bg-brand-teal hover:bg-brand-teal/90">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">{order.restaurant}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total.toFixed(2)}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Items: {order.items.join(", ")}
                      </div>
                    </div>
                  ))}
                  {orderHistory.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No orders yet</p>
                      <Link to="/">
                        <Button className="mt-4 bg-brand-orange hover:bg-brand-orange/90">
                          Start Ordering
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Addresses</h2>
                  <Button 
                    onClick={handleAddAddress}
                    className="bg-brand-orange hover:bg-brand-orange/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{address.label}</h3>
                            {address.isDefault && (
                              <span className="text-xs bg-brand-orange text-white px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground">{address.address}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setDefaultAddress(address.id)}
                              >
                                Set Default
                              </Button>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeAddress(address.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Address Form Dialog */}
      <AddressForm
        open={addressFormOpen}
        onOpenChange={setAddressFormOpen}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
      
      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container-custom">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
