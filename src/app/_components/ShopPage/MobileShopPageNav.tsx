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
      className={`fixed left-0 top-0 z-50 block h-[100vh] w-[100%] overflow-hidden bg-black bg-opacity-20 transition duration-[150ms] ease-in md:hidden ${
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
            className={
              active_section === "Newest First" ? activeLink : inactiveLink
            }
          >
            Newest first
          </button>
          <button
            onClick={() => updateQueryParams("Oldest First")}
            className={
              active_section === "Oldest First" ? activeLink : inactiveLink
            }
          >
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
