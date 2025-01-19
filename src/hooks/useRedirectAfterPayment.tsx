"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importing from Next.js
import { useCartContext } from "~/context/CartContext"; // Import your cart context

/**
 * Hook to handle redirection after payment and cart cleanup.
 *
 * @param {string} path - The path to redirect to.
 * @param {number} delay - The delay before redirecting (in milliseconds). Default is 2000ms.
 */
export const useRedirectAfterPayment = (path: string, delay = 2000) => {
  const { emptyCart } = useCartContext(); // Use the emptyCart function
  const router = useRouter();

  useEffect(() => {
    // Clear the cart
    emptyCart();

    // Set a timeout to redirect after the specified delay
    const timer = setTimeout(() => {
      router.push(path); // Redirect to the specified path
    }, delay);

    // Cleanup the timeout on unmount
    return () => clearTimeout(timer);
  }, [router, path, delay, emptyCart]); // Ensure all dependencies are included
};
