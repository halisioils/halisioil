import React from "react";

const ShopDetailLoading = () => {
  return (
    <section className="flex w-[100%] justify-start gap-[1rem] py-[2rem]">
      <div className="mb-2.5 flex h-[300px] w-[100%] max-w-[400px] items-center justify-between rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>
      <div
        role="status"
        className="my-[2rem] flex-1 animate-pulse space-y-8 md:flex md:space-x-8 md:space-y-0 rtl:space-x-reverse"
      >
        <div className="w-full">
          <div className="mb-4 h-4 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 mt-[2rem] flex h-2 w-[80%] items-center justify-between rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 flex h-2 w-[90%] items-center justify-between rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 flex h-2 w-[100%] items-center justify-between rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center justify-start gap-[1rem]">
            <div className="mb-4 mt-[2rem] h-[50px] w-48 rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>

            <div className="mb-4 mt-[2rem] h-[50px] w-48 rounded-[15px] bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        <span className="sr-only">Loading...</span>
      </div>
    </section>
  );
};

export default ShopDetailLoading;
