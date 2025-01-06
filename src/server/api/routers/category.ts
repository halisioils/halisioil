import { categorySchema } from "./../../../lib/types";
import { z } from "zod";

import {
  createTRPCRouter,
  privateAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: privateAdminProcedure
    .input(categorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create the category
        const newCategory = await ctx.db.category.create({
          data: {
            name: input.name,
            productCategories: {
              create:
                input.productIds?.map((productId) => ({
                  product: {
                    connect: { id: productId }, // Associate the product with the category
                  },
                })) ?? [], // If no productIds are provided, associate no products
            },
          },
          select: {
            id: true,
            name: true,
          },
        });

        return newCategory;
      } catch (error) {
        throw error;
      }
    }),

  delete: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Category ID is required"), // Validate 'name' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.category.delete({
        where: {
          id,
        },
      });
    }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { name: "desc" },
    });

    return categories ?? null;
  }),
});
