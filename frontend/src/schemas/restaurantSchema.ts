
import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["active", "inactive", "pending"]),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;
