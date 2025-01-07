import { z } from "zod";
import { productSchema } from "~/lib/types";

import {
  createTRPCRouter,
  privateAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
