"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { heroImageSources } from "~/utils/heroImageSources";
import { poppins } from "~/utils/font";
import Link from "next/link";

const Hero = () => {
  const heroImagesArray = Object.values(heroImageSources).filter(
    (source) => source?.src,
  );

  // Define button texts and corresponding colors
  const buttons = [
    { text: "ORDER NOW", color: "bg-red-600 text-white" },
    { text: "ORDER NOW", color: "bg-white text-black" },
    { text: "ORDER NOW", color: "bg-red-600 text-white" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
        },
      },
    ],
  };

  return (
    <section className="mx-auto my-0">
      <Slider {...settings}>
        {heroImagesArray.map((source, index) => (
          <div
            key={index}
            className={`relative aspect-[2.25] w-full overflow-hidden md:aspect-[2.4] ${poppins.className}`}
          >
            {/* Background Image */}
            <Image
              src={source.src}
              alt={`Hero Image ${index + 1}`}
              className="object-cover"
              fill
              priority={index === 0}
              quality={80}
              sizes="(max-width: 768px) 100vw, 1440px"
            />

            {/* Button with unique text and color */}
            <Link
              href={`/shop`}
              className={`absolute bottom-[1rem] left-[1rem] w-[150px] -translate-y-1/2 rounded-md px-4 py-2 font-medium shadow-lg transition-all duration-300 ease-in-out hover:brightness-75 md:bottom-[4rem] md:left-[4rem] ${
                buttons[index]?.color ?? "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {buttons[index]?.text ?? "ORDER NOW"}
            </Link>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
