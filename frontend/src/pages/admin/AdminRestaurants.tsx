import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RestaurantForm from "@/components/admin/RestaurantForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/context/AdminContext";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Building2, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search
} from "lucide-react";
import { Restaurant } from "@/types/admin";

const AdminRestaurants = () => {
  const { restaurants, switchRestaurant, deleteRestaurant } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>();

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingRestaurant(undefined);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRestaurant(undefined);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Management</h1>
            <p className="text-gray-600">Manage all restaurants on the platform</p>
          </div>
          <Button onClick={handleAdd} className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{filteredRestaurants.length} restaurants</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{restaurant.name}</div>
                      <div className="text-sm text-gray-500">{restaurant.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{restaurant.email}</div>
                      <div className="text-sm text-gray-500">{restaurant.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(restaurant.status)}>
                      {restaurant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{restaurant.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => switchRestaurant(restaurant.id)}
                        title="View Restaurant"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(restaurant)}
                        title="Edit Restaurant"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRestaurant(restaurant.id)}
                        title="Delete Restaurant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <RestaurantForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          restaurant={editingRestaurant}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminRestaurants;
