import Image from "next/image";
import React, { type FC } from "react";
import banner_image from "~/assets/vanilla.jpg";
import { raleway } from "./font";
import { type BannerProps } from "~/lib/types";

const Banner: FC<BannerProps> = ({ prev, next, head }) => {
  return (
    <section className="h-[100%] w-[100%]">
      <div className="relative h-[250px] w-full rounded-[2rem]">
        <Image
          quality={100}
          fill
          sizes="(min-width: 768px) 100vw, 700px"
          src={banner_image}
          priority
          alt="background image"
          className="absolute inset-0 rounded-[2rem] object-cover"
          style={{
            objectPosition: "center top 10%",
          }}
        />

        <div className="hero-gradient absolute inset-0 rounded-[2rem]"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white">
          <h2
            className={`text-center text-[1.5rem] font-medium leading-tight md:text-[2rem] ${raleway.className} `}
          >
            {head}
          </h2>
          <p className="mt-2 flex items-center justify-center gap-[0.5rem] text-center text-[1rem] font-medium text-white">
            {prev}
            <span>
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="white" />
              </svg>
            </span>
            <span className="font-regular text-orange-500">{next}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
