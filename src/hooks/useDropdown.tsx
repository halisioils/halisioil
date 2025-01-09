"use client";
import { useEffect, useRef, useState } from "react";

export const useDropdown = () => {
  const [dropdownId, setDropdownId] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click occurred outside of the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownId("");
      }
    };

    // Add event listener to handle clicks outside of the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup: remove event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    dropdownId,
    setDropdownId,
    dropdownRef,
  };
};

export const useCategoryDropdown = () => {
  const [dropdownId, setDropdownId] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click occurred outside of the dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownId("");
      }
    };

    // Add event listener to handle clicks outside of the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup: remove event listener when the component is unmounted
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    dropdownId,
    setDropdownId,
    dropdownRef,
  };
};
