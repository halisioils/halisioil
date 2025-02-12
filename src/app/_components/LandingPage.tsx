import React from "react";
import Hero from "./LandingPage/Hero";
import Overview from "./LandingPage/Overview";
import ProductCarousel from "./LandingPage/ProductCarousel";
import { api } from "~/trpc/server";
import { type ImageContent } from "~/lib/types";

async function fetchLandingPageProducts() {
  // Fetch products from the API
  const products = await api.product.getLandingPageProducts();

  // Convert Decimal fields (like price) to numbers
  return products.map((product) => ({
    ...product,
    productCategories: product.productCategories.map((category) => ({
      ...category,
      price: Number(category.price), // Convert Decimal to Number
    })),
  })) as unknown as {
    id: string;
    name: string;
    imagePaths: ImageContent[];
    productCategories: {
      categoryId: string;
      price: number;
      category: { name: string };
    }[];
    status: string;
    properties: string[];
    description: string;
  }[];
}

const LandingPage = async () => {
  const data = await fetchLandingPageProducts();

  return (
    <section className="min-h-[100vh] bg-white">
      <Hero />
      <Overview />
      <section className="mx-auto h-[100%] w-[100%] max-w-[1236px] overflow-hidden px-[1rem] md:px-[2rem]">
        <ProductCarousel products={data} />
      </section>
    </section>
  );
};

export default LandingPage;
