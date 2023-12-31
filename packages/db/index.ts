import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as addresses from "./schema/addresses";
import * as categories from "./schema/categories";
import * as logOrders from "./schema/log-orders";
import * as orders from "./schema/orders";
import * as payments from "./schema/payments";
import * as products from "./schema/products";
import * as shippings from "./schema/shippings";
import * as users from "./schema/users";

export const schema = {
  ...users,
  ...products,
  ...categories,
  ...addresses,
  ...orders,
  ...payments,
  ...logOrders,
  ...shippings,
};

export { mySqlTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

export const db = drizzle(
  new Client({
    url: process.env.DATABASE_URL,
  }).connection(),
  { schema, logger: true },
);
