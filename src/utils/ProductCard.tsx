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
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { useProductCategory } from "~/hooks/useProductCategory";

const ProductCard = ({
  products,
}: {
  products: {
    id: string;
    name: string;
    imagePaths: ImageContent[];
    productCategories: {
      categoryId: string;
      price: number;
      category: { name: string };
    }[];
    status: string;
    properties: string[];
    description: string;
  }[];
}) => {
  const [mounted, setMounted] = useState(false);

  const { getSelectedCategory, handleCategorySelect } = useProductCategory();

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
        const productCategories = item.productCategories.map((category) => ({
          ...category,
          price: Number(category.price), // Convert price from Decimal to number
        }));

        const selectedCategory = getSelectedCategory(
          item.id,
          productCategories,
        );
        const itemQuantity = selectedCategory
          ? getItemQuantity(item.id, selectedCategory.categoryId)
          : 0;

        return (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="flex w-[100%] cursor-pointer flex-col justify-between gap-[2rem] lg:flex-row"
          >
            {/* Image Container */}
            <div className="relative h-[220px] w-[100%] flex-[0_0_220px] shrink-0 rounded-[15px] border border-[#ECECEC] bg-white md:h-[250px] md:w-[220px]">
              {item.imagePaths &&
              Array.isArray(item.imagePaths) &&
              item.imagePaths[0] ? (
                <Image
                  src={item.imagePaths[0].url || image_skeleton}
                  alt={`Image for ${item.name}`}
                  sizes="(min-width: 768px) 100vw, 700px"
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

            <div className="relative mb-[1rem] flex flex-col gap-[1rem]">
              <h2
                className={`${raleway.className} text-[1.5rem] font-bold leading-[38.4px] text-[#253D4E] md:text-[2rem]`}
              >
                {capitalizeFirstLetter(item.name)}
              </h2>
              <p className="line-clamp-2 text-[1rem] font-medium leading-[24px] text-[#7E7E7E]">
                {capitalizeFirstLetter(item.description)}
              </p>
              {item.properties && item.properties.length > 0 && (
                <p className="truncate text-sm font-medium text-[#253D4E]">
                  {renderArrayCapitalizedContent(item.properties)}
                </p>
              )}

              {/* Category Selection */}
              <div className="relative">
                <div className="mb-[1rem] flex gap-2">
                  {item.productCategories.map((category) => (
                    <button
                      key={category.categoryId}
                      className={`rounded border px-3 py-1 ${
                        selectedCategory?.categoryId === category.categoryId
                          ? "bg-[#B88E2F] text-white"
                          : "border-gray-300"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(item.id, category);
                      }}
                    >
                      {category.category.name}
                    </button>
                  ))}
                </div>

                {/* Price Display */}
                <p className="truncate text-[1.5rem] font-bold leading-[24px] text-[#B88E2F]">
                  {formatCurrency(selectedCategory?.price ?? 0)}
                </p>

                <div onClick={(e) => e.stopPropagation()} className="my-[1rem]">
                  {itemQuantity > 0 ? (
                    <div className="flex items-center justify-start gap-[1rem]">
                      {selectedCategory && itemQuantity > 0 && (
                        <NumberInput
                          id={item.id}
                          categoryId={selectedCategory.categoryId}
                          categoryName={selectedCategory.category.name}
                        />
                      )}

                      {selectedCategory && itemQuantity > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card click event
                            removeFromCart(
                              item.id,
                              selectedCategory.categoryId,
                            );
                          }}
                          className="flex h-[47px] w-fit items-center justify-center gap-[0.5rem] text-red-500 transition-all duration-300 ease-in-out hover:brightness-75"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click event
                        if (selectedCategory) {
                          increaseCartQuantity(
                            item.id,
                            selectedCategory.categoryId,
                            selectedCategory.category.name,
                          );
                          openCart();
                        }
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
          </div>
        );
      })}
    </section>
  ) : null;
};

export default ProductCard;
