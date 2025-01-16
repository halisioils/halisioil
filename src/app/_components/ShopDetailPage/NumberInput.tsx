"use client";
import React, { useState, type ChangeEvent } from "react";

const NumberInput: React.FC = () => {
  const [value, setValue] = useState<number>(1); // Initialize state with a minimum value of 1

  console.log(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = Math.max(1, Number(e.target.value)); // Ensure the value is never less than 1
    setValue(newValue);
  };

  return (
    <input
      type="number"
      name="itemNumber"
      id="itemNumber"
      min={1}
      value={value}
      onChange={handleChange}
      className="w-[100px] rounded-[8px] border-[2px] border-orange-500 px-[1rem] focus:outline-none"
    />
  );
};

export default NumberInput;
