"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import LoadingComponent from "~/utils/LoadingComponent";

const MobileShopPageNavComponent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", value);
    params.delete("nav_sort");
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const active_section = searchParams.get("sort_by");

  const isMobile = searchParams.get("nav_sort");

  const inactiveLink =
    "flex gap-1 p-1 hover:bg-gray-200 transition-all ease-in-out duration-300";
  const activeLink =
    inactiveLink +
    " bg-highlight text-black rounded-sm hover:bg-gray-200 transition-all ease-in-out duration-300";

  const closeMobileNav = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("nav_sort");
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <aside
      onClick={closeMobileNav}
      className={`fixed left-0 top-0 z-50 block h-[100vh] w-[100%] overflow-hidden bg-black bg-opacity-20 transition duration-[150ms] ease-in lg:hidden ${
        isMobile ? "translate-y-0" : "translate-y-[100%]"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="no-scrollbar absolute bottom-0 left-0 h-[200px] w-[100%] items-center justify-center overflow-x-hidden overflow-y-scroll rounded-t-[1.5rem] bg-white p-[1rem] opacity-100"
      >
        <nav className="flex flex-col gap-2">
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
        </nav>
      </div>
    </aside>
  );
};

const MobileShopPageNav = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <MobileShopPageNavComponent />
    </Suspense>
  );
};

export default MobileShopPageNav;
