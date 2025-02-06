"use client";
import React, { use } from "react";
import ImageComponent from "~/app/_components/ShopDetailPage/ImageComponent";
import NumberInput from "~/app/_components/ShopDetailPage/NumberInput";
import { useCartContext } from "~/context/CartContext";
import { useWishListContext } from "~/context/WishListContext";
import { useProductCategory } from "~/hooks/useProductCategory";
import { type ImageContent } from "~/lib/types";
import { api } from "~/trpc/react";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import { raleway } from "~/utils/font";
import { formatCurrency } from "~/utils/formatCurrency";
import LoadingComponent from "~/utils/LoadingComponent";
import { renderArrayCapitalizedContent } from "~/utils/renderArrayCapitalizedContent";
import { CartIcon, DeleteIcon, WishlistIcon } from "~/utils/UserListIconts";

const ShopDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { increaseCartQuantity, removeFromCart, getItemQuantity, openCart } =
    useCartContext();

  const { getSelectedCategory, handleCategorySelect } = useProductCategory();
  const { isInWishList, addToWishList, removeFromWishList } =
    useWishListContext();

  const { id } = use(params);
  const product = api.product.getSingleProduct.useQuery({ id });

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
        <p className="text-[1rem] text-[#898989]">No Product data found</p>
      </section>
    );
  }

  const productCategories = product.data.productCategories.map((category) => ({
    ...category,
    price: Number(category.price), // Convert price from Decimal to number
  }));

  const selectedCategory = getSelectedCategory(id, productCategories);
  const itemQuantity = selectedCategory
    ? getItemQuantity(id, selectedCategory.categoryId)
    : 0;

  const isAddedToWishList = isInWishList(id);

  return (
    <section className="relative mx-auto h-full min-h-[100vh] w-full">
      {/* Breadcrumb Navigation */}
      <section className="flex h-[60px] items-center gap-[1.5rem] text-[#333333]">
        <p className="text-[1rem] font-medium text-[#9F9F9F]">
          Home &gt; Shop &gt; {capitalizeFirstLetter(product.data.name)}
        </p>
      </section>

      <section className="my-[1rem] flex flex-col gap-[1rem] md:flex-row md:gap-[3rem]">
        <ImageComponent
          name={product.data.name}
          imagePaths={product.data.imagePaths as ImageContent[]}
        />
        <section className="flex flex-col justify-start gap-[1rem]">
          <h2
            className={`${raleway.className} pb-[1rem] text-[2rem] font-bold text-[#253D4E]`}
          >
            {capitalizeFirstLetter(product.data.name)}
          </h2>

          {/* Category Selection */}
          <div className="my-[1rem] flex gap-2">
            {productCategories.map((category) => (
              <button
                key={category.categoryId}
                className={`rounded border px-3 py-1 ${
                  selectedCategory?.categoryId === category.categoryId
                    ? "bg-[#B88E2F] text-white"
                    : "border-gray-300"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategorySelect(id, category);
                }}
              >
                {category.category.name}
              </button>
            ))}
          </div>

          {/* Price Display */}
          <p className="text-[1.5rem] font-bold text-[#B88E2F]">
            {formatCurrency(selectedCategory?.price ?? 0)}
          </p>

          {/* Product Description */}
          <h3 className="text-[1rem] text-[#7E7E7E]">
            {capitalizeFirstLetter(product.data.description)}
          </h3>

          {/* Product Properties */}
          <div className="flex flex-wrap items-center gap-[0.5rem]">
            <h4 className="text-[1.125rem] text-[#7E7E7E]">Properties:</h4>
            <p className="text-[1rem] text-gray-800">
              {renderArrayCapitalizedContent(product.data.properties)}
            </p>
          </div>

          {/* Quantity & Cart Controls */}
          <div className="flex flex-wrap items-center gap-[1rem]">
            {selectedCategory && itemQuantity > 0 && (
              <NumberInput
                id={id}
                categoryId={selectedCategory.categoryId}
                categoryName={selectedCategory.category.name}
              />
            )}

            {selectedCategory && itemQuantity > 0 ? (
              <button
                onClick={() => removeFromCart(id, selectedCategory.categoryId)}
                className="flex h-[47px] w-full max-w-[165px] items-center justify-center gap-[0.5rem] rounded-[4px] bg-red-400 px-[1rem] text-white transition-all duration-300 ease-in-out hover:brightness-75"
              >
                <DeleteIcon />
                Remove
              </button>
            ) : (
              <button
                onClick={() => {
                  if (selectedCategory) {
                    increaseCartQuantity(
                      id,
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

            {/* Wishlist Button */}
            {isAddedToWishList ? (
              <button
                onClick={() => removeFromWishList(id)}
                className="rounded-[8px] border-[1px] border-[#ECECEC] bg-red-500 p-[0.5rem] text-white transition-all duration-300 ease-in-out hover:border-[#B88E2F] hover:text-[#B88E2F]"
              >
                <WishlistIcon />
              </button>
            ) : (
              <button
                onClick={() => addToWishList(id)}
                className="rounded-[8px] border-[1px] border-[#ECECEC] p-[0.5rem] text-gray-500 transition-all duration-300 ease-in-out hover:border-[#B88E2F] hover:text-[#B88E2F]"
              >
                <WishlistIcon />
              </button>
            )}
          </div>
        </section>
      </section>
    </section>
  );
};

export default ShopDetailPage;
