import React from "react";
import ShopDetailLoading from "~/app/_components/Loading/ShopDetailLoading";

const ShopDetailPageLoading = () => {
  return (
    <section className="mx-auto h-[100%] min-h-screen w-[100%] max-w-[1400px] gap-[1rem] bg-bgGray px-[1rem] pb-[2rem] pt-[1rem] md:px-[2rem]">
      <ShopDetailLoading />
    </section>
  );
};

export default ShopDetailPageLoading;
