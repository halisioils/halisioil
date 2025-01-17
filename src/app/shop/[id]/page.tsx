"use client";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import ImageComponent from "~/app/_components/ShopDetailPage/ImageComponent";
import NumberInput from "~/app/_components/ShopDetailPage/NumberInput";
import { type ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import { raleway } from "~/utils/font";
import LoadingComponent from "~/utils/LoadingComponent";
import { renderArrayCapitalizedContent } from "~/utils/renderArrayCapitalizedContent";
import { CartIcon, WishlistIcon } from "~/utils/UserListIconts";

const ShopDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [numberValue, setNumberValue] = useState<number>(1); // State resides in the parent

  const { id } = use(params);
  const router = useRouter();

  const product = api.product.getSingleProduct.useQuery({
    id,
  });

  console.log(numberValue);

  const handleValueChange = (value: number): void => {
    setNumberValue(value); // Update the parent's state when the child notifies of changes
  };

  const handleCartClick = async (id: string) => {
    console.log(id);
  };

  const handleWishlistClick = async (id: string) => {
    console.log(id);
  };

  if (product.isLoading) {
    return (
      <section className="relative mx-auto flex h-full min-h-[100vh] w-full justify-center pt-[3rem]">
        <LoadingComponent />
      </section>
    );
  }

  if (!product.data) {
    return (
      <section className="relative mx-auto flex h-full min-h-[100vh] w-full justify-center pt-[3rem]">
        <p className="text-[1rem] text-[#898989]">No Product data found</p>;
      </section>
    );
  }

  return (
    <section className="relative mx-auto h-full min-h-[100vh] w-full">
      <section className="flex h-[60px] items-center gap-[1.5rem] text-[#333333]">
        <p className="flex items-center justify-center gap-[0.5rem] text-center text-[1rem] font-medium text-[#9F9F9F]">
          Home
          <span>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#333333" />
            </svg>
          </span>
        </p>

        <p className="flex items-center justify-center gap-[0.5rem] text-center text-[1rem] font-medium text-[#9F9F9F]">
          Shop
          <span>
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 12L5 7L0 2L1 0L8 7L1 14L0 12Z" fill="#333333" />
            </svg>
          </span>
        </p>
        <p
          className={`flex items-center justify-center gap-[0.5rem] border-l-[1px] border-l-[#333333] px-[1rem] text-center text-[1rem] font-semibold text-[#333333] ${raleway.className} `}
        >
          {product.data?.name}
        </p>
      </section>
      {product && product.data && (
        <section className="my-[1rem] flex flex-col gap-[1rem] md:flex-row md:gap-[3rem]">
          <ImageComponent
            name={product.data.name}
            imagePaths={product.data.imagePaths as ImageContent[]}
          />
          <section className="flex flex-col justify-start gap-[1rem]">
            <div>
              <h2
                className={`${raleway.className} pb-[1rem] text-[1.5rem] font-bold leading-[48px] text-[#253D4E] md:text-[2.5rem]`}
              >
                {product.data.name}
              </h2>

              <p className="text-[2.125rem] font-bold leading-[58px] text-orange-500 md:text-[3.125rem]">
                &#163; {Number(product.data.price).toFixed(2)}
              </p>
            </div>
            <h3 className="text-[1rem] leading-[24px] text-[#7E7E7E]">
              {product.data.description}
            </h3>

            <div className="flex flex-wrap items-center gap-[0.5rem]">
              <h4 className="text-[1.125rem] text-[#7E7E7E]">Properties:</h4>
              <p className="text-[1rem] leading-[25px] text-gray-800">
                {renderArrayCapitalizedContent(product.data.properties)}
              </p>
            </div>

            <div className="flex items-center gap-[1rem]">
              <NumberInput
                value={numberValue}
                onValueChange={handleValueChange}
              />
              <button
                onClick={() => handleCartClick(id)}
                className="flex h-[47px] w-full max-w-[165px] items-center justify-center gap-[0.5rem] rounded-[4px] bg-orange-500 px-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
              >
                <span>
                  <CartIcon />
                </span>
                Add to Cart
              </button>

              <button
                onClick={() => handleWishlistClick(id)}
                className="rounded-[8px] border-[1px] border-[#ECECEC] p-[0.5rem] text-gray-500 transition-colors duration-300 ease-in-out hover:border-orange-500 hover:text-orange-500"
              >
                <WishlistIcon />
              </button>
            </div>
          </section>
        </section>
      )}
    </section>
  );
};

export default ShopDetailPage;
