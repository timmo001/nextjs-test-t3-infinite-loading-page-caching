"use client";
import { Fragment, useEffect } from "react";
import { InView } from "react-intersection-observer";
import Link from "next/link";

import { api } from "~/trpc/react";
import { ProductCard } from "~/components/product/card";
import { Button } from "~/components/ui/button";

export default function ProductList() {
  const productQuery = api.collection.getProducts.useInfiniteQuery(
    {
      limit: 40,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  async function onNextPage() {
    console.log("Fetching next page");
    await productQuery.fetchNextPage();
    console.log("Fetched next page");
  }

  useEffect(() => {
    console.table({
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
      <div className="grid w-full max-w-screen-lg grid-cols-4 gap-3 p-3">
        {productQuery.data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            <InView
              className="col-span-full h-0"
              onChange={(inView) => {
                if (inView) {
                  console.log("Page", pageIndex + 1, "is in view");
                }
              }}
            />
            {page.products.map((product) => (
              <Link key={product.handle} href={`/product/${product.handle}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </Fragment>
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
