import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  imagePaths: z
    .array(
      z.object({
        key: z.string().min(1, "Image key is required"),
        url: z.string().min(1, "Image url is required"),
        size: z.string().min(1, "Image size is required"),
        name: z.string().min(1, "Image name is required"),
      }),
    )
    .min(1, "At least one image is required"),
  isAvailable: z.boolean().optional().default(true),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const clientProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
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
  email: z.string().email("Must enter a valid email"),
});

export type IProductSchema = z.infer<typeof productSchema>;
export type IOrderSchema = z.infer<typeof orderSchema>;
export type ICategorySchema = z.infer<typeof categorySchema>;
export type IUserSchema = z.infer<typeof userSchema>;

export type TImage = {
  id: number;
  link: string;
};

export type TablePaginationProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalEntries: any;
};

export type TableProps = {
  page: number | string;
  per_page: number;
};

export type ImageContent = {
  id: string;
  key: string;
  url: string;
};
