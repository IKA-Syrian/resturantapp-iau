
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Clock } from "lucide-react";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState("delivery");
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const deliveryFee = orderType === "delivery" ? 2.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart first",
        variant: "destructive",
      });
      return;
    }

    // Generate order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Store order details in localStorage for the confirmation page
    localStorage.setItem("lastOrder", JSON.stringify({
      orderNumber,
      items,
      total,
      orderType,
      address,
      timeSlot,
      estimatedTime: orderType === "delivery" ? "30-45 mins" : "15-20 mins"
    }));

    clearCart();
    
    toast({
      title: "Order Placed!",
      description: `Order #${orderNumber} has been placed successfully`,
    });

    navigate("/order-confirmation");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart before checkout</p>
            <Link to="/">
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Order Type
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={orderType === "delivery" ? "default" : "outline"}
                  onClick={() => setOrderType("delivery")}
                  className="h-12"
                >
                  Delivery
                </Button>
                <Button
                  variant={orderType === "pickup" ? "default" : "outline"}
                  onClick={() => setOrderType("pickup")}
                  className="h-12"
                >
                  Pickup
                </Button>
              </div>
            </Card>

            {/* Address */}
            {orderType === "delivery" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Time Slot */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {orderType === "delivery" ? "Delivery" : "Pickup"} Time
              </h2>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a time slot</option>
                <option value="asap">ASAP (30-45 mins)</option>
                <option value="1hour">In 1 hour</option>
                <option value="2hours">In 2 hours</option>
                <option value="evening">This evening (6-8 PM)</option>
              </select>
            </Card>

            {/* Contact Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Label htmlFor="cash">Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}</Label>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-brand-orange hover:bg-brand-orange/90"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
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

export default Checkout;
