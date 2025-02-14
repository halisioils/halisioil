"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { heroImageSources } from "~/utils/heroImageSources";
import { poppins } from "~/utils/font";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const heroImagesArray = Object.values(heroImageSources).filter(
    (source) => source?.src,
  );

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
    <div className="bg-white">
      <section className="mx-auto max-w-[1100px] p-[1rem] md:p-[2rem]">
        <Slider {...settings}>
          {heroImagesArray.map((source, index) => (
            <div
              key={index}
              className={`relative mx-auto aspect-[2.4] overflow-hidden ${poppins.className}`}
            >
              <Image
                src={source.src}
                alt={`Hero Image ${index + 1}`}
                className="object-cover"
                fill
                priority={index === 0}
                quality={100} // Increased quality
                sizes="100vw" // Simplified sizes for full width
              />

              <button
                onClick={() => router.push(`/shop`)}
                className={`absolute bottom-[1rem] left-[1rem] w-[150px] -translate-y-1/2 rounded-md px-4 py-2 text-[0.875rem] font-medium shadow-lg transition-all duration-300 ease-in-out hover:brightness-75 md:bottom-[4rem] md:left-[4rem] ${
                  buttons[index]?.color ?? "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {buttons[index]?.text ?? "ORDER NOW"}
              </button>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
};

export default Hero;
