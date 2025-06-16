
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMenuManagement, MenuItem } from "@/hooks/useMenuManagement";
import CategoryFilter from "@/components/admin/CategoryFilter";
import MenuItemForm from "@/components/admin/MenuItemForm";
import MenuItemCard from "@/components/admin/MenuItemCard";

const AdminMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { categories, menuItems, saveItem, deleteItem, getCategoryName } = useMenuManagement();

  const handleSaveItem = (formData: any) => {
    saveItem(formData);
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Management</h1>
            <p className="text-gray-600">Manage your restaurant's menu categories and items</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <MenuItemForm
          categories={categories}
          editingItem={editingItem}
          showAddForm={showAddForm}
          onSave={handleSaveItem}
          onClose={handleCloseForm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              getCategoryName={getCategoryName}
              onEdit={handleEditItem}
              onDelete={deleteItem}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
