
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, ArrowLeft, Phone, Mail } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: { [key: string]: string };
}

interface Order {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  orderType: "delivery" | "pickup";
  address?: string;
  estimatedTime: string;
  status: "confirmed" | "preparing" | "ready" | "completed";
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
}

const Order = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll check localStorage or create mock data
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder && orderNumber) {
      const orderData = JSON.parse(savedOrder);
      if (orderData.orderNumber === orderNumber) {
        setOrder({
          ...orderData,
          status: "preparing",
          customer: {
            name: "John Doe",
            phone: "+1 234-567-8900",
            email: "john@example.com",
          },
          restaurant: {
            name: "Pizza Palace",
            address: "123 Restaurant St, City, State 12345",
            phone: "+1 234-567-8901",
          },
          createdAt: new Date().toISOString(),
        });
      }
    }
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-4">Order not found</h1>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed</p>
            <Link to="/profile">
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                View Order History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: "confirmed", label: "Order confirmed", completed: true },
      { key: "preparing", label: "Preparing your order", completed: order.status !== "confirmed" },
      { key: "ready", label: order.orderType === "delivery" ? "Out for delivery" : "Ready for pickup", completed: ["ready", "completed"].includes(order.status) },
      { key: "completed", label: order.orderType === "delivery" ? "Delivered" : "Completed", completed: order.status === "completed" },
    ];
    return steps;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container-custom py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/profile" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="ml-auto">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Order Status
                </h2>
                <div className="space-y-3">
                  {getStatusSteps().map((step, index) => (
                    <div key={step.key} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={step.completed ? 'text-green-700 font-medium' : 'text-gray-500'}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {Object.entries(item.options)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Delivery/Pickup Info */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {order.orderType === "delivery" ? "Delivery" : "Pickup"} Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-brand-teal" />
                    <span>Estimated time: <strong>{order.estimatedTime}</strong></span>
                  </div>
                  {order.orderType === "delivery" && order.address && (
                    <div>
                      <p className="font-medium">Delivery Address:</p>
                      <p className="text-muted-foreground">{order.address}</p>
                    </div>
                  )}
                  {order.orderType === "pickup" && (
                    <div>
                      <p className="font-medium">Pickup Location:</p>
                      <p className="text-muted-foreground">{order.restaurant.address}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{order.customer.email}</span>
                  </div>
                </div>
              </Card>

              {/* Restaurant Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Restaurant</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{order.restaurant.name}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span className="text-sm">{order.restaurant.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{order.restaurant.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Contact Restaurant
                  </Button>
                  <Link to="/">
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                      Order Again
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
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

export default Order;
