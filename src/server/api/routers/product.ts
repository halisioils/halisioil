import { z } from "zod";
import {
  type ImageContent,
  productSchema,
  updateProductSchema,
} from "~/lib/types";
import { UTApi } from "uploadthing/server";

import {
  createTRPCRouter,
  privateAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const utapi = new UTApi();

export const productRouter = createTRPCRouter({
  create: privateAdminProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          imagePaths: input.imagePaths, // Ensured it has at least one image path
          status: input.status,
          properties: input.properties,
          productCategories: {
            create: input.categories.map(({ categoryId, price }) => ({
              price: price,
              category: { connect: { id: categoryId } },
            })),
          },
        },
      });
    }),

  update: privateAdminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            status: input.status,
            properties: input.properties,
            productCategories: {
              upsert: input.categories.map(({ categoryId, price }) => ({
                where: {
                  productId_categoryId: {
                    productId: input.id,
                    categoryId: categoryId,
                  },
                },
                update: {
                  price: price, // Ensure price updates
                },
                create: {
                  price: price,
                  category: { connect: { id: categoryId } },
                },
              })),
            },
          },
          select: {
            id: true,
            name: true,
          },
        });
        return product;
      } catch (error) {
        throw error;
      }
    }),

  addImages: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID is required"), // Validate 'id' is non-empty
        images: z
          .array(
            z.object({
              key: z.string().min(1, "Image key is required"), // Validate 'key' is non-empty
              url: z.string().min(1, "Image url is required"), // Validate 'url' is non-empty
              size: z.number().min(0, "Image size is required"), // Validate 'size' is a positive number
              name: z.string().min(1, "Image name is required"), // Validate 'name' is non-empty
            }),
          )
          .min(1, "At least one image is required"), // Ensure at least one image is provided
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, images } = input;

      // Fetch the existing product to get its current imagePaths
      const product = await ctx.db.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Type assertion to treat imagePaths as an array of ImageContent
      const existingImagePaths = product.imagePaths as
        | ImageContent[]
        | null
        | undefined;

      if (!existingImagePaths) {
        throw new Error("No existing image paths found for this product.");
      }

      // Add the new images to the existing imagePaths
      const updatedImagePaths = [...existingImagePaths, ...images];

      // Update the product with the new imagePaths array
      const updatedProduct = await ctx.db.product.update({
        where: { id },
        data: {
          imagePaths: updatedImagePaths, // Append new images
        },
      });

      return updatedProduct;
    }),

  deleteImage: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID is required"), // Validate 'id' is non-empty
        key: z.string().min(1, "Image key is required"), // Validate 'key' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, key } = input;

      // Fetch the product to update its imagePaths
      const product = await ctx.db.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Type assertion to treat imagePaths as an array of ImageContent
      const imagePaths = product.imagePaths as
        | ImageContent[]
        | null
        | undefined;

      if (!imagePaths) {
        throw new Error("No image paths found for this product.");
      }

      // Filter out the image based on the key
      const updatedImagePaths: ImageContent[] = imagePaths.filter(
        (image: ImageContent) => image.key !== key,
      );

      // Update the product with the modified imagePaths array
      const updatedProduct = await ctx.db.product.update({
        where: { id },
        data: { imagePaths: updatedImagePaths },
      });

      // Delete the image file using the external API
      await utapi.deleteFiles(key);

      return updatedProduct;
    }),

  delete: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID is required"), // Validate 'name' is non-empty
        key: z
          .array(z.string().min(1, "Image key is required"))
          .min(1, "At least one image is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, key } = input;
      // Execute both operations in parallel
      const [deleteProductResponse] = await Promise.all([
        // Delete the product from the database
        ctx.db.product.delete({
          where: {
            id,
          },
        }),

        // Delete the file using the external API
        utapi.deleteFiles(key),
      ]);

      return deleteProductResponse;
    }),

  deleteMany: privateAdminProcedure
    .input(
      z.object({
        ids: z
          .array(z.string().min(1, "Product ID is required"))
          .min(1, "At least one product ID is required"), // Validate 'ids' is non-empty
        keys: z
          .array(z.string().min(1, "Image key is required"))
          .min(1, "At least one image is required"), // Validate 'keys' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ids, keys } = input;

      // Execute both operations in parallel
      const [deleteProductsResponse] = await Promise.all([
        // Delete the products from the database (based on ids)
        ctx.db.product.deleteMany({
          where: {
            id: {
              in: ids, // Delete products whose ids are in the 'ids' array
            },
          },
        }),

        // Delete the files using the external API (based on keys)
        utapi.deleteFiles(keys),
      ]);

      // Return the response after deletion
      return deleteProductsResponse;
    }),

  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return products ?? null;
  }),

  getLandingPageProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productCategories: {
          include: {
            category: true,
          },
        },
      },
      take: 4,
    });

    return products ?? null;
  }),

  getSingleProduct: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const product = await ctx.db.product.findFirst({
        where: {
          id,
        },
        include: {
          productCategories: {
            include: {
              category: true,
            },
          },
        },
      });

      return product ?? null;
    }),

  getProductsByIds: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()).nonempty("Product IDs are required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: { id: { in: input.ids } },
        include: {
          productCategories: { include: { category: true } },
        },
      });
      return products ?? null;
    }),
});
