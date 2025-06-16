
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Search, Eye } from "lucide-react";

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const orders = [
    {
      id: "#1234",
      customer: "John Doe",
      phone: "+1 234-567-8900",
      email: "john@example.com",
      time: "10:30 AM",
      status: "preparing",
      total: 24.99,
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 18.99, options: "Large, Extra Cheese" },
        { name: "Coca Cola", quantity: 1, price: 2.99, options: "330ml" },
        { name: "Delivery Fee", quantity: 1, price: 3.01, options: "" },
      ],
      address: "123 Main St, City, State 12345",
      orderType: "delivery",
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      phone: "+1 234-567-8901",
      email: "jane@example.com",
      time: "10:45 AM",
      status: "ready",
      total: 32.50,
      items: [
        { name: "Pepperoni Pizza", quantity: 1, price: 22.99, options: "Medium" },
        { name: "Garlic Bread", quantity: 2, price: 4.99, options: "" },
        { name: "Delivery Fee", quantity: 1, price: 2.53, options: "" },
      ],
      address: "456 Oak Ave, City, State 12345",
      orderType: "delivery",
    },
    {
      id: "#1236",
      customer: "Mike Wilson",
      phone: "+1 234-567-8902",
      email: "mike@example.com",
      time: "11:00 AM",
      status: "new",
      total: 28.75,
      items: [
        { name: "Caesar Salad", quantity: 1, price: 12.99, options: "Large" },
        { name: "Pasta Carbonara", quantity: 1, price: 15.76, options: "" },
      ],
      address: "",
      orderType: "pickup",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all restaurant orders</p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Table */}
          <Card className="lg:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.time}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Order Details */}
          <Card className="p-6">
            {selectedOrder ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Customer Info</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.customer}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                  </div>

                  {selectedOrder.orderType === "delivery" && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Delivery Address</h4>
                      <p className="text-sm text-gray-600">{selectedOrder.address}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                          {item.options && (
                            <p className="text-xs text-gray-500">{item.options}</p>
                          )}
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Update Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(selectedOrder.id, "confirmed")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(selectedOrder.id, "preparing")}
                      >
                        Prepare
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(selectedOrder.id, "ready")}
                      >
                        Ready
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(selectedOrder.id, "completed")}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Select an order to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
