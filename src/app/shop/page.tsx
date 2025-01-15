import React from "react";
import Shop from "../_components/ShopPage/Shop";
import MobileSortButton from "~/utils/MobileSortButton";

const ShopPage = async () => {
  return (
    <section className="h-full min-h-[100vh] w-full">
      <MobileSortButton />
      <Shop />
    </section>
  );
};

export default ShopPage;
