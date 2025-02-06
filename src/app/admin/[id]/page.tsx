"use client";
import React, { use } from "react";
import { useProductCategory } from "~/hooks/useProductCategory";
import { type ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import AdminImageComponent from "~/utils/AdminImageComponent";
import BackButton from "~/utils/BackButton";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import { raleway } from "~/utils/font";
import { formatCurrency } from "~/utils/formatCurrency";
import LoadingComponent from "~/utils/LoadingComponent";
import { renderArrayCapitalizedContent } from "~/utils/renderArrayCapitalizedContent";

const AdminProductDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getSelectedCategory } = useProductCategory();

  const product = api.product.getSingleProduct.useQuery({
    id,
  });

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

  const productCategories = product.data.productCategories.map((category) => ({
    ...category,
    price: Number(category.price), // Convert price from Decimal to number
  }));

  const selectedCategory = getSelectedCategory(id, productCategories);

  return (
    <section className="relative mx-auto h-full min-h-[100vh] w-full pt-[2rem]">
      <BackButton />
      <section className="flex h-[60px] items-center gap-[1.5rem] text-[#333333]">
        <p className="flex items-center justify-center gap-[0.5rem] text-center text-[1rem] font-medium text-[#9F9F9F]">
          Admin
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
          Product
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
          className={`flex items-center justify-center gap-[0.5rem] border-l-[1px] border-l-[#333333] px-[1rem] text-center text-[1rem] font-semibold text-[#253D4E] ${raleway.className} `}
        >
          {capitalizeFirstLetter(product.data?.name)}
        </p>
      </section>
      {product && product.data && (
        <section className="my-[1rem] flex flex-col gap-[1rem] md:flex-row md:gap-[3rem]">
          <AdminImageComponent
            id={product.data.id}
            name={product.data.name}
            imagePaths={product.data.imagePaths as ImageContent[]}
          />
          <section className="flex flex-col justify-start gap-[1rem]">
            <div>
              <h2
                className={`${raleway.className} pb-[1rem] text-[1.5rem] font-bold leading-[48px] text-[#253D4E] md:text-[2.5rem]`}
              >
                {capitalizeFirstLetter(product.data.name)}
              </h2>

              <p className="text-[2.125rem] font-bold leading-[58px] text-[#B88E2F] md:text-[3.125rem]">
                {formatCurrency(selectedCategory?.price ?? 0)}
              </p>
            </div>
            <h3 className="text-[1rem] leading-[24px] text-[#7E7E7E]">
              {capitalizeFirstLetter(product.data.description)}
            </h3>

            <div className="flex flex-wrap items-center gap-[0.5rem]">
              <h4 className="text-[1.125rem] text-[#7E7E7E]">Properties:</h4>
              <p className="text-[1rem] leading-[25px] text-gray-800">
                {renderArrayCapitalizedContent(product.data.properties)}
              </p>
            </div>
          </section>
        </section>
      )}
    </section>
  );
};

export default AdminProductDetailPage;
