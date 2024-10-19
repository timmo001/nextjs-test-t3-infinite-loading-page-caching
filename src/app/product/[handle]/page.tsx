import { notFound } from "next/navigation";

import { api } from "~/trpc/server";
import { ProductCard } from "~/components/product/card";

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await api.collection.getProduct(params);

  if (!product) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-screen-lg px-3 py-5">
        <ProductCard product={product} />
      </div>
    </main>
  );
}
