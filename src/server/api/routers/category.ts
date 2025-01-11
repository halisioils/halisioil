import { categorySchema, categoryUpdateSchema } from "./../../../lib/types";
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
        const newCategory = await ctx.db.category.create({
          data: {
            name: input.name, // Create category with name only
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

  update: privateAdminProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.db.category.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
          },
          select: {
            id: true,
            name: true,
          },
        });
        return category;
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

  deleteMany: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "Category ID is required"), // Validate 'name' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.category.deleteMany({
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

  getSingleCategory: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "Category id is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.category.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
        },
      });
    }),
});
