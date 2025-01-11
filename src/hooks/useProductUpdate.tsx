import { useEffect, useState } from "react";
import type { UseFormSetValue, FieldValues } from "react-hook-form";

export const useProductUpdate = (
  categoryIds: string[],
  setValue: UseFormSetValue<FieldValues>,
) => {
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  useEffect(() => {
    if (categoryIds) {
      setSelectedOption(categoryIds); // Set pre-selected options
      setValue("categoryIds", categoryIds);
    }
  }, [categoryIds, setValue]); // Only run when categoryIds changes

  return {
    selectedOption,
    setSelectedOption,
  };
};
