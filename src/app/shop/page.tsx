import React from "react";
import Shop from "../_components/ShopPage/Shop";
import MobileSortButton from "~/utils/MobileSortButton";
import { api } from "~/trpc/server";
import { type ImageContent } from "~/lib/types";

async function fetchAllProducts() {
  // Fetch products from the API
  const products = await api.product.getAllProducts();

  // Convert Decimal fields (like price) to numbers
  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(), // Convert Decimal to number
  })) as unknown as {
    id: string;
    name: string;
    imagePaths: ImageContent[];
    status: string;
    properties: string[];
    description: string;
    createdAt: Date;
    price: number;
  }[];
}

const ShopPage = async () => {
  const data = await fetchAllProducts();

  return (
    <section className="h-full min-h-[100vh] w-full">
      <MobileSortButton />
      <Shop products={data} />
    </section>
  );
};

export default ShopPage;
