"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { renderArrayCapitalizedContent } from "./renderArrayCapitalizedContent";
import type { ImageContent } from "~/lib/types";
import { CartIcon } from "./UserListIconts";

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
    <section>
      {products.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item.id)}
          className="mb-[2rem] flex cursor-pointer items-center justify-center gap-[1rem] md:gap-[2rem]"
        >
          {/* Image Container */}
          <div className="relative h-[200px] w-[100%] overflow-hidden rounded-[15px] border border-[#ECECEC] sm:w-[50%] md:max-w-[353px]">
            {item.imagePaths &&
              Array.isArray(item.imagePaths) &&
              item.imagePaths[0] && (
                <Image
                  src={
                    (item.imagePaths[0] as unknown as ImageContent)?.url ||
                    image_skeleton
                  }
                  alt={`Image for ${item.name}`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                  fill
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                  className="rounded-[15px]"
                />
              )}
          </div>

          {/* Text Container */}
          <div className="flex flex-col justify-between gap-[1rem]">
            <p className="truncate text-lg font-semibold leading-[1.5] text-[#253D4E]">
              {item.name}
            </p>
            <p className="line-clamp-2 text-sm font-medium text-[#7E7E7E]">
              {item.description}
            </p>
            {item?.properties && item.properties?.length > 0 && (
              <p className="truncate text-sm font-medium text-[#253D4E]">
                {renderArrayCapitalizedContent(item.properties)}
              </p>
            )}
            <p className="truncate text-base font-semibold text-orange-500">
              &#163; {Number(item.price).toFixed(2)}
            </p>
            <button className="flex h-[47px] w-full max-w-[165px] items-center justify-center gap-[0.5rem] rounded-[4px] bg-orange-500 text-white transition-all duration-300 ease-in-out hover:brightness-75">
              <span>
                <CartIcon />
              </span>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductCard;
