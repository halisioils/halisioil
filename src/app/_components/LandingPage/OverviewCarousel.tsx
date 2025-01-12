import Image from "next/image";
import React from "react";
import { overviewData } from "~/utils/overviewImageData";

const OverviewCarousel = () => {
  return (
    <article className="mx-auto mb-[2rem] mt-[3rem]">
      <div className="grid-rows-auto grid grid-cols-1 gap-[1.5rem] sm:grid-cols-2 lg:grid-cols-3">
        {overviewData.map((item, index) => (
          <div
            key={item.id}
            className={`rounded-lg ${index === 2 ? "col-span-3 lg:col-span-1" : index === 1 ? "col-span-3 md:col-span-1" : index === 0 ? "col-span-3 md:col-span-1" : ""}`}
          >
            <Image
              src={item.image}
              alt={`Image for ${item.text}`}
              className="mb-4 h-[350px] w-full cursor-pointer rounded-md transition-shadow duration-300 ease-in-out hover:shadow-lg sm:h-[450px]"
              placeholder="blur"
              style={{
                objectFit: "cover",
              }}
            />
            <p className="text-center font-bold text-[#333333]">{item.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default OverviewCarousel;
