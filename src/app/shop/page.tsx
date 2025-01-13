import React from "react";
import Banner from "~/utils/Banner";
import ProductCard from "~/utils/ProductCard";
import ProductSort from "~/utils/ProductSort";

const ShopPage = async () => {
  return (
    <section className="h-full min-h-[100vh] w-full">
      <Banner prev="Home" next="Shop" head="Shop" />
      <section>
        <ProductSort />
      </section>
      <section className="mx-auto max-w-[1440px] px-[1rem] py-[2rem] md:px-[2rem] lg:px-[3rem]">
        <ProductCard />
      </section>
    </section>
  );
};

export default ShopPage;
