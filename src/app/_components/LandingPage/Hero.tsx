import Image from "next/image";
import Link from "next/link";
import React from "react";
import { raleway } from "~/utils/font";
import x from "~/assets/DSC09970.jpg";

const Hero = () => {
  return (
    <section className="xlg:min-h-[800px] xlg:h-[800px] relative h-[508px] w-[100%] bg-black md:min-h-[575px]">
      <div className="mx-auto w-[100%] max-w-[1440px]">
        <div className="xlg:h-[800px] relative h-[580px] w-[100%]">
          <Image
            quality={100}
            fill
            sizes="(min-width: 768px) 100vw, 700px"
            src={x}
            priority
            alt="background image"
            className={`absolute inset-0 object-contain duration-1000`}
            style={{
              objectPosition: "left 5%",
            }}
          />
        </div>
        <section className="xlg:bottom-[20%] absolute bottom-[10%] right-[1rem] z-10 flex w-fit transform flex-col justify-between gap-[2rem] rounded-lg bg-[#FFF3E3] px-[1.5rem] pb-[1.5rem] pt-[3rem] md:right-[2rem] lg:right-[3rem]">
          <div>
            <p
              className={`text-[0.875rem] font-semibold tracking-wider text-[#333333]`}
            >
              New Arrival
            </p>
            <h1
              className={`max-w-[400px] pb-[1rem] text-[2.25rem] font-bold leading-[42.26px] text-[#B88E2F] md:leading-[56.35px] lg:text-[3rem] ${raleway.className} `}
            >
              Discover Our New Collection
            </h1>
            <p className="font-regular max-w-[500px] leading-[24px] text-[#333333]">
              Indulge in our new body oil collection, carefully crafted to
              nourish, hydrate, and soothe.
            </p>
          </div>
          <Link
            className="h-[54px] w-fit rounded-sm bg-[#B88E2F] px-[2rem] py-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
            href={`/shop`}
          >
            Buy Now
          </Link>
        </section>
      </div>
    </section>
  );
};

export default Hero;
