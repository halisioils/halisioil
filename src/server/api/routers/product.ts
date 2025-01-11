import { z } from "zod";
import { productSchema, updateProductSchema } from "~/lib/types";
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
          price: input.price,
          imagePaths: input.imagePaths, // Ensured it has at least one image path
          status: input.status,
          properties: input.properties,
          productCategories: {
            create: input.categoryIds.map((categoryId) => ({
              category: { connect: { id: categoryId } },
            })),
          },
        },
      });
    }),

  update: privateAdminProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      try {
        const product = await ctx.db.product.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            price: input.price,
            status: input.status,
            properties: input.properties,
            productCategories: {
              upsert: input.categoryIds.map((categoryId) => ({
                where: {
                  productId_categoryId: {
                    productId: input.id,
                    categoryId: categoryId,
                  },
                },
                update: {},
                create: {
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
        ctx.db.product.deleteMany({
          where: {
            id,
          },
        }),

        // Delete the file using the external API
        utapi.deleteFiles(key),
      ]);

      return deleteProductResponse;
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
});
