
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Menu as MenuIcon, 
  Settings, 
  LogOut,
  Building2,
  Users
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, currentRestaurant, isSuperAdmin, logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getNavItems = () => {
    if (isSuperAdmin) {
      return [
        { path: "/admin/super-dashboard", label: "Super Dashboard", icon: LayoutDashboard },
        { path: "/admin/restaurants", label: "Restaurants", icon: Building2 },
        { path: "/admin/platform-users", label: "Platform Users", icon: Users },
        ...(currentRestaurant ? [
          { path: "/admin/dashboard", label: "Restaurant Dashboard", icon: LayoutDashboard },
          { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
          { path: "/admin/menu", label: "Menu", icon: MenuIcon },
          { path: "/admin/settings", label: "Settings", icon: Settings },
        ] : [])
      ];
    } else {
      // Restaurant admin - only restaurant level pages
      return [
        { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { path: "/admin/menu", label: "Menu", icon: MenuIcon },
        { path: "/admin/settings", label: "Settings", icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            {isSuperAdmin ? "Platform Admin" : "Restaurant Admin"}
          </h1>
          {currentRestaurant && (
            <p className="text-sm text-gray-600 mt-1">{currentRestaurant.name}</p>
          )}
        </div>
        
        <nav className="flex-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isSuperAdmin && !currentRestaurant 
                ? "Platform Management" 
                : currentRestaurant?.name || "Restaurant Management"
              }
            </h2>
            <div className="flex items-center space-x-4">
              {isSuperAdmin && !currentRestaurant && (
                <span className="text-sm text-blue-600 font-medium">Super Admin Mode</span>
              )}
              <div className="text-sm text-gray-500">
                Welcome back, {adminUser?.name}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
