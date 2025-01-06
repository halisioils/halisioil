"use client";
import { useRouter } from "next/navigation";
import React from "react";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="mb-[2rem] flex h-[32px] w-[105px] cursor-pointer items-center justify-center gap-[0.5rem] rounded-[6.25rem] bg-[rgba(0,119,182,0.16)] px-[0.5rem] py-[0.75rem] text-[0.875rem] font-[600] text-[#2b6580]"
    >
      <span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.02055 3.64645C7.21581 3.84171 7.21581 4.15829 7.02055 4.35355L3.8741 7.5H13.3337C13.6098 7.5 13.8337 7.72386 13.8337 8C13.8337 8.27614 13.6098 8.5 13.3337 8.5H3.8741L7.02055 11.6464C7.21581 11.8417 7.21581 12.1583 7.02055 12.3536C6.82528 12.5488 6.5087 12.5488 6.31344 12.3536L2.31344 8.35355C2.11818 8.15829 2.11818 7.84171 2.31344 7.64645L6.31344 3.64645C6.5087 3.45118 6.82528 3.45118 7.02055 3.64645Z"
            fill="#0077B6"
          />
        </svg>
      </span>
      Go Back
    </button>
  );
};

export default BackButton;
