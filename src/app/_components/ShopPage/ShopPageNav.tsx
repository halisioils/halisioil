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
            className={`flex items-center justify-start gap-[0.5rem] ${active_section === "Newest First" ? activeLink : inactiveLink} `}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                />
              </svg>
            </span>
            Newest first
          </button>
        </li>
        <li>
          <button
            onClick={() => updateQueryParams("Oldest First")}
            className={`flex items-center justify-start gap-[0.5rem] ${active_section === "Oldest First" ? activeLink : inactiveLink} `}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                />
              </svg>
            </span>
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
