"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useHeaderContext } from "~/context/HeaderContext";
import LoadingComponent from "./LoadingComponent";
import { userLinks } from "./UserListIconts";
import { navLinks } from "./NavLinks";

const MobileNav = () => {
  const { user, isLoading } = useKindeBrowserClient();
  const { mobileNav, setMobileNav } = useHeaderContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  let photoURL: string | undefined;
  let displayName: string | undefined;

  if (user) {
    displayName = `${user.given_name}`;
    if (user.picture) {
      photoURL = user.picture;
    }
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
                <div className="relative flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-md bg-[#B88E2F] dark:bg-gray-600">
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
        </section>
      </section>
    </section>
  );
};

export default MobileNav;
