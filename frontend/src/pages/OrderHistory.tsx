import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["orderHistory", userId],
    queryFn: () => apiGet<any[]>(`/orders/user/${userId}`),
    enabled: !!userId,
  });

  useEffect(() => { if (userId) refetch(); }, [userId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container-custom py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Failed to load order history.</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold">Order #{order.order_number}</div>
                  <div>Status: <span className="font-medium">{order.status}</span></div>
                  <div>Date: {new Date(order.created_at).toLocaleString()}</div>
                  <div>Total: ${order.total_amount?.toFixed(2)}</div>
                </div>
                <Link to={`/order/${order.id}`} className="mt-2 md:mt-0 text-brand-orange hover:underline">View Details</Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory; 