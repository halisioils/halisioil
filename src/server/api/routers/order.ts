import { privateAdminProcedure, privateProcedure } from "./../trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from "~/lib/types";

import { createTRPCRouter } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: privateProcedure
    .input(orderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newOrder = await ctx.db.order.create({
          data: {
            pricePaid: input.pricePaid,
            status: input.status,
            user: {
              connect: { id: input.userId }, // Connect to the existing user
            },
            products: {
              connect: input.productIds.map((id) => ({ id })), // Connect to multiple products by their IDs
            },
          },
        });

        return newOrder;
      } catch (error) {
        // Error handling for Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new Error("Unique constraint violation.");
          }
        }
        throw error; // Rethrow unexpected errors
      }
    }),

  getAllOrders: privateAdminProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    return order ?? null;
  }),

  getAllOrdersByAUser: privateProcedure
    .input(
      z.object({
        userId: z.string().min(1, "Order ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return ctx.db.order.findMany({
        where: {
          userId: userId,
        },
      });
    }),
});
