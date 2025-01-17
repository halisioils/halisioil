"use client";
import React, { type ChangeEvent } from "react";

interface NumberInputProps {
  value: number; // The value is controlled by the parent
  onValueChange: (value: number) => void; // Callback to notify the parent of changes
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onValueChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = Math.max(1, Number(e.target.value)); // Ensure value is at least 1
    onValueChange(newValue); // Notify the parent of the new value
  };

  return (
    <input
      type="number"
      name="itemNumber"
      id="itemNumber"
      min={1}
      value={value}
      onChange={handleChange}
      className="h-[47px] w-[100px] rounded-[8px] border-[2px] border-orange-500 px-[1rem] focus:outline-none"
    />
  );
};

export default NumberInput;
