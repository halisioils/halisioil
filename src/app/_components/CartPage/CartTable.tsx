"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCartContext } from "~/context/CartContext";
import type { ChectOutItem, IProductCardSchema } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "~/utils/LoadingComponent";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import NumberInput from "../ShopDetailPage/NumberInput";
import { DeleteIcon } from "~/utils/UserListIconts";
import { formatCurrency } from "~/utils/formatCurrency";
import { handleCheckout } from "~/actions/actions";
import toast from "react-hot-toast";

const CartTable = ({ userId }: { userId: string }) => {
  const [load, setLoad] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  const { cartItems, cartQuantity, removeFromCart } = useCartContext();

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

  async function handleCheckouthandler(fullCartItems: ChectOutItem[]) {
    setLoad(true);

    try {
      await handleCheckout(fullCartItems, userId);
    } catch (error) {
      toast.error(`An error occured`);
    } finally {
      setLoad(false);
    }
  }

  return mounted ? (
    <section>
      <div className="mx-auto mt-4 w-full py-4 text-[#253D4E]">
        {cartQuantity > 0 ? (
          data.isLoading ? (
            <LoadingComponent />
          ) : (
            <div>
              {products && products.length > 0 ? (
                <div className="flex flex-col justify-between gap-[1rem] md:flex-row">
                  <section className="z-10 min-h-[30vh] max-w-[900px] overflow-y-hidden overflow-x-scroll pb-[6rem] md:min-h-[50vh]">
                    <div className="relative h-auto w-[100%] min-w-[900px]">
                      <div className="cart-table h-[40px] bg-[#F9F1E7] text-[#253D4E]">
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"></p>
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                          Product
                        </p>
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                          Price
                        </p>
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                          Quantity
                        </p>
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                          Subtotal
                        </p>
                        <p className="p-[0.75rem] text-center"></p>
                      </div>
                      <div>
                        {products.map((product) => {
                          const cartItem = cartItems.find(
                            (item) => item.id === product.id,
                          );
                          return (
                            <div
                              key={product.id}
                              className="cart-table my-[2rem]"
                            >
                              <div className="relative h-[76px] w-[76px]">
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
                              <div className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                                <NumberInput id={product.id} />
                              </div>
                              <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                                {cartItem?.quantity} x
                                <span>{formatCurrency(product.price)}</span>
                              </p>
                              <p className="truncate p-[0.75rem] text-center text-[0.875rem] font-[400] text-[#252c32]">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="text-sm text-red-500 hover:brightness-75"
                                >
                                  <DeleteIcon />
                                </button>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                  <section className="h-[200px] w-[100%] bg-[#F9F1E7] p-[1rem] md:w-[300px]">
                    <p className="text-center text-[1.5rem] text-[#253D4E]">
                      Cart Total
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-[1rem] text-gray-600">
                      <p>Total:</p>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(
                          cartItems.reduce((total, cartItem) => {
                            const item = products.find(
                              (i) => i.id === cartItem.id,
                            );
                            return (
                              total + (item?.price ?? 0) * cartItem.quantity
                            );
                          }, 0),
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-[1rem] pt-[2rem]">
                      <button
                        disabled={load}
                        className="flex h-[46px] w-[150px] items-center justify-center rounded-[15px] border-[1px] border-[#B88E2F] px-[1rem] py-[0.2rem] text-[1c1c1c] text-gray-600 transition-colors duration-300 ease-in-out hover:brightness-75"
                        onClick={() => {
                          void handleCheckouthandler(
                            fullCartItems as ChectOutItem[],
                          );
                        }}
                      >
                        {load ? <LoadingComponent /> : "Checkout"}
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <p className="text-center text-[1rem] text-gray-600">
                  No items data found.
                </p>
              )}
            </div>
          )
        ) : (
          <p className="text-center text-[1rem] text-gray-600">
            No items in cart.
          </p>
        )}
      </div>
    </section>
  ) : null;
};

export default CartTable;
