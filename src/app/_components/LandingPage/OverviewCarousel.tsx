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
            className={`group relative rounded-lg ${index === 2 ? "col-span-3 lg:col-span-1" : index === 1 ? "col-span-3 md:col-span-1" : index === 0 ? "col-span-3 md:col-span-1" : ""}`}
          >
            <div className="relative h-[450px] w-[100%] cursor-pointer overflow-hidden rounded-[0.75rem] border-[1px] border-[#D5D5D5]">
              <Image
                src={item.image}
                alt={`Image for ${item.text}`}
                priority
                fill
                sizes="(min-width: 768px) 100vw, 700px"
                placeholder="blur"
                className="object-cover object-center transition duration-500 ease-in-out group-hover:scale-125"
              />
              <div className="card-gradient absolute inset-0 rounded-[0.75rem]"></div>
            </div>

            <p className="mt-[1rem] text-center font-bold text-[#333333]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default OverviewCarousel;
