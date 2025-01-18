"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import logo_image from "~/assets/halisioils_logo.png";
import { useCartContext } from "~/context/CartContext";
import { useHeaderContext } from "~/context/HeaderContext";
import { useWishListContext } from "~/context/WishListContext";
import { useProfileToggle } from "~/hooks/useDropdown";
import { poppins } from "~/utils/font";
import MobileNav from "~/utils/MobileNav";
import { navLinks } from "~/utils/NavLinks";
import ProfileNav from "~/utils/ProfileNav";
import { AccountIcon, userLinks } from "~/utils/UserListIconts";

const Header = () => {
  const { mobileNav, setMobileNav } = useHeaderContext();
  const { cartQuantity } = useCartContext();

  const { WishListQuantity } = useWishListContext();

  const { dropdown, dropdownRef, openProfile } = useProfileToggle();

  const pathname = usePathname();

  const openDropdown = () => {
    setMobileNav(true);
  };

  return (
    <section
      className={`relative flex h-[60px] w-full items-center justify-between gap-8 py-[0.5rem] md:h-[80px] ${poppins.className} mx-auto max-w-[1440px] px-[1rem] md:px-[2rem] lg:px-[3rem]`}
    >
      <Link href={`/`} className="relative h-[50px] w-[30px] cursor-pointer">
        <Image
          quality={100}
          fill
          sizes="(min-width: 768px) 100vw, 700px"
          src={logo_image}
          priority
          alt="background image"
          style={{
            objectFit: "contain",
          }}
        />
      </Link>
      <nav className="hidden lg:block">
        <ul className="flex items-center justify-between text-[1rem]">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                className={`rounded-[60px] px-[2rem] text-[1rem] text-white transition-all duration-300 ease-in-out hover:text-[#a9acbb] ${
                  pathname === href && href === "/"
                    ? "border-x-[1px] border-[#B88E2F] font-bold text-[#B88E2F]"
                    : pathname.startsWith(href) && href !== "/"
                      ? "border-x-[1px] border-[#B88E2F] font-bold text-[#B88E2F]"
                      : ""
                }`}
                href={href}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="hidden items-center justify-center gap-[2rem] text-white lg:flex">
        <div ref={dropdownRef} className="relative h-[100%] w-[100%]">
          <button onClick={openProfile}>
            <AccountIcon />
          </button>
          {dropdown && <ProfileNav />}
        </div>
        <ul className="flex items-center justify-center gap-[2rem]">
          {userLinks.map((link, index) => (
            <li key={index} className="relative">
              <Link href={link.href}>
                {link.svg}
                {link.href === "/cart" && (
                  <span className="absolute right-[-8px] top-[-8px] flex h-4 w-4 items-center justify-center rounded-full bg-[#B88E2F] text-xs text-white">
                    {cartQuantity > 0 ? cartQuantity : 0}
                  </span>
                )}
                {link.href === "/wishlist" && (
                  <span className="absolute right-[-8px] top-[-8px] flex h-4 w-4 items-center justify-center rounded-full bg-[#B88E2F] text-xs text-white">
                    {WishListQuantity > 0 ? WishListQuantity : 0}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="block lg:hidden">
        <span
          onClick={openDropdown}
          className={`cursor-pointer ${mobileNav ? "hidden" : "block"} `}
        >
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 12.5H19M7 7H19M11.5 1H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <MobileNav />
      </div>
    </section>
  );
};

export default Header;
