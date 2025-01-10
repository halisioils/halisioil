import { Prisma } from "@prisma/client";
import { z } from "zod";
import { userSchema } from "~/lib/types";

import {
  createTRPCRouter,
  privateAdminProcedure,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure.input(userSchema).mutation(async ({ ctx, input }) => {
    try {
      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
        },
        select: {
          id: true,
          email: true,
        },
      });
      return newUser;
    } catch (error) {
      // Type guard to narrow the error type
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Check if it's a unique constraint violation (e.g., for email)
        if (error.code === "P2002") {
          throw new Error("Email already in use.");
        }
      }
      throw error;
    }
  }),

  createAdmin: publicProcedure.input(userSchema).mutation(async ({ input }) => {
    try {
      const adminUser = input.email;
      return adminUser;
    } catch (error) {
      throw error;
    }
  }),

  delete: privateAdminProcedure
    .input(
      z.object({
        id: z.string().min(1, "User ID is required"), // Validate 'name' is non-empty
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.user.delete({
        where: {
          id,
        },
      });
    }),

  getAllUsers: privateAdminProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users ?? null;
  }),

  getSingleUser: privateProcedure
    .input(
      z.object({
        userEmail: z.string().email("Invalid email format"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userEmail } = input;
      return ctx.db.user.findFirst({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
          email: true,
        },
      });
    }),
});
