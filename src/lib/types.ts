import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  imagePaths: z.array(z.string()).min(1, "At least one image is required"),
  isAvailable: z.boolean().optional().default(true),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const orderSchema = z.object({
  pricePaid: z.number().min(0, "Price paid must be greater than or equal to 0"),
  status: z.string().optional().default("pending"),
  userId: z.string(),
  productId: z.string(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"), // Ensure the category name is provided
  productIds: z.array(z.string()).optional(), // Optionally pass an array of product IDs to associate
});

export const userSchema = z.object({
  email: z.string().email("Invalid email format"),
});
