import React, { type FC, useState, useEffect } from "react";
import { useCartContext } from "~/context/CartContext";

type NumberInputProps = {
  id: string;
  categoryId: string; // ✅ Use categoryId instead of category name
  categoryName: string;
};

const NumberInput: FC<NumberInputProps> = ({
  id,
  categoryId,
  categoryName,
}) => {
  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useCartContext();

  // Initialize state with the current quantity in the cart
  const [value, setValue] = useState<number>(0);

  // Sync value with the quantity in the cart when mounted
  useEffect(() => {
    setValue(getItemQuantity(id, categoryId));
  }, [id, categoryId, getItemQuantity]); // ✅ Ensure dependencies only include `id` and `categoryId`

  // Increment quantity
  const handleIncrement = () => {
    setValue((prev) => prev + 1);
    increaseCartQuantity(id, categoryId, categoryName); // ✅ Use categoryId instead of category name
  };

  // Decrement quantity
  const handleDecrement = () => {
    if (value > 1) {
      setValue((prev) => prev - 1);
      decreaseCartQuantity(id, categoryId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        className="rounded border bg-gray-300 px-2 py-1"
      >
        -
      </button>

      <span className="flex h-[47px] w-[120px] items-center justify-center rounded-[8px] border-[2px] border-[#B88E2F] px-[1rem] text-center text-[#7E7E7E]">
        {`${value} in cart`}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        className="rounded border bg-gray-300 px-2 py-1"
      >
        +
      </button>
    </div>
  );
};

export default NumberInput;
