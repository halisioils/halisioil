import Link from "next/link";
import React from "react";

const Failed = () => {
  return (
    <section className="relative flex w-[90vw] max-w-[465px] flex-col items-center justify-center gap-6 rounded-lg border-[1px] border-[#ECECEC] px-6 py-[2rem] md:w-[465px]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-red-600 bg-red-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#dc2626"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </span>
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-center text-xl font-bold text-red-600">
          Payment Failed
        </h3>
        <p className="text-center text-base font-normal leading-6 text-gray-600">
          Something went wrong with your payment. Please try again or contact
          support.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 w-full rounded-full bg-[#B88E2F] px-6 py-3 text-center text-base text-white transition-colors duration-300 ease-in-out hover:brightness-75"
        >
          Dashboard
        </Link>
        <Link
          href="/contact"
          className="mt-2 w-full rounded-full bg-gray-300 px-6 py-3 text-center text-base text-gray-800 transition-colors duration-300 ease-in-out hover:brightness-75"
        >
          Contact Support
        </Link>
      </div>
    </section>
  );
};

export default Failed;
