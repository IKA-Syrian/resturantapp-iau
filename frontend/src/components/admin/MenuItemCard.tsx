
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@/hooks/useMenuManagement";

interface MenuItemCardProps {
  item: MenuItem;
  getCategoryName: (categoryId: string) => string;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: string, itemName: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  getCategoryName,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{getCategoryName(item.category)}</p>
          </div>
          <Badge variant={item.available ? "default" : "secondary"}>
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand-orange">
            ${item.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id, item.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;
