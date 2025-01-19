"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importing useRouter from Next.js
import { useCartContext } from "~/context/CartContext";
import { useSearchParams } from "next/navigation"; // To access query params in the URL

export const useRedirectAfterPayment = (path: string, delay = 2000) => {
  const { removeFromCart } = useCartContext();
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters

  useEffect(() => {
    // Check if product_ids exists in the URL
    const productIds = searchParams.get("product_ids");

    if (productIds) {
      const productIdsArray = productIds.split(","); // Convert the product IDs string to an array

      // Remove each product from the cart
      productIdsArray.forEach((id) => {
        removeFromCart(id); // Assuming removeFromCart takes the product ID as an argument
      });

      // Set a timeout to redirect after removing the items from the cart
      const timer = setTimeout(() => {
        router.push(path); // Redirect to the specified path (e.g., dashboard)
      }, delay);

      // Cleanup the timeout when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [searchParams, router, path, delay, removeFromCart]);
};
