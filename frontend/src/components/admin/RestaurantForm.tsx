
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/admin";
import { useRestaurantForm } from "@/hooks/useRestaurantForm";
import RestaurantFormFields from "./RestaurantFormFields";

interface RestaurantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant?: Restaurant;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  open,
  onOpenChange,
  restaurant,
}) => {
  const handleClose = () => onOpenChange(false);
  const { form, onSubmit, isEditing } = useRestaurantForm(restaurant, handleClose);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Restaurant" : "Add Restaurant"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RestaurantFormFields control={form.control} />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90">
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantForm;
