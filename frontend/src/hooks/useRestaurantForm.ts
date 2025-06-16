
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSchema, RestaurantFormData } from "@/schemas/restaurantSchema";
import { useAdmin } from "@/context/AdminContext";
import { Restaurant } from "@/types/admin";

export const useRestaurantForm = (
  restaurant: Restaurant | undefined,
  onClose: () => void
) => {
  const { addRestaurant, updateRestaurant } = useAdmin();
  const isEditing = !!restaurant;

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant?.name || "",
      email: restaurant?.email || "",
      phone: restaurant?.phone || "",
      address: restaurant?.address || "",
      status: restaurant?.status || "pending",
    },
  });

  const onSubmit = (data: RestaurantFormData) => {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');
    
    if (isEditing && restaurant) {
      updateRestaurant(restaurant.id, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
        slug: slug,
      });
    } else {
      addRestaurant({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
        slug: slug,
      });
    }
    onClose();
    form.reset();
  };

  return {
    form,
    onSubmit,
    isEditing,
  };
};
