"use client";
import React, { useState, type FC } from "react";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { faqs } from "./faqs";
import { raleway } from "./font";

const Accordian: FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleHandler = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse the card if it's already expanded
    } else {
      setExpandedIndex(index); // Expand the clicked card
    }
  };

  return (
    <div className="relative mt-[3rem]">
      {faqs.map((faq, index) => (
        <section
          id={faq.id}
          key={faq.id}
          onClick={() => toggleHandler(index)}
          className={`my-[1rem] w-[100%] cursor-pointer gap-[1rem] rounded-[0.75rem] border-[1px] border-[#ECECEC] px-[2rem] py-[1rem] transition-all duration-[300ms] ease-in-out ${
            expandedIndex === index ? "md:max-h-[100%]" : "md:max-h-[200px]"
          }`}
        >
          <div className="w-[100%]">
            <div>
              <h3
                className={`line-clamp-1 flex w-[100%] items-center justify-between gap-[1rem] text-[1rem] font-semibold text-gray-600 ${raleway.className} `}
              >
                {capitalizeFirstLetter(faq.title)}
                <button
                  className={`rounded-full bg-[#eee9dc] p-[0.2rem] text-[#B88E2F] shadow-sm transition-all duration-300 ease-in-out`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`h-6 w-6 transform transition-transform ${
                      expandedIndex === index ? "rotate-90" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </h3>
            </div>
            <div
              className={`w-[100%] overflow-hidden transition-all duration-[300ms] ${
                expandedIndex === index
                  ? "max-h-[100%] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <p
                  className={`mt-[1rem] text-[0.875rem] font-[400] leading-[24.5px] text-[#0D2F3F] ${
                    expandedIndex === index ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-[300ms] ease-in-out`}
                >
                  {capitalizeFirstLetter(faq.description)}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Accordian;
