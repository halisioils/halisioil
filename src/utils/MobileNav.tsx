"use client";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "~/context/HeaderContext";
import LoadingComponent from "./LoadingComponent";
import { userLinks } from "./UserListIconts";
import { navLinks } from "./NavLinks";

const MobileNav = () => {
  const { user, isLoading } = useKindeBrowserClient();
  const { mobileNav, setMobileNav } = useHeaderContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  let displayName: string | undefined;

  if (user) {
    displayName = `${user.given_name}`;
  }

  const closeDropdown = () => {
    setMobileNav(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMobileNav]);

  return (
    <section
      ref={dropdownRef}
      className={`no-scrollbar fixed inset-0 left-0 top-0 z-50 h-[100%] min-h-[100vh] w-[100%] overflow-x-hidden overflow-y-scroll bg-gradient-to-l from-[#517573] to-[#286F6C] py-[4rem] transition duration-[300ms] ease-in md:w-[300px] ${
        mobileNav ? "translate-x-0" : "-translate-x-[100%]"
      } `}
    >
      <div className="absolute right-[1rem] top-[1rem] z-10 text-white">
        <button type="button" onClick={closeDropdown}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7L17 17M7 17L17 7"
              stroke="white"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <section className="items-left flex flex-col gap-[2rem]">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            {user && (
              <Link
                href={"/"}
                onClick={closeDropdown}
                className="flex items-center gap-[1rem] px-[1.5rem] pb-[1rem]"
              >
                <div className="relative flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-md bg-black dark:bg-gray-600">
                  <p className="font-bold text-white">
                    {displayName?.charAt(0).toLocaleUpperCase()}
                  </p>
                </div>
                <p className="flex items-center justify-between gap-[0.3rem] text-[16px] font-[600] text-white">
                  {displayName}
                </p>
              </Link>
            )}
          </>
        )}
        <nav>
          <ul className="items-left flex flex-col justify-between gap-[2rem] px-[1.5rem] text-[1rem]">
            {navLinks.map(({ label, href, svg }) => (
              <li key={label}>
                <Link
                  onClick={closeDropdown}
                  className={`flex items-center gap-[1.5rem] text-[1rem] text-white transition-all duration-300 ease-in-out hover:text-[#a9acbb] ${
                    pathname === href && href === "/"
                      ? "font-bold text-[#B88E2F]"
                      : pathname.startsWith(href) && href !== "/"
                        ? "font-bold text-[#B88E2F]"
                        : ""
                  }`}
                  href={href}
                >
                  <span>{svg}</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <section className="mx-[1.5rem] border-t-[1px] border-t-[#a9acbb] text-white">
          <ul className="items-left mt-[2rem] flex flex-col justify-center gap-[2rem]">
            {userLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="flex items-center gap-[1.5rem]"
                >
                  {link.svg} <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-[2rem]">
            {user ? (
              <LogoutLink
                onClick={closeDropdown}
                className={`flex items-center gap-[1.5rem]`}
              >
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
            ) : (
              <div className="grid grid-cols-1 gap-[2rem]">
                <LoginLink
                  className={`flex items-center gap-[1.5rem]`}
                  onClick={closeDropdown}
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={`flex items-center gap-[1.5rem]`}
                  onClick={closeDropdown}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                    />
                  </svg>
                  Sign up
                </RegisterLink>
              </div>
            )}
          </div>
        </section>
      </section>
    </section>
  );
};

export default MobileNav;
