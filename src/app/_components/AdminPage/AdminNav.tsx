"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import DashboardHeader from "./DashboardHeader";
import LoadingComponent from "~/utils/LoadingComponent";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const AdminNavComponent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    const newUrl = `${pathname}?section=${params.get("section")}`;
    router.replace(newUrl);
  };

  const active_section = searchParams.get("section") ?? "dashboard";

  const inactiveLink =
    "flex gap-1 p-1 hover:bg-gray-200 transition-all ease-in-out duration-300";
  const activeLink =
    inactiveLink +
    " bg-highlight text-black rounded-sm hover:bg-gray-200 transition-all ease-in-out duration-300";
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-primary";

  return (
    <aside
      className={
        "fixed left-0 top-0 hidden h-full w-full bg-bgGray px-[1rem] text-gray-500 transition-all md:static md:block md:w-auto"
      }
    >
      <div className="mb-4 mr-4">
        <DashboardHeader />
      </div>
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => updateQueryParams("section", "dashboard")}
          className={active_section === "dashboard" ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              active_section === "dashboard" ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Dashboard
        </button>
        <button
          onClick={() => updateQueryParams("section", "products")}
          className={active_section === "products" ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              active_section === "products" ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          Products
        </button>
        <button
          onClick={() => updateQueryParams("section", "categories")}
          className={
            active_section === "categories" ? activeLink : inactiveLink
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={
              active_section === "categories" ? activeIcon : inactiveIcon
            }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          Categories
        </button>
        <button
          onClick={() => updateQueryParams("section", "orders")}
          className={active_section === "orders" ? activeLink : inactiveLink}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={active_section === "orders" ? activeIcon : inactiveIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
            />
          </svg>
          Orders
        </button>

        <LogoutLink className={inactiveLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </LogoutLink>
      </nav>
    </aside>
  );
};

const AdminNav = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <AdminNavComponent />
    </Suspense>
  );
};

export default AdminNav;
