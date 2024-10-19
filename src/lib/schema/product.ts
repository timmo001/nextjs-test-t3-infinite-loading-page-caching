import { z } from "zod";

export const ProductSchema = z.object({
  handle: z.string(),
  name: z.string(),
  price: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
