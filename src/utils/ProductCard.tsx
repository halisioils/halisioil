"use client";
import { useRouter } from "next/navigation";
import React, { type FC } from "react";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { renderArrayCapitalizedContent } from "./renderArrayCapitalizedContent";
import type { ImageContent } from "~/lib/types";

const ProductCard = ({
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
  const router = useRouter();

  const handleCardClick = async (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <section className="mb-[2rem]">
      <section className="brx:grid-cols-5 grid w-[100%] grid-cols-2 gap-[0.5rem] gap-y-[1.5rem] md:grid-cols-3 md:gap-[1rem] md:gap-y-[1rem] lg:grid-cols-4">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="relative h-[300px] w-[100%] cursor-pointer rounded-[1.5rem] border-[1px] border-[#D5D5D5] p-[0.5rem] md:h-[300px] lg:p-[1rem]"
          >
            <div className="relative mx-auto h-[158px] w-[100%] rounded-[1rem] md:h-[158px] md:rounded-[0.75rem]">
              {item.imagePaths &&
                Array.isArray(item.imagePaths) &&
                item.imagePaths[0] && (
                  <Image
                    src={
                      (item.imagePaths[0] as unknown as ImageContent)?.url ||
                      image_skeleton
                    }
                    alt={`Image for ${item.name}`}
                    sizes="(min-width: 768px) 100vw, 700px"
                    priority
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    className="rounded-[1rem]"
                  />
                )}
              <div className="carousel-gradient absolute inset-0 rounded-[1rem]"></div>
            </div>

            <div className="flex flex-col justify-between gap-2 p-4">
              {/* Product Name */}
              <p className="truncate text-lg font-semibold text-gray-800">
                {item.name}
              </p>

              {/* Properties */}
              {item?.properties && item.properties?.length > 0 && (
                <p className="truncate text-sm font-medium text-gray-500">
                  {renderArrayCapitalizedContent(item.properties)}
                </p>
              )}

              {/* Price */}
              <p className="truncate text-base font-semibold text-gray-800">
                &#163; {Number(item.price).toFixed(2)}
              </p>

              {/* <p className="absolute bottom-[0.75rem] left-[1rem] truncate font-[700]  text-[0.75rem] bg-orange-500 px-[0.5rem] py-[0.25rem] rounded-[6.25rem] flex justify-start items-center text-white   h-[22px]">
       {item.status}
      </p> */}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};

export default ProductCard;
