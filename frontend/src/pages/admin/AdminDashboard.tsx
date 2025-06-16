
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { ShoppingBag, DollarSign, Users, Clock, Menu, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { currentRestaurant, isSuperAdmin } = useAdmin();

  // Redirect super admin to super dashboard if no restaurant selected
  React.useEffect(() => {
    if (isSuperAdmin && !currentRestaurant) {
      window.location.href = "/admin/super-dashboard";
    }
  }, [isSuperAdmin, currentRestaurant]);

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Restaurant Selected</h2>
            <p className="text-gray-600">Please select a restaurant to manage</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const metrics = [
    {
      title: "New Orders",
      value: "8",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Today's Sales",
      value: "$1,245",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Customers",
      value: "24",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. Prep Time",
      value: "18 min",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentOrders = [
    {
      id: "#1234",
      customer: "John Doe",
      items: "Margherita Pizza, Coca Cola",
      status: "Preparing",
      total: "$24.99",
      time: "10:30 AM",
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      items: "Pepperoni Pizza, Garlic Bread",
      status: "Ready",
      total: "$32.50",
      time: "10:45 AM",
    },
    {
      id: "#1236",
      customer: "Mike Wilson",
      items: "Caesar Salad, Pasta Carbonara",
      status: "New",
      total: "$28.75",
      time: "11:00 AM",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-red-100 text-red-800";
      case "Preparing":
        return "bg-yellow-100 text-yellow-800";
      case "Ready":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of {currentRestaurant.name}'s activity</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.total}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/orders" className="block">
                <Button className="w-full justify-start bg-brand-orange hover:bg-brand-orange/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Manage Orders
                </Button>
              </Link>
              <Link to="/admin/menu" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Menu className="h-4 w-4 mr-2" />
                  Update Menu
                </Button>
              </Link>
              <Link to="/admin/settings" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Restaurant Settings
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
