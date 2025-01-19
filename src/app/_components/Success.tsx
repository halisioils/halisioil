"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import React, { Suspense } from "react";
import Confetti from "react-confetti";
import { useRedirectAfterPayment } from "~/hooks/useRedirectAfterPayment";
import LoadingComponent from "~/utils/LoadingComponent";

// Confetti Component for handling confetti effect based on window size
const ConfettiEffect = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render Confetti on the server side
  }

  return <Confetti className="h-[100%] w-[100%]" />;
};

const SuccessComponent = () => {
  // Call the custom hook to redirect to "/dashboard" after 2 seconds
  useRedirectAfterPayment("/dashboard", 2000);

  return (
    <section
      className={`mx-auto flex h-[100%] min-h-screen w-[100%] max-w-[1440px] items-center justify-center gap-[1rem] bg-bgGray px-[1rem] pb-[2rem] pt-[1rem] md:px-[2rem]`}
    >
      <ConfettiEffect />

      <section className="relative flex h-[310px] w-[90vw] max-w-[465px] flex-col items-center justify-center gap-6 rounded-lg border-[1px] border-[#B88E2F] px-6 py-5 md:w-[465px]">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#B88E2F] bg-[#e7d5ac]">
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 8L8 14L20 2"
              stroke="#B88E2F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="flex flex-col items-center gap-4">
          <h3 className="text-center text-xl font-bold">Payment Successful!</h3>
          <p className="text-center text-base font-normal leading-6">
            Thank you for your payment! You will be redirected shortly.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 w-full rounded-full bg-[#B88E2F] px-6 py-3 text-center text-base text-white transition-colors duration-300 ease-in-out"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </section>
  );
};

const Success = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SuccessComponent />
    </Suspense>
  );
};

export default Success;
