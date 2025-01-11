import { z } from "zod";

// Define the enum for product status
export const ProductStatusEnum = z.enum([
  "AVAILABLE",
  "SOLD_OUT",
  "ON_HOLD",
  "COMING_SOON",
]);

export const userPermissionEnum = z.enum([
  "NORMAL_USER",
  "ADMIN_USER",
  "SUPER_ADMIN",
]);

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  imagePaths: z
    .array(
      z.object({
        key: z.string().min(1, "Image key is required"),
        url: z.string().min(1, "Image url is required"),
        size: z.number().min(0, "Image size is required"),
        name: z.string().min(1, "Image name is required"),
      }),
    )
    .min(1, "At least one image is required"),
  status: ProductStatusEnum.optional().default("AVAILABLE"),
  properties: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const adminProductSchema = z.object({
  id: z.string().min(1, "Product id is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  imagePaths: z
    .array(
      z.object({
        key: z.string().min(1, "Image key is required"),
        url: z.string().min(1, "Image url is required"),
        size: z.number().min(0, "Image size is required"),
        name: z.string().min(1, "Image name is required"),
      }),
    )
    .min(1, "At least one image is required"),
  status: ProductStatusEnum.optional().default("AVAILABLE"),
  properties: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const updateProductSchema = z.object({
  id: z.string().min(1, "Product id is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  status: ProductStatusEnum.optional().default("AVAILABLE"),
  properties: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const clientProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number().min(0.01, "Price is required, must be a positive number"),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  status: ProductStatusEnum.optional().default("AVAILABLE"),
  properties: z.array(z.string()).optional(),
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

export const categoryUpdateSchema = z.object({
  id: z.string().min(1, "Category id is required"),
  name: z.string().min(1, "Category name is required"), // Ensure the category name is provided
});

export const categoryUpdateFormSchema = z.object({
  name: z.string().min(1, "Category name is required"), // Ensure the category name is provided
});

export const userSchema = z.object({
  email: z.string().email("Must enter a valid email"),
  permission: userPermissionEnum.optional().default("NORMAL_USER"),
});

export const adminRemoveSchema = z.object({
  id: z.string().min(1, "User id is required"),
  permission: userPermissionEnum.default("NORMAL_USER"),
});

export const adminUpdateSchema = z.object({
  permission: userPermissionEnum.default("NORMAL_USER"),
});

export type IProductSchema = z.infer<typeof productSchema>;
export type IProductUpdateSchema = z.infer<typeof updateProductSchema>;
export type IClientProductSchema = z.infer<typeof clientProductSchema>;
export type IOrderSchema = z.infer<typeof orderSchema>;
export type ICategorySchema = z.infer<typeof categorySchema>;
export type ICategoryUpdateSchema = z.infer<typeof categoryUpdateFormSchema>;
export type IUserSchema = z.infer<typeof userSchema>;
export type IAdminUpdateSchema = z.infer<typeof adminUpdateSchema>;

export type TImage = {
  id: number;
  link: string;
};

export type TablePaginationProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalEntries: IProductSchema[] | ICategorySchema[] | IUserSchema[];
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

export type CategoryDropdownProps = {
  id: string;
  updateL: string;
  deleteL: string;
};

export type AdminTableDropdownProps = {
  id: string;
  updateL: string;
  deleteL: string;
};

export type DashboardProps = {
  id: string;
  imagePaths: ImageContent[];
  viewL: string;
  updateL: string;
  deleteL: string;
};
