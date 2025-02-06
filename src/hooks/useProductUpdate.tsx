import { useEffect, useState } from "react";
import type { UseFormSetValue, FieldValues } from "react-hook-form";

interface Category {
  categoryId: string;
  price: number;
}

export const useProductUpdate = (
  productCategories: Category[],
  setValue: UseFormSetValue<FieldValues>,
) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (productCategories.length > 0) {
      setSelectedCategories(productCategories);
      setValue("categories", productCategories); // Store the entire category object, including price
    }
  }, [productCategories, setValue]);

  const handlePriceChange = (categoryId: string, newPrice: number) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.map((category) =>
        category.categoryId === categoryId
          ? { ...category, price: newPrice }
          : category,
      );

      setValue("categories", updatedCategories); // Update form state
      return updatedCategories;
    });
  };

  return {
    selectedCategories,
    setSelectedCategories,
    handlePriceChange,
  };
};
