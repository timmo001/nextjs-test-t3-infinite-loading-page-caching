"use client";
import { Card } from "~/components/ui/card";
import { type Product } from "~/lib/schema/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex w-full flex-col items-center justify-center gap-1 p-4">
      <h2>{product.name}</h2>
      <p>£{product.price}</p>
    </Card>
  );
}
