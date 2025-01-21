"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { renderArrayCapitalizedContent } from "./renderArrayCapitalizedContent";
import type { ImageContent } from "~/lib/types";
import { CartIcon, DeleteIcon } from "./UserListIconts";
import { raleway } from "./font";
import { useCartContext } from "~/context/CartContext";
import NumberInput from "~/app/_components/ShopDetailPage/NumberInput";
import { formatCurrency } from "./formatCurrency";

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
  const [mounted, setMounted] = useState(false);

  const { increaseCartQuantity, removeFromCart, getItemQuantity, openCart } =
    useCartContext();

  useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  const router = useRouter();

  const handleCardClick = async (id: string) => {
    router.push(`/shop/${id}`);
  };

  return mounted ? (
    <section>
      {products.map((item) => {
        const itemQuantity = getItemQuantity(item.id);

        return (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="mb-[6rem] flex cursor-pointer flex-col justify-center gap-[1rem] md:mb-[3rem] md:flex-row md:gap-[2rem]"
          >
            {/* Image Container */}
            <div className="relative h-[200px] w-[100%] overflow-hidden rounded-[15px] border border-[#ECECEC] sm:w-[353px] md:h-[220px]">
              {item.imagePaths &&
              Array.isArray(item.imagePaths) &&
              item.imagePaths[0] ? (
                <Image
                  src={item.imagePaths[0].url || image_skeleton}
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
              ) : (
                <Image
                  src={image_skeleton}
                  alt="Skeleton loading image"
                  fill
                  className="rounded-[15px] object-cover"
                />
              )}
            </div>

            {/* Text Container */}
            <div className="relative flex flex-col gap-[1rem]">
              <h2
                className={`${raleway.className} truncate text-[1.5rem] font-bold leading-[38.4px] text-[#253D4E] md:text-[2rem]`}
              >
                {item.name}
              </h2>
              <p className="line-clamp-2 text-[1rem] font-medium leading-[24px] text-[#7E7E7E]">
                {item.description}
              </p>
              {item.properties && item.properties.length > 0 && (
                <p className="truncate text-sm font-medium text-[#253D4E]">
                  {renderArrayCapitalizedContent(item.properties)}
                </p>
              )}
              <p className="truncate text-[1.5rem] font-bold leading-[24px] text-[#B88E2F]">
                {formatCurrency(item.price)}
              </p>
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute -bottom-[4rem] left-0 md:-bottom-[1rem]"
              >
                {itemQuantity > 0 ? (
                  <div className="flex items-center justify-between gap-[1rem]">
                    <NumberInput id={item.id} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click event
                        removeFromCart(item.id);
                      }}
                      className="flex h-[47px] w-full items-center justify-center gap-[0.5rem] text-red-500 transition-all duration-300 ease-in-out hover:brightness-75"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click event
                      increaseCartQuantity(item.id);
                      openCart();
                    }}
                    className="flex h-[47px] w-full max-w-[165px] items-center justify-center gap-[0.5rem] rounded-[4px] bg-[#B88E2F] px-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
                  >
                    <CartIcon />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  ) : null;
};

export default ProductCard;
