"use client";
import { Fragment, useEffect } from "react";
import { InView } from "react-intersection-observer";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import Link from "next/link";

import { api } from "~/trpc/react";
import { QUERY_LIMIT } from "~/lib/constants";
import { ProductCard } from "~/components/product/card";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function ProductList() {
  const [page, setPage] = useQueryState<number>(
    "page",
    parseAsInteger.withDefault(1),
  );

  const [sortKey, setSortKey] = useQueryState<"handle" | "title" | "price">(
    "sortKey",
    parseAsStringEnum(["handle", "title", "price"]).withDefault("handle"),
  );

  const productQuery = api.collection.getProducts.useInfiniteQuery(
    {
      sortKey,
      limit: QUERY_LIMIT,
      page,
    },
    {
      queryKeyHashFn: () => [sortKey, QUERY_LIMIT].join(":"),
      getPreviousPageParam: (firstPage) => firstPage.previousCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  async function onPreviousPage() {
    console.log("Fetching previous page");
    await productQuery.fetchPreviousPage();
    console.log("Fetched previous page");
  }

  async function onNextPage() {
    console.log("Fetching next page");
    await productQuery.fetchNextPage();
    console.log("Fetched next page");
  }

  useEffect(() => {
    console.table({
      pages: productQuery.data?.pages.map((page) => page.page).join(","),
      page,
      "productQuery.data?.pages.length": productQuery.data?.pages.length,
      "productQuery.data?.pageParams.length":
        productQuery.data?.pageParams.length,
      totalProducts: productQuery.data?.pages.reduce(
        (acc, page) => acc + page.products.length,
        0,
      ),
      "productQuery.isLoading": productQuery.isLoading,
      "productQuery.isError": productQuery.isError,
      "productQuery.isSuccess": productQuery.isSuccess,
      "productQuery.isFetching": productQuery.isFetching,
      "productQuery.isFetchingNextPage": productQuery.isFetchingNextPage,
      "productQuery.isFetchNextPageError": productQuery.isFetchNextPageError,
      "productQuery.hasNextPage": productQuery.hasNextPage,
    });
  }, [
    page,
    productQuery.data?.pages,
    productQuery.data?.pageParams.length,
    productQuery.isLoading,
    productQuery.isError,
    productQuery.isSuccess,
    productQuery.isFetching,
    productQuery.isFetchingNextPage,
    productQuery.isFetchNextPageError,
    productQuery.hasNextPage,
  ]);

  return (
    <>
      <div className="mb-5 flex w-full max-w-screen-lg flex-col items-center justify-center p-3">
        <Select
          value={sortKey}
          onValueChange={async (v: "handle" | "title" | "price") => {
            await setSortKey(v);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="handle">Sort by handle</SelectItem>
            <SelectItem value="title">Sort by title</SelectItem>
            <SelectItem value="price">Sort by price</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {productQuery.isFetchingPreviousPage ? (
        <div className="w-full py-5 text-center text-lg font-light">
          Loading...
        </div>
      ) : (
        productQuery.hasPreviousPage && (
          <Button onClick={onPreviousPage}>Load previous</Button>
        )
      )}
      <div className="flex w-full max-w-screen-lg flex-col p-3">
        {productQuery.data?.pages.map((page) => (
          <InView
            key={page.page}
            className="grid grid-cols-4 gap-3"
            onChange={async (inView) => {
              console.log(
                "Page",
                page.page,
                inView ? "in view" : "out of view",
              );
              if (inView) {
                await setPage(page.page ?? 0);
              }
            }}
          >
            <h3 className="col-span-full pb-4 pt-5 text-center text-xl font-semibold">
              Page {page.page}
            </h3>
            {page.products.map((product) => (
              <Link key={product.handle} href={`/product/${product.handle}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </InView>
        ))}
      </div>
      {productQuery.isLoading ? (
        <div className="w-full py-5 text-center text-lg font-light">
          Loading...
        </div>
      ) : productQuery.isError ? (
        <div className="w-full py-5 text-center text-lg font-light">
          Error loading products
        </div>
      ) : (
        <InView
          className="flex w-full max-w-screen-lg flex-col items-center justify-center p-3"
          rootMargin="0px 0px 100% 0px"
          onChange={async (inView) => {
            if (inView) {
              console.log("Load more in view");
              await onNextPage();
            }
          }}
        >
          {productQuery.isFetchingNextPage ? (
            <div className="w-full py-5 text-center text-lg font-light">
              Loading...
            </div>
          ) : (
            productQuery.hasNextPage && (
              <Button onClick={onNextPage}>Load more</Button>
            )
          )}
        </InView>
      )}
    </>
  );
}
