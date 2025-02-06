"use client";
import { useState, useMemo } from "react";

interface ProductCategory {
  categoryId: string;
  price: number;
  category: { name: string };
}

export const useProductCategory = () => {
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, ProductCategory>
  >({});

  const handleCategorySelect = (
    productId: string,
    category: ProductCategory,
  ) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [productId]: category,
    }));
  };

  // Memoized function to get selected category
  const getSelectedCategory = useMemo(() => {
    return (productId: string, productCategories: ProductCategory[]) =>
      selectedCategories[productId] ?? productCategories?.[0] ?? null;
  }, [selectedCategories]);

  return { getSelectedCategory, handleCategorySelect };
};
