import { z } from "zod";

import {
  createTRPCRouter,
  privateAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  create: privateAdminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        imagePaths: z
          .array(z.string())
          .min(1, "At least one image path is required"),
        isAvailable: z.boolean().optional().default(true),
        categoryIds: z
          .array(z.string())
          .min(1, "At least one category is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imagePaths: input.imagePaths, // Ensured it has at least one image path
          isAvailable: input.isAvailable,
          productCategories: {
            create:
              input.categoryIds?.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })) ?? [],
          },
        },
      });
    }),

  delete: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Product ID is required"), // Validate 'name' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.product.delete({
        where: {
          id,
        },
      });
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
      return ctx.db.product.findFirst({
        where: {
          id: productId,
        },
      });
    }),
});
