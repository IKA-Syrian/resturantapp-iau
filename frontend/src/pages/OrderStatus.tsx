import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const OrderStatus = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiGet<any>(`/orders/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen"><Navigation /><div className="container-custom py-20 text-center">Loading...</div></div>;
  if (error || !order) return <div className="min-h-screen"><Navigation /><div className="container-custom py-20 text-center text-red-500">Failed to load order.</div></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-4">Order #{order.order_number}</h1>
        <div className="mb-4">Status: <span className="font-medium">{order.status}</span></div>
        <div className="mb-4">Placed: {new Date(order.created_at).toLocaleString()}</div>
        <div className="mb-4">Total: ${order.total_amount?.toFixed(2)}</div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
        <div className="space-y-2 mb-6">
          {order.orderItems?.map((item: any) => (
            <Card key={item.id} className="p-2 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">{item.item_name}</div>
                <div>Qty: {item.quantity}</div>
                <div>Unit Price: ${item.unit_price?.toFixed(2)}</div>
                <div>Total: ${item.item_total?.toFixed(2)}</div>
              </div>
            </Card>
          ))}
        </div>
        <Link to="/orders" className="text-brand-orange hover:underline">Back to Order History</Link>
      </main>
    </div>
  );
};

export default OrderStatus; 