import React, { useState } from "react";

interface MultiInputProps {
  value: string[]; // Current array of strings
  onChange: (updatedValues: string[]) => void; // Function to update the array
}

const MultiInput: React.FC<MultiInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    if (inputValue.trim() === "") return;

    const updatedValues = [...value, inputValue.trim()];
    onChange(updatedValues); // Update the form state
    setInputValue("");
  };

  const removeValue = (index: number) => {
    const updatedValues = value.filter((_, i) => i !== index);
    onChange(updatedValues); // Update the form state
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter product properties"
          className="rounded-[6.25rem] border-[1px] border-[#D0D5DD] px-[1.25rem] py-[0.875rem] text-[#0D2F3F] placeholder:text-sm"
        />
        <span
          onClick={addValue}
          className="cursor-pointer rounded-[6.25rem] border-[1px] border-[#D0D5DD] px-[1.25rem] py-[0.875rem] text-[#0D2F3F] shadow-sm hover:brightness-75"
        >
          Add
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((val, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-[6.25rem] border bg-gray-100 px-4 py-2"
          >
            <span>{val}</span>
            <button
              type="button"
              onClick={() => removeValue(index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiInput;
