import { authRouter } from "./router/auth";
import { categoryRouter } from "./router/categories";
import { productRouter } from "./router/product";
import { createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;