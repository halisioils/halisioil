import React, { type FC, useState } from "react";
import { useCartContext } from "~/context/CartContext";

type NumberInputProps = {
  id: string;
};

const NumberInput: FC<NumberInputProps> = ({ id }) => {
  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useCartContext();

  const [value, setValue] = useState<number>(1); // Initialize state with a minimum value of 1

  // Get the quantity of the item from the cart context
  const quantityInCart = getItemQuantity(id);

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

      <span className="flex h-[47px] w-fit items-center justify-center rounded-[8px] border-[2px] border-orange-500 px-[1rem] text-center text-[#7E7E7E]">{`${quantityInCart} in cart`}</span>
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
