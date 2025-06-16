
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PlatformUserForm from "@/components/admin/PlatformUserForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserX
} from "lucide-react";

type PlatformUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "restaurant_admin" | "platform_user";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
  restaurantId?: string;
};

const AdminPlatformUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | undefined>();

  // Mock platform users data
  const platformUsers: PlatformUser[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-06-14",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah@bellaitalia.com",
      role: "restaurant_admin",
      status: "active",
      lastLogin: "2024-06-13",
      createdAt: "2024-02-01",
      restaurantId: "1"
    },
    {
      id: "3",
      name: "Mike Wilson", 
      email: "mike@pizzapalace.com",
      role: "restaurant_admin",
      status: "active",
      lastLogin: "2024-06-12",
      createdAt: "2024-02-15",
      restaurantId: "2"
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma@example.com", 
      role: "platform_user",
      status: "inactive",
      lastLogin: "2024-06-01",
      createdAt: "2024-03-01"
    }
  ];

  const filteredUsers = platformUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "restaurant_admin":
        return "bg-blue-100 text-blue-800";
      case "platform_user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (user: PlatformUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUser(undefined);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Users</h1>
            <p className="text-gray-600">Manage all platform users and administrators</p>
          </div>
          <Button onClick={handleAdd} className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">{filteredUsers.length} users</span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.status === "active" ? (
                        <Button size="sm" variant="outline" title="Deactivate User">
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" title="Activate User">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" title="Delete User">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <PlatformUserForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          user={editingUser}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPlatformUsers;
