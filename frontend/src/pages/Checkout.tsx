import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items, subtotal, clearCart, submitOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deliveryFee = 2.99;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  const handleConfirmOrder = async () => {
    try {
      // You may want to collect more info (address, payment, etc.)
      const order = await submitOrder({
        user_id: user?.id,
        items,
        subtotal,
        total_amount: total,
      });
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (error) {
      alert("Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg mt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </Card>
        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90" onClick={handleConfirmOrder}>
          Confirm Order
        </Button>
      </main>
    </div>
  );
};

export default Checkout; 