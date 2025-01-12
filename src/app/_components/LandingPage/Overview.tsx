import React from "react";
import { raleway } from "~/utils/font";

const Overview = () => {
  return (
    <section className="m-auto h-[100%] w-[100%] pt-[4.5rem] md:py-[2rem] md:pt-[4.5rem]">
      <div className="mx-auto w-[100%] md:w-[609px]">
        <h2
          className={`pb-[1rem] text-left text-[1.5rem] font-[700] text-[#333333] sm:text-center md:text-[2.25rem] ${raleway.className} `}
        >
          Browse The Range
        </h2>
        <p className="text-left text-[1rem] font-[400] leading-[28px] text-[#1E1E1E] sm:text-center sm:leading-[24px]">
          Discover or premium oils, available in multiple captivating scents and
          sizes. Nourish your skin, your way.
        </p>
      </div>
    </section>
  );
};

export default Overview;
