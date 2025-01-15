"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import type { IProductPageSchema, ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "~/utils/LoadingComponent";
import ProductCard from "~/utils/ProductCard";
import TablePagination from "~/utils/TablePagination";

const ShopComponent = () => {
  const products = api.product.getAllProducts.useQuery();

  const productsLength = products && products.data?.length;

  console.log(products.data);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1", 10); // Ensure page is a number
  const per_page = 10;

  const sort_by = searchParams.get("sort_by");

  if (products.data) {
    if (sort_by === "Oldest First") {
      products.data.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sort_by === "Newest First") {
      products.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
  }

  // Calculate pagination values
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries =
    products &&
    products.data?.slice(start, end).map((entry) => ({
      id: entry.id,
      name: entry.name,
      imagePaths: entry.imagePaths as ImageContent[],
      price: entry.price as unknown as number,
      status: entry.status as string,
      properties: entry.properties,
      createdAt: entry.createdAt,
    }));

  if (products.isLoading) {
    return (
      <div className="flex min-h-[70vh] justify-center py-[2rem]">
        <LoadingComponent />
      </div>
    );
  }

  if (products.data?.length === 0) {
    return (
      <div className="flex min-h-[70vh] justify-center py-[2rem] md:h-[248px]">
        <p className="text-[1rem] text-[#898989]">No data found</p>;
      </div>
    );
  }

  return (
    <section className="relative mx-auto min-h-[600px] w-[100%]">
      {entries && <ProductCard products={entries} />}
      <section className="absolute bottom-0 left-0 w-[100%] px-[1rem] py-[2rem] md:px-[2rem] lg:px-[3rem]">
        {productsLength && (
          <TablePagination
            totalEntries={products.data as unknown as IProductPageSchema[]}
            hasNextPage={end < productsLength}
            hasPrevPage={start > 0}
          />
        )}
      </section>
    </section>
  );
};

const Shop = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ShopComponent />
    </Suspense>
  );
};

export default Shop;
