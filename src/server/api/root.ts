import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "./routers/product";
import { contactRouter } from "./routers/contact";
import { categoryRouter } from "./routers/category";
import { orderRouter } from "./routers/order";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  contact: contactRouter,
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
