
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAdmin } from "@/context/AdminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isSuperAdmin } = useAdmin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      // Navigate based on user role after login
      const savedAdmin = localStorage.getItem("adminUser");
      if (savedAdmin) {
        const admin = JSON.parse(savedAdmin);
        if (admin.role === "super_admin") {
          navigate("/admin/super-dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to manage restaurants</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-orange hover:bg-brand-orange/90"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p><strong>Super Admin:</strong> admin@platform.com / admin123</p>
            <p><strong>Restaurant Admin:</strong> admin@bellaitalia.com / bella123</p>
            <p><strong>Restaurant Admin:</strong> admin@pizzapalace.com / pizza123</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
