"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const ProductSort = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <section className="bg-[#F9F1E7]">
      <section className="mx-auto flex max-w-[1440px] items-center justify-end gap-[1rem] px-[1rem] py-[1rem] md:px-[2rem] lg:px-[3rem]">
        <p className="font-regular mb-2 text-[1rem] text-[#000000]">Sort By</p>
        <select
          // value={selectedOption}
          onChange={handleChange}
          className="w-full max-w-[200px] cursor-pointer rounded-lg border-[1px] border-gray-300 bg-white px-4 py-2 text-[#3A3A3A] focus:outline-none"
        >
          <option value="" disabled>
            Select an option
          </option>

          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </section>
    </section>
  );
};

export default ProductSort;
