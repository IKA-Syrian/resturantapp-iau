
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Eye } from "lucide-react";

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container-custom py-8 flex-grow">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-4">No order found</h1>
            <p className="text-muted-foreground mb-6">It looks like you haven't placed an order yet</p>
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

  const getStatusSteps = () => {
    return [
      { label: "Order confirmed", completed: true, current: false },
      { label: "Preparing your order", completed: false, current: true },
      { label: orderData.orderType === "delivery" ? "Out for delivery" : "Ready for pickup", completed: false, current: false },
      { label: orderData.orderType === "delivery" ? "Delivered" : "Completed", completed: false, current: false },
    ];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container-custom py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your order. We're preparing it now.</p>
          </div>

          {/* Quick Order Info */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{orderData.orderNumber}</h2>
                <p className="text-muted-foreground">Placed just now</p>
              </div>
              <Link to={`/order/${orderData.orderNumber}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-brand-teal" />
                <span>Estimated {orderData.orderType} time: <strong>{orderData.estimatedTime}</strong></span>
              </div>

              {orderData.orderType === "delivery" && orderData.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-medium">Delivering to:</p>
                    <p className="text-muted-foreground">{orderData.address}</p>
                  </div>
                </div>
              )}

              {orderData.orderType === "pickup" && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-medium">Pickup from:</p>
                    <p className="text-muted-foreground">Pizza Palace - 123 Restaurant St</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Status Progress */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Progress</h2>
            <div className="space-y-3">
              {getStatusSteps().map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-green-500' : 
                    step.current ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={
                    step.completed ? 'text-green-700 font-medium' : 
                    step.current ? 'text-yellow-700 font-medium' : 'text-gray-500'
                  }>{step.label}</span>
                  {step.current && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Current</span>}
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {orderData.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {orderData.items.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  ... and {orderData.items.length - 3} more items
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/order/${orderData.orderNumber}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                Track Order
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full sm:w-auto">
                Order History
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 w-full sm:w-auto">
                Order Again
              </Button>
            </Link>
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

export default OrderConfirmation;
