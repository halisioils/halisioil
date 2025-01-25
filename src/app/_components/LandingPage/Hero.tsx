"use client";
import Image from "next/image";
import React from "react";
import { poppins, raleway } from "~/utils/font";
import { useHeroImages } from "~/hooks/useHeroImages";
import { heroImageSources } from "~/utils/heroImageSources";

const Hero = () => {
  const {
    isAnimating,
    setIsAnimating,
    currentIndex,
    paginationIndex,
    nextIndex,
  } = useHeroImages();

  // Ensure `heroImageSources` is defined and has valid values
  const heroImagesArray = Object.values(heroImageSources).filter(
    (source) => source?.src,
  );

  return (
    <section
      className={`relative h-[508px] w-full md:min-h-[605px] ${poppins.className} `}
    >
      {/* Text Content */}
      <div className="absolute left-0 top-1/2 z-30 flex -translate-y-1/2 transform flex-col gap-[1.5rem] px-[1rem] text-white md:px-[3rem] xl:gap-[2.5rem] xl:pl-[7.5rem]">
        <p className="border-secondary_color flex w-[210px] items-center justify-between rounded-[6.25rem] border px-[1.5rem] py-[0.5rem] text-[0.85rem]">
          <span className="rounded-full bg-[#B88E2F] p-[0.2rem] font-[700]"></span>
          Welcome to Halisioils
        </p>
        <div className="flex flex-col flex-wrap gap-[1.5rem] md:max-w-[649px]">
          <h1
            className={`max-w-[400px] text-[2.25rem] font-[700] leading-[42.26px] md:leading-[56.35px] lg:text-[3rem] ${raleway.className} `}
          >
            <span className="flex sm:inline-flex">Discover Our </span>
            <span className="pr-[0.5rem] text-[#B88E2F]">New</span>
            Collection
          </h1>
          <p className="max-w-full text-[1rem] font-[400] leading-[27px] sm:max-w-[70%] md:max-w-full lg:text-[1.125rem]">
            Indulge in our new body oil collection, carefully crafted to
            nourish, hydrate, and soothe.
          </p>
        </div>
      </div>

      {/* Background Images */}
      {heroImagesArray[currentIndex]?.src && (
        <Image
          quality={100}
          fill
          sizes="(min-width: 768px) 100vw, 700px"
          key={currentIndex}
          src={heroImagesArray[currentIndex].src}
          priority
          alt="background image"
          className={`absolute inset-0 object-cover object-right ease-in md:object-top ${
            isAnimating ? "opacity-0" : "opacity-100"
          } transition-opacity duration-1000`}
          onLoad={() => setIsAnimating(false)}
        />
      )}
      {heroImagesArray[nextIndex]?.src && (
        <Image
          quality={100}
          fill
          sizes="(min-width: 768px) 100vw, 700px"
          key={nextIndex}
          src={heroImagesArray[nextIndex].src}
          priority
          alt="background image"
          className={`absolute inset-0 object-cover ease-out ${
            isAnimating ? "opacity-100" : "opacity-0"
          } transition-opacity duration-1000`}
          onLoad={() => setIsAnimating(false)}
          style={{
            objectPosition: "5% 10%",
          }}
        />
      )}
      <div className="hero-gradient absolute inset-0"></div>

      {/* Pagination Dots */}
      <div className="absolute right-0 top-1/2 hidden h-[7.25rem] -translate-y-1/2 transform flex-col items-center justify-between pr-[1rem] md:flex md:pr-[3rem] xl:pr-[7.5rem]">
        {heroImagesArray.map((_, index) => (
          <div
            key={index}
            className={`rounded-full p-[0.2rem] transition duration-300 ease-in-out ${
              index === paginationIndex
                ? "h-[4.625rem] bg-[#B88E2F] transition duration-300 ease-in-out"
                : "bg-white"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;

//   return (
//     <section className="xlg:min-h-[800px] xlg:h-[800px] relative h-[508px] w-[100%] bg-black md:min-h-[575px]">
//       <div className="relative h-[500px] w-[500px]">
//         <Image
//           quality={100}
//           fill
//           sizes="(min-width: 768px) 100vw, 700px"
//           src={x}
//           priority
//           alt="background image"
//           style={{
//             objectFit: "contain",
//           }}
//           className="h-auto"
//         />
//       </div>

//       <section className="xlg:bottom-[20%] absolute bottom-[10%] right-[1rem] z-10 flex w-fit transform flex-col justify-between gap-[2rem] rounded-lg bg-[#F5F5F5] px-[1.5rem] pb-[1.5rem] pt-[3rem] md:right-[2rem] lg:right-[3rem]">
//         <div>
//           <p
//             className={`text-[0.875rem] font-semibold tracking-wider text-[#333333]`}
//           >
//             New Arrival
//           </p>
//           <h1
//             className={`max-w-[400px] pb-[1rem] text-[2.25rem] font-bold leading-[42.26px] text-[#B88E2F] md:leading-[56.35px] lg:text-[3rem] ${raleway.className} `}
//           >
//             Discover Our New Collection
//           </h1>
//           <p className="font-regular max-w-[500px] leading-[24px] text-[#333333]">
//             Indulge in our new body oil collection, carefully crafted to
//             nourish, hydrate, and soothe.
//           </p>
//         </div>
//         <Link
//           className="h-[54px] w-fit rounded-sm bg-[#B88E2F] px-[2rem] py-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
//           href={`/shop`}
//         >
//           Buy Now
//         </Link>
//       </section>
//     </section>
//   );
// };
