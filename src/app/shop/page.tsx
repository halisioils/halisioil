import React from "react";
import Banner from "~/utils/Banner";
import ProductSort from "~/utils/ProductSort";
import Shop from "../_components/ShopPage/Shop";

const ShopPage = async () => {
  return (
    <section className="h-full min-h-[100vh] w-full">
      <Banner prev="Home" next="Shop" head="Shop" />
      <section>
        <ProductSort />
      </section>
      <Shop />
    </section>
  );
};

export default ShopPage;
