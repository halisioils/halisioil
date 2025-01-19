"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Importing useRouter from Next.js

const useRedirectAfterPayment = (path: string, delay = 2000) => {
  const router = useRouter();

  useEffect(() => {
    // Set a timeout to redirect after the specified delay
    const timer = setTimeout(() => {
      router.push(path);
    }, delay);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [router, path, delay]);
};

export default useRedirectAfterPayment;
