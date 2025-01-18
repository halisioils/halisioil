"use client";

import { useEffect, useRef } from "react";
import { useHeaderContext } from "~/context/HeaderContext";

export const useMobileNav = () => {
  const { mobileNav, setMobileNav } = useHeaderContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  return {
    mobileNav,
    setMobileNav,
    dropdownRef,
  };
};
