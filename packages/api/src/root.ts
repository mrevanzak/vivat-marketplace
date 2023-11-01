import { authRouter } from "./router/auth";
import { productRouter } from "./router/product";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
