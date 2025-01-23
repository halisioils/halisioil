import React, { type FC, useState, useEffect } from "react";
import { useCartContext } from "~/context/CartContext";

type NumberInputProps = {
  id: string;
};

const NumberInput: FC<NumberInputProps> = ({ id }) => {
  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useCartContext();

  // Initialize state with the current quantity in the cart
  const [value, setValue] = useState<number>(getItemQuantity(id));

  // Sync value with the quantity in the cart on mount and when the id changes
  useEffect(() => {
    setValue(getItemQuantity(id));
  }, [id, getItemQuantity]);

  // Increment the value by 1
  const handleIncrement = () => {
    const newValue = value + 1;
    setValue(newValue);
    increaseCartQuantity(id); // Assuming this function increases the cart quantity
  };

  // Decrement the value by 1
  const handleDecrement = () => {
    if (value > 1) {
      const newValue = value - 1;
      setValue(newValue);
      decreaseCartQuantity(id); // Assuming this function decreases the cart quantity
    }
    // Prevent going below 1, no item removal if it's already at 1
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

      <span className="flex h-[47px] w-[120px] items-center justify-center rounded-[8px] border-[2px] border-[#B88E2F] px-[1rem] text-center text-[#7E7E7E]">{`${value} in cart`}</span>
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
