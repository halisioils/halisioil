"use client";
import React, { useState } from "react";
import { type IProductPageSchema } from "~/lib/types";

interface CarouselProps {
  data: IProductPageSchema[];
  currentCardIndex: number;
  onIndexChange: (newIndex: number) => void;
}

const CarouselButton = ({
  data,
  currentCardIndex,
  onIndexChange,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(currentCardIndex);

  const handlePrevClick = () => {
    const newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const handleNextClick = () => {
    const newIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  // Define a variable to hold the color of the SVG
  const svgColor = currentIndex === data.length - 1 ? "#e2e8f0" : "#363636";

  return (
    <div className="hidden w-[6rem] items-center justify-between pt-[2rem] lg:flex lg:pt-0">
      <button disabled={currentIndex === 0} onClick={handlePrevClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M20 12.75C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25V12.75ZM20 11.25H4V12.75H20V11.25Z"
            fill={currentIndex === 0 ? "#e2e8f0" : "#363636"}
          />
          <path
            d="M10 6L4 12L10 18"
            stroke={currentIndex === 0 ? "#e2e8f0" : "#363636"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        disabled={currentIndex === data.length - 1}
        onClick={handleNextClick}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.5"
            d="M4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75V11.25ZM4 12.75H20V11.25H4V12.75Z"
            fill={svgColor}
          />
          <path
            d="M14 6L20 12L14 18"
            stroke={svgColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CarouselButton;
