import { z } from "zod";
import { productSchema } from "~/lib/types";
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
      const formattedImagePaths = input.imagePaths.map((image) =>
        typeof image === "object" ? image.url : image,
      );

      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imagePaths: formattedImagePaths, // Ensured it has at least one image path
          isAvailable: input.isAvailable,
          productCategories: {
            create: input.categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        },
      });
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
      const [_, deleteProductResponse] = await Promise.all([
        // Delete the file using the external API
        utapi.deleteFiles(key),

        // Delete the product from the database
        ctx.db.product.delete({
          where: {
            id,
          },
        }),
      ]);

      return deleteProductResponse;
    }),

  deleteMany: privateAdminProcedure
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
      const [_, deleteProductResponse] = await Promise.all([
        // Delete the file using the external API
        utapi.deleteFiles(key),

        // Delete the product from the database
        ctx.db.product.deleteMany({
          where: {
            id,
          },
        }),
      ]);

      return deleteProductResponse;
    }),

  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return products ?? null;
  }),

  getSingleProduct: publicProcedure
    .input(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { productId } = input;
      const product = ctx.db.product.findFirst({
        where: {
          id: productId,
        },
      });
      return product ?? null;
    }),
});
