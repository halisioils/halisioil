"use client";
import React, { Suspense } from "react";
import LoadingComponent from "./LoadingComponent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MobileSortButtonComponent = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className="my-[1rem] flex items-center lg:hidden">
      <button
        onClick={() => updateQueryParams("nav_sort", "true")}
        className="w-[167.5px] rounded-[6.25rem] border-[1px] border-[#D0D5DD] bg-[#1c1c1c0d] px-[1rem] py-[0.5rem] text-[1c1c1c] shadow-sm hover:brightness-75"
      >
        Sort by
      </button>
    </div>
  );
};

const MobileSortButton = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <MobileSortButtonComponent />
    </Suspense>
  );
};

export default MobileSortButton;
