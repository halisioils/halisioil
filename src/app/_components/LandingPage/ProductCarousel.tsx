"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import type { IProductPageSchema, ImageContent } from "~/lib/types";
import CarouselButton from "~/utils/CarouselButton";
import { raleway } from "~/utils/font";
import { renderArrayCapitalizedContent } from "~/utils/renderArrayCapitalizedContent";

const ProductCarousel = ({
  products,
}: {
  products: {
    id: string;
    name: string;
    imagePaths: ImageContent[];
    price: number;
    status: string;
    properties: string[];
  }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();

  // Default card width
  const cardWidth = 300;

  const translateX = -currentIndex * cardWidth;

  const handleIndexChange = (newIndex: number) => {
    // Handle the new index in the parent component
    setCurrentIndex(newIndex);
  };

  const handleCardClick = async (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <article className="mx-auto min-h-[446px] pb-[3rem] pt-[2rem]">
      <div className="flex flex-col gap-[2.5rem]">
        <div className="text-primary_black flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className={`text-[#333333] ${raleway.className}`}>
            <h3 className="pb-[1rem] text-[1.5rem] font-[700] leading-[19.25px] md:text-[2.25rem]">
              Recent Products
            </h3>
            <p className="flex flex-col gap-[0.625rem] text-[1rem] font-[400] lg:block lg:leading-[43.2px]">
              Here are some of our recent products.
              <span className="text-primary_color font-[700] lg:pl-[0.3rem]">
                <Link href="/shop" className="text-orange-600">
                  See more
                </Link>
              </span>
            </p>
          </div>

          <CarouselButton
            data={products as unknown as IProductPageSchema[]}
            currentCardIndex={currentIndex}
            onIndexChange={handleIndexChange}
          />
        </div>
        <div className="no-scrollbar flex h-full w-full gap-4 overflow-x-auto overflow-y-hidden lg:overflow-hidden">
          {products?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              className="cursor-pointer rounded-lg border border-gray-100 bg-[#F4F5F7] shadow-sm transition-transform ease-in-out"
              style={{
                transform: `translateX(${translateX}px)`,
              }}
            >
              <div className="relative rounded-lg">
                {item.imagePaths &&
                  Array.isArray(item.imagePaths) &&
                  item.imagePaths[0] && (
                    <Image
                      src={item.imagePaths[0]?.url || image_skeleton}
                      alt={`Image for ${item.name}`}
                      className="h-[285px] rounded-t-lg object-cover"
                      width={285}
                      height={250}
                    />
                  )}
                <div className="carousel-gradient absolute inset-0 rounded-lg"></div>
              </div>

              <div className="flex flex-col justify-between gap-2 p-4">
                {/* Product Name */}
                <p className="truncate text-lg font-semibold text-gray-800">
                  {item.name}
                </p>

                {/* Properties */}
                {item.properties?.length > 0 && (
                  <p className="truncate text-sm font-medium text-gray-500">
                    {renderArrayCapitalizedContent(item.properties)}
                  </p>
                )}

                {/* Price */}
                <p className="truncate text-base font-semibold text-gray-800">
                  &#163; {Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProductCarousel;
