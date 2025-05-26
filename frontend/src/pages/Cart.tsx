import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CartItem from "@/components/CartItem";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  const { items, subtotal, clearCart, submitOrder } = useCart();
  const { toast } = useToast();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + deliveryFee + tax;

  const handleApplyCoupon = () => {
    toast({
      title: "Coupon Applied",
      description: "Discount applied to your order",
    });
  };

  const handleCheckout = async () => {
    try {
      await submitOrder({ items, subtotal } as Record<string, unknown>);
      toast({
        title: "Order Placed!",
        description: "Your order has been submitted successfully.",
      });
      clearCart();
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error submitting your order.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items from restaurants to get started</p>
            <Link to="/">
              <Button className="bg-brand-orange hover:bg-brand-orange/90">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                <div className="divide-y">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <Link to="/">
                    <Button variant="outline">
                      Add More Items
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex mt-4">
                    <Input
                      placeholder="Promo Code"
                      className="rounded-r-none"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="rounded-l-none bg-brand-teal hover:bg-brand-teal/90"
                    >
                      Apply
                    </Button>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-brand-orange hover:bg-brand-orange/90"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
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

export default Cart;
