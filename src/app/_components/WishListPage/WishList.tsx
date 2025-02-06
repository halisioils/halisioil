"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { type IProductCardSchema } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "~/utils/LoadingComponent";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { CartIcon, DeleteIcon } from "~/utils/UserListIconts";
import { formatCurrency } from "~/utils/formatCurrency";
import { useWishListContext } from "~/context/WishListContext";
import { useCartContext } from "~/context/CartContext";
import Link from "next/link";

const WishList = () => {
  const [mounted, setMounted] = useState(false);

  const { removeFromWishList, WishListItems, WishListQuantity } =
    useWishListContext();
  const { increaseCartQuantity, openCart } = useCartContext();

  useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  const ids = WishListItems.map((item) => item.id);

  const data = api.product.getProductsByIds.useQuery(
    { ids: ids as [string, ...string[]] },
    {
      enabled: ids.length > 0,
    },
  );

  const products = (data.data as unknown as IProductCardSchema[]) ?? [];

  // Process cart items and ensure unique (id, categoryId) entries
  const fullWishListItems = WishListItems.map((item) => {
    const product = products.find((p) => p.id === item.id) ?? {
      id: "",
      name: "",
      imagePaths: [
        {
          name: "",
          key: "",
          url: "",
          size: "",
        },
      ],
      productCategories: [
        { category: { name: "", id: "" }, categoryId: "", price: 0 },
      ],
    };

    const matchedCategory = product.productCategories.find(
      (category) => category.categoryId === item.categoryId,
    ) ?? { category: { name: "", id: "" }, categoryId: "", price: 0 }; // Default value

    return {
      ...item,
      name: `${matchedCategory?.category.name} ${product.name}`,
      price: matchedCategory?.price ?? 0,
      image:
        product.imagePaths &&
        Array.isArray(product.imagePaths) &&
        product.imagePaths[0]
          ? product.imagePaths[0].url
          : image_skeleton,
    };
  });

  return mounted ? (
    <section>
      <div className="mt-4 w-full py-4 text-[#253D4E]">
        {WishListQuantity > 0 ? (
          data.isLoading ? (
            <LoadingComponent />
          ) : (
            <div>
              {fullWishListItems.length > 0 ? (
                <section className="z-10 min-h-[50vh] max-w-[800px] overflow-y-hidden overflow-x-scroll pb-[6rem]">
                  <div className="relative h-auto w-[100%] min-w-[800px]">
                    <div className="wishlist-table h-[40px] bg-[#F9F1E7] text-[#253D4E]">
                      <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"></p>
                      <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                        Product
                      </p>
                      <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                        Price
                      </p>
                      <p className="p-[0.75rem] text-center"></p>
                    </div>
                    <div>
                      {fullWishListItems.map((item) => (
                        <div
                          key={`${item.id}-${item.categoryId}`}
                          className="wishlist-table my-[2rem]"
                        >
                          <Link
                            href={`/shop/${item.id}`}
                            className="relative h-[76px] w-[76px] cursor-pointer"
                          >
                            <Image
                              src={item.image}
                              alt={`Image for ${item.name}`}
                              sizes="(min-width: 768px) 50vw, 100vw"
                              priority
                              fill
                              style={{
                                objectFit: "contain",
                                objectPosition: "center",
                              }}
                              className={`rounded-lg border-[1px] border-[#ECECEC] transition duration-300`}
                            />
                          </Link>

                          <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                            {item.name}
                          </p>
                          <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                            {formatCurrency(item.price)}
                          </p>

                          <p className="flex items-start justify-between gap-[1rem] truncate p-[0.75rem] text-right text-[0.875rem] font-[400] text-[#252c32]">
                            <button
                              onClick={() =>
                                removeFromWishList(item.id, item.categoryId)
                              }
                              className="text-sm text-red-500 hover:brightness-75"
                            >
                              <DeleteIcon />
                            </button>
                            <button
                              onClick={() => {
                                increaseCartQuantity(
                                  item.id,
                                  item.categoryId,
                                  item.categoryName,
                                );
                                openCart();
                                removeFromWishList(item.id, item.categoryId);
                              }}
                              className="flex h-[47px] w-full max-w-[165px] items-center justify-center gap-[0.5rem] rounded-[4px] bg-[#B88E2F] px-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
                            >
                              <span>
                                <CartIcon />
                              </span>
                              Add to Cart
                            </button>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : (
                <p className="text-center text-[1rem] text-gray-600">
                  No items data found.
                </p>
              )}
            </div>
          )
        ) : (
          <p className="text-center text-[1rem] text-gray-600">
            No items in wishlist.
          </p>
        )}
      </div>
    </section>
  ) : null;
};

export default WishList;
