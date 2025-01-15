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
    description: string;
  }[];
}) => {
  const router = useRouter();

  const handleCardClick = async (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <section className="w-[100%]">
      {products.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item.id)}
          className="relative flex h-[100%] w-[100%] cursor-pointer gap-[1rem]"
        >
          <div className="relative mx-auto h-[353px] w-[353px] rounded-[15px] border-[1px] border-[#ECECEC]">
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
          </div>

          <div className="flex flex-1 flex-col flex-wrap justify-center gap-2">
            {/* Product Name */}
            <p className="truncate text-lg font-semibold leading-[38.4px] text-[#253D4E]">
              {item.name}
            </p>
            <p className="max-w-[70%] truncate text-lg font-semibold text-[#7E7E7E]">
              {item.description}
            </p>

            {/* Properties */}
            {item?.properties && item.properties?.length > 0 && (
              <p className="truncate text-sm font-medium text-[#253D4E]">
                {renderArrayCapitalizedContent(item.properties)}
              </p>
            )}

            {/* Price */}
            <p className="truncate text-base font-semibold text-orange-500">
              &#163; {Number(item.price).toFixed(2)}
            </p>

            {/* <p className="absolute bottom-[0.75rem] left-[1rem] truncate font-[700]  text-[0.75rem] bg-orange-500 px-[0.5rem] py-[0.25rem] rounded-[6.25rem] flex justify-start items-center text-white   h-[22px]">
       {item.status}
      </p> */}
            <button className="flex h-[47px] w-[165.14px] items-center justify-center rounded-[4px] bg-orange-500 text-white transition-all duration-300 ease-in-out hover:brightness-75">
              <span>x</span> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductCard;
