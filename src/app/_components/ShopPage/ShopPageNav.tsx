"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { raleway } from "~/utils/font";
import LoadingComponent from "~/utils/LoadingComponent";

const ShopPageNavComponent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const active_section = searchParams.get("sort_by");

  const inactiveLink =
    "flex gap-1 p-1 hover:bg-gray-200 w-[100%] transition-all ease-in-out duration-300";
  const activeLink =
    inactiveLink +
    " bg-highlight text-black rounded-sm w-[100%] hover:bg-gray-200 transition-all ease-in-out duration-300";

  return (
    <aside
      className={
        "hidden h-[200px] rounded-[15px] border-[1px] border-gray-300 px-[1rem] py-[1rem] shadow-md md:block"
      }
    >
      <div className="my-4 border-b-[1px] border-b-gray-300 pb-[0.5rem]">
        <h2
          className={`text-[1.125rem] ${raleway.className} font-bold text-[#333333]`}
        >
          Sort By
        </h2>
      </div>
      <ul className="flex w-[200px] flex-col gap-[0.5rem] text-gray-700">
        <li>
          <button
            onClick={() => updateQueryParams("Newest First")}
            className={
              active_section === "Newest First" ? activeLink : inactiveLink
            }
          >
            Newest first
          </button>
        </li>
        <li>
          <button
            onClick={() => updateQueryParams("Oldest First")}
            className={
              active_section === "Oldest First" ? activeLink : inactiveLink
            }
          >
            Oldest first
          </button>
        </li>
      </ul>
    </aside>
  );
};

const ShopPageNav = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ShopPageNavComponent />
    </Suspense>
  );
};

export default ShopPageNav;
