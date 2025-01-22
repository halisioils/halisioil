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
            user: {
              connect: { id: input.userId },
            },
            lineItems: {
              create: input.cartItems.map((item) => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
            },
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
        id: z.string(), // ID of the order to update
        status: z.string().optional(), // Optional status update
        amount_paid: z.number().optional(),
        paid: z.boolean(),

        shippingDetails: z
          .object({
            name: z.string().optional(),
            email: z.string().optional(),
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(), // Optional shipping details update
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status, amount_paid, shippingDetails } = input;

      // Fetch the existing order
      const order = await ctx.db.order.findUnique({
        where: { id },
        include: { lineItems: true },
      });

      if (!order) {
        throw new Error(`Order with ID ${id} not found`);
      }

      // Update the order fields
      const updatedOrder = await ctx.db.order.update({
        where: { id },
        data: {
          status,
          paid: true,
          amount_paid,
          shipping_name: shippingDetails?.name ?? order.shipping_name,
          shipping_email: shippingDetails?.email ?? order.shipping_email,
          shipping_street: shippingDetails?.street ?? order.shipping_street,
          shipping_city: shippingDetails?.city ?? order.shipping_city,
          shipping_state: shippingDetails?.state ?? order.shipping_state,
          shipping_zipCode: shippingDetails?.zipCode ?? order.shipping_zipCode,
          shipping_country: shippingDetails?.country ?? order.shipping_country,
        },
      });

      return updatedOrder;
    }),

  getAllOrders: privateAdminProcedure.query(async ({ ctx }) => {
    const order = await ctx.db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lineItems: true,
      },
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
