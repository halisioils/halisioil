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
    setMounted(true);
  }, []);

  const { cartItems, cartQuantity, removeFromCart } = useCartContext();
  const ids = cartItems.map((item) => item.id);

  const data = api.product.getProductsByIds.useQuery(
    { ids: ids as [string, ...string[]] },
    { enabled: ids.length > 0 },
  );

  const products = (data.data as unknown as IProductCardSchema[]) ?? [];

  // Process cart items and ensure unique (id, categoryId) entries
  const fullCartItems = cartItems.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id) ?? {
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
      (category) => category.categoryId === cartItem.categoryId,
    );

    return {
      ...cartItem,
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

  async function handleCheckouthandler(fullCartItems: ChectOutItem[]) {
    setLoad(true);
    try {
      await handleCheckout(fullCartItems, userId);
    } catch (error) {
      toast.error("An error occurred");
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
              {fullCartItems.length > 0 ? (
                <div className="flex flex-col gap-[1rem] md:flex-row">
                  <section className="z-10 min-h-[30vh] max-w-[900px] overflow-x-scroll pb-[6rem] md:min-h-[50vh]">
                    <div className="relative min-w-[900px]">
                      <div className="cart-table h-[40px] bg-[#F9F1E7] text-[#253D4E]">
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
                        <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"></p>
                      </div>
                      {fullCartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.categoryId}`}
                          className="cart-table my-[2rem]"
                        >
                          <Image
                            src={item.image}
                            alt={`Image for ${item.name}`}
                            width={76}
                            height={76}
                            className="rounded-lg object-contain"
                          />
                          <p className="p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                            {item.name}
                          </p>
                          <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                            {formatCurrency(item.price)}
                          </p>
                          <NumberInput
                            id={item.id}
                            categoryName={item.categoryName}
                            categoryId={item.categoryId}
                          />
                          <p className="truncate p-[0.75rem] text-center text-[0.875rem] font-[400] text-[#252c32]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <button
                            className="text-sm text-red-500 hover:brightness-75"
                            onClick={() =>
                              removeFromCart(item.id, item.categoryId)
                            }
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="h-[200px] w-[100%] bg-[#F9F1E7] p-[1rem] md:w-[300px]">
                    <p className="text-center text-[1.5rem] text-[#253D4E]">
                      Cart Total
                    </p>
                    <div className="mt-4 flex justify-center gap-[1rem] text-gray-600">
                      <p>Total:</p>
                      <span className="font-bold text-gray-800">
                        {formatCurrency(
                          fullCartItems.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0,
                          ),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-center pt-[2rem]">
                      <button
                        disabled={load}
                        className="h-[46px] w-[150px] rounded-[15px] border border-[#B88E2F] text-gray-600 hover:brightness-75"
                        onClick={() =>
                          handleCheckouthandler(fullCartItems as ChectOutItem[])
                        }
                      >
                        {load ? <LoadingComponent /> : "Checkout"}
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <p className="text-center text-[1rem] text-gray-600">
                  No items found.
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
