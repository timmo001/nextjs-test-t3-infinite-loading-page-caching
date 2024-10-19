import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

import { QUERY_LIMIT } from "~/lib/constants";
import { type Product } from "~/lib/schema/product";

const items: Array<Product> = Array.from({ length: QUERY_LIMIT * 12 }).map(
  (_, i) => {
    const idPadded = (i + 1).toString().padStart(3, "0");
    return {
      handle: `item-${idPadded}`,
      name: `Item ${idPadded}`,
      price: Math.floor(Math.random() * 1000),
    };
  },
);

export const collectionRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(
      z.object({
        sortKey: z.string().default("handle"),
        limit: z.number().default(100),
        cursor: z.string().nullish(),
        page: z.number().nullish(),
      }),
    )
    .query(({ input }) => {
      console.log("getProducts:", input);

      let cursor: string | null = input.cursor ?? null;

      // If we have a page number, but no cursor, we need to calculate the cursor
      if (!cursor && input.page && input.page > 0) {
        cursor = items[(input.page - 1) * input.limit]?.handle ?? null;
      }

      const start = cursor
        ? items.findIndex((item) => item.handle === cursor) + 1
        : 0;
      const result = items.slice(start, start + input.limit);

      return {
        products: result,
        page: typeof cursor === "number" ? cursor / input.limit + 1 : 1,
        previousCursor:
          !input.page || input.page < 1
            ? null
            : start === 0
              ? null
              : (result[0]?.handle ?? null),
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
