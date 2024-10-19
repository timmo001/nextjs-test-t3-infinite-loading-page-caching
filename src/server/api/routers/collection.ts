import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { type Product } from "~/lib/schema/product";

const items: Array<Product> = Array.from({ length: 400 }).map((_, i) => {
  const idPadded = (i + 1).toString().padStart(3, "0");
  return {
    handle: `item-${idPadded}`,
    name: `Item ${idPadded}`,
    price: Math.floor(Math.random() * 1000),
  };
});

export const collectionRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        cursor: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      console.log("getProducts:", input);

      const start = input.cursor
        ? items.findIndex((item) => item.handle === input.cursor) + 1
        : 0;
      const result = items.slice(start, start + input.limit);

      return {
        products: result,
        nextCursor:
          start + input.limit >= items.length
            ? null
            : (result[result.length - 1]?.handle ?? null),
      };
    }),

  getProduct: publicProcedure
    .input(
      z.object({
        handle: z.string(),
      }),
    )
    .query(({ input }) => {
      console.log("getProduct:", input);
      return items.find((item) => item.handle === input.handle);
    }),
});
