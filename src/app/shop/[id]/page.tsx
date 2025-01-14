"use client";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import ImageComponent from "~/app/_components/ShopDetailPage/ImageComponent";
import { ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import { raleway } from "~/utils/font";
import { renderArrayCapitalizedContent } from "~/utils/renderArrayCapitalizedContent";

const ShopDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();

  const product = api.product.getSingleProduct.useQuery({
    id,
  });

  console.log(product.data);

  return (
    <section className="relative mx-auto h-full min-h-[100vh] w-full">
      <section className="bg-[#F9F1E7]flex flex h-[60px] items-center gap-[1.5rem] bg-[#F9F1E7] px-[1rem] text-[#333333] md:px-[2rem] lg:px-[3rem]">
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
          Shop
        </p>
      </section>
      <section className="max-w-[1440px] px-[1rem] md:px-[2rem] lg:px-[3rem]">
        {product && product.data && (
          <div className="flex justify-between gap-[2rem]">
            <ImageComponent
              name={product.data.name}
              imagePaths={product.data.imagePaths as ImageContent[]}
            />
            <section className="flex flex-col justify-between gap-[1rem]">
              <div>
                <h2 className="text-[1.5rem] font-semibold text-[#333333]">
                  {product.data.name}
                </h2>
                <h3 className="text-[1.125rem] text-[#9F9F9F]">
                  &#163; {Number(product.data.price).toFixed(2)}
                </h3>
              </div>
              <p className="text-[1rem] leading-[25px] text-gray-800">
                {product.data.description}
              </p>
              <div className="flex flex-col gap-[0.5rem]">
                <h4 className="text-[1.125rem] text-[#9F9F9F]">Properties</h4>
                <p className="text-[1rem] leading-[25px] text-gray-800">
                  {renderArrayCapitalizedContent(product.data.properties)}
                </p>
              </div>
            </section>
          </div>
        )}
      </section>
    </section>
  );
};

export default ShopDetailPage;
