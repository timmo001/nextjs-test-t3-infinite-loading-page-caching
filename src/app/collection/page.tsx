import { Filters } from "~/app/collection/_components/filters";
import { ProductList } from "~/app/collection/_components/product-list";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default async function CollectionPage() {
  return (
    <SidebarProvider className="flex flex-row items-center justify-center pb-48 pt-3">
      <Filters />
      <section className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-row items-center justify-between px-3">
          <SidebarTrigger />
          <h1 className="w-full text-center text-4xl font-bold">Collection</h1>
        </div>
        <ProductList />
      </section>
    </SidebarProvider>
  );
}
