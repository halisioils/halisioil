"use client";
import React, { useEffect, useState } from "react";
import { useCartContext } from "~/context/CartContext";
import { raleway } from "~/utils/font";
import NumberInput from "./ShopDetailPage/NumberInput";
import { DeleteIcon } from "~/utils/UserListIconts";
import { api } from "~/trpc/react";
import LoadingComponent from "~/utils/LoadingComponent";
import Image from "next/image";
import type { ChectOutItem, IProductCardSchema } from "~/lib/types";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import Link from "next/link";
import { formatCurrency } from "~/utils/formatCurrency";
import { handleCheckout } from "~/actions/actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const MiniCart = () => {
  const [mounted, setMounted] = useState(false);

  const { user, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  let userId = "";

  if (user) {
    userId = user.id;
  }

  const { closeCart, isOpen, cartItems, cartQuantity, removeFromCart } =
    useCartContext();

  const ids = cartItems.map((item) => item.id);

  const data = api.product.getProductsByIds.useQuery(
    { ids: ids as [string, ...string[]] },
    {
      enabled: ids.length > 0,
    },
  );

  const products = (data.data as unknown as IProductCardSchema[]) ?? [];

  const fullCartItems = cartItems.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id) ?? {
      id: "",
      name: "",
      price: 0,
    };
    return {
      ...cartItem,
      name: product.name,
      price: Number(product.price),
    };
  });

  return mounted ? (
    <>
      {isOpen && cartQuantity > 0 && (
        <dialog
          onClick={closeCart}
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-end overflow-auto bg-black bg-opacity-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[90%] max-w-[400px] bg-white px-[1rem] py-[0.5rem] shadow-lg"
          >
            <div className="relative flex flex-col items-start">
              <button
                type="button"
                onClick={closeCart}
                className="absolute -right-4 top-0 text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 7L17 17M7 17L17 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p
                className={`mt-[2rem] flex w-[100%] items-center justify-between gap-[1rem] text-lg font-bold text-[#253D4E] ${raleway.className}`}
              >
                Shopping Cart
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-[#9F9F9F]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </span>
              </p>

              <div className="mt-4 w-[100%]">
                {cartQuantity > 0 ? (
                  data.isLoading || isLoading ? (
                    <LoadingComponent />
                  ) : (
                    <div>
                      {products && products.length > 0 ? (
                        <div>
                          <div>
                            {products?.map((product) => {
                              const cartItem = cartItems.find(
                                (item) => item.id === product.id,
                              );
                              return (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between border-b py-2"
                                >
                                  <div className="relative mb-2 h-[76px] w-[76px]">
                                    {product.imagePaths &&
                                    Array.isArray(product.imagePaths) &&
                                    product.imagePaths[0] ? (
                                      <Image
                                        src={
                                          product.imagePaths[0].url ||
                                          image_skeleton
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
                                        sizes="(min-width: 768px) 50vw, 100vw"
                                        priority
                                        fill
                                        style={{
                                          objectFit: "contain",
                                          objectPosition: "center",
                                        }}
                                        className={`cursor-pointer rounded-lg border-[1px] border-[#ECECEC] transition duration-300`}
                                      />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {product.name}
                                    </p>

                                    <div className="my-[0.5rem] flex items-center gap-2">
                                      <NumberInput id={product.id} />
                                      <button
                                        onClick={() =>
                                          removeFromCart(product.id)
                                        }
                                        className="text-sm text-red-500 hover:brightness-75"
                                      >
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                    <p className="flex items-center justify-start gap-[0.2rem] text-sm text-gray-500">
                                      {cartItem?.quantity} x
                                      <span>
                                        {formatCurrency(product.price)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-[2rem] flex w-[100%] items-center justify-between gap-[1rem] text-gray-600">
                            <p>Total:</p>
                            <span className="font-bold text-gray-800">
                              {formatCurrency(
                                cartItems.reduce((total, cartItem) => {
                                  const item = products.find(
                                    (i) => i.id === cartItem.id,
                                  );
                                  return (
                                    total +
                                    (item?.price ?? 0) * cartItem.quantity
                                  );
                                }, 0),
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-start gap-[1rem] py-[2rem]">
                            <Link
                              className="w-fit rounded-[15px] border-[1px] border-[#ECECEC] px-[1rem] py-[0.2rem] text-[1c1c1c] text-gray-600 transition-colors duration-300 ease-in-out hover:brightness-75"
                              href={`/cart`}
                              onClick={closeCart}
                            >
                              Cart
                            </Link>
                            <button
                              className="w-fit rounded-[15px] border-[1px] border-[#ECECEC] px-[1rem] py-[0.2rem] text-[1c1c1c] text-gray-600 transition-colors duration-300 ease-in-out hover:brightness-75"
                              onClick={async () => {
                                closeCart();
                                await handleCheckout(
                                  fullCartItems as ChectOutItem[],
                                  userId,
                                );
                              }}
                            >
                              Checkout
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          No items data found.
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-sm text-gray-600">No items in cart.</p>
                )}
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  ) : null;
};

export default MiniCart;
