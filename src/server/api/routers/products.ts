import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.product.create({
  //       data: {
  //         name: input.name,
  //         description
  //       },
  //     });
  //   }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.product.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),
});
