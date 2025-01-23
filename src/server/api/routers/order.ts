import {
  privateAdminProcedure,
  privateProcedure,
  publicProcedure,
} from "./../trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { orderSchema } from "~/lib/types";

import { createTRPCRouter } from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(orderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create the new order
        const newOrder = await ctx.db.order.create({
          data: {
            userId: input.userId ?? "", // Handle optional userId
            stripe_Session: input.stripe_Session ?? {}, // Store the session object if provided
          },
        });

        return newOrder;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new Error("Unique constraint violation.");
          }
        }
        throw error;
      }
    }),

  // Update an order
  updateOrder: publicProcedure
    .input(
      z.object({
        id: z.string(), // Order ID to update
        status: z.string(), // New status to set
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // Fetch the existing order
      const order = await ctx.db.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      // Update the order with the new status
      const updatedOrder = await ctx.db.order.update({
        where: { id },
        data: { status },
      });

      return updatedOrder;
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
