"use client";
import Image from "next/image";
import React from "react";
import { type IProductCardSchema } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "~/utils/LoadingComponent";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { CartIcon, DeleteIcon } from "~/utils/UserListIconts";
import { formatCurrency } from "~/utils/formatCurrency";
import { useWishListContext } from "~/context/WishListContext";
import { useCartContext } from "~/context/CartContext";

const WishList = () => {
  const { removeFromWishList, WishListItems, WishListQuantity } =
    useWishListContext();

  const { increaseCartQuantity } = useCartContext();

  const ids = WishListItems.map((item) => item.id);

  const data = api.product.getProductsByIds.useQuery(
    { ids: ids as [string, ...string[]] },
    {
      enabled: ids.length > 0,
    },
  );

  const products = data.data as unknown as IProductCardSchema[];

  return (
    <section>
      <div className="mt-4 w-full py-4 text-[#253D4E]">
        {WishListQuantity > 0 ? (
          data.isLoading ? (
            <LoadingComponent />
          ) : (
            <div>
              {products && products.length > 0 ? (
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
                      {products.map((product) => {
                        WishListItems.find((item) => item.id === product.id);
                        return (
                          <div
                            key={product.id}
                            className="wishlist-table my-[2rem]"
                          >
                            <div className="relative h-[76px] w-[76px]">
                              {product.imagePaths &&
                              Array.isArray(product.imagePaths) &&
                              product.imagePaths[0] ? (
                                <Image
                                  src={
                                    product.imagePaths[0].url || image_skeleton
                                  }
                                  alt={`Image for ${product.name}`}
                                  sizes="(min-width: 768px) 50vw, 100vw"
                                  priority
                                  fill
                                  style={{
                                    objectFit: "contain",
                                    objectPosition: "center",
                                  }}
                                  className={`cursor-pointer rounded-lg border-[1px] border-[#ECECEC] transition duration-300`}
                                />
                              ) : (
                                <Image
                                  src={image_skeleton}
                                  alt="Skeleton loading image"
                                  width={76}
                                  height={76}
                                  className="rounded-lg object-contain object-center"
                                />
                              )}
                            </div>

                            <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                              {product.name}
                            </p>
                            <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                              {formatCurrency(product.price)}
                            </p>

                            <p className="flex items-start justify-between gap-[1rem] truncate p-[0.75rem] text-right text-[0.875rem] font-[400] text-[#252c32]">
                              <button
                                onClick={() => removeFromWishList(product.id)}
                                className="text-sm text-red-500 hover:brightness-75"
                              >
                                <DeleteIcon />
                              </button>
                              <button
                                onClick={() => {
                                  increaseCartQuantity(product.id);
                                  removeFromWishList(product.id);
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
                        );
                      })}
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
  );
};

export default WishList;
