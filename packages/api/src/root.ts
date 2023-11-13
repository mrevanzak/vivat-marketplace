import { authRouter } from "./router/auth";
import { categoryRouter } from "./router/category";
import { orderRouter } from "./router/orders";
import { productRouter } from "./router/product";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  category: categoryRouter,
  user: userRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
