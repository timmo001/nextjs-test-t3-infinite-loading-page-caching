import ProductList from "~/app/collection/_components/product-list";

export default async function CollectionPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-48 pt-3">
      <h1 className="py-5 text-4xl font-bold">Collection</h1>
      <ProductList />
    </main>
  );
}
