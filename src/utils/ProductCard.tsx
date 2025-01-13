"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { api } from "~/trpc/react";
import LoadingComponent from "./LoadingComponent";
import Image from "next/image";
import image_skeleton from "~/assets/dashboard_skeleton_image.png";
import { renderArrayCapitalizedContent } from "./renderArrayCapitalizedContent";
import { type ImageContent } from "~/lib/types";

const ProductCard = () => {
  const products = api.product.getAllProducts.useQuery();
  const router = useRouter();

  const handleCardClick = async (id: string) => {
    router.push(`/shop/${id}`);
  };

  if (products.isLoading) {
    return (
      <div className="flex min-h-[9vh] justify-center py-[2rem]">
        <LoadingComponent />
      </div>
    );
  }

  if (products.data?.length === 0) {
    return (
      <div className="flex min-h-[90vh] justify-center py-[2rem] md:h-[248px]">
        <p className="text-[1rem] text-[#898989]">No data found</p>;
      </div>
    );
  }

  return (
    <section>
      <section className="brx:grid-cols-5 grid w-[100%] grid-cols-2 gap-[0.5rem] gap-y-[1.5rem] md:grid-cols-3 md:gap-[1rem] md:gap-y-[1rem] lg:grid-cols-4 xl:gap-[2rem]">
        {products?.data?.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="cursor-pointer rounded-lg border border-gray-100 bg-[#F4F5F7] shadow-sm transition-transform ease-in-out"
          >
            <div className="relative rounded-lg">
              {item.imagePaths &&
                Array.isArray(item.imagePaths) &&
                item.imagePaths[0] && (
                  <Image
                    src={
                      (item.imagePaths[0] as ImageContent)?.url ||
                      image_skeleton
                    }
                    alt={`Image for ${item.name}`}
                    className="h-[285px] rounded-t-lg object-cover"
                    width={285}
                    height={250}
                  />
                )}
              <div className="carousel-gradient absolute inset-0 rounded-lg"></div>
            </div>

            <div className="flex flex-col justify-between gap-2 p-4">
              {/* Product Name */}
              <p className="truncate text-lg font-semibold text-gray-800">
                {item.name}
              </p>

              {/* Properties */}
              {item.properties?.length > 0 && (
                <p className="truncate text-sm font-medium text-gray-500">
                  {renderArrayCapitalizedContent(item.properties)}
                </p>
              )}

              {/* Price */}
              <p className="truncate text-base font-semibold text-gray-800">
                &#163; {Number(item.price).toFixed(2)}
              </p>

              {/* <p className="absolute bottom-[0.75rem] left-[1rem] truncate font-[700]  text-[0.75rem] bg-orange-500 px-[0.5rem] py-[0.25rem] rounded-[6.25rem] flex justify-start items-center text-white   h-[22px]">
       {item.status}
      </p> */}
            </div>
          </div>
        ))}
      </section>
    </section>
  );
};

export default ProductCard;
