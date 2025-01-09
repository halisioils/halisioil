"use client";
import React, { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type TablePaginationProps } from "~/lib/types";

const TablePagination: FC<TablePaginationProps> = ({
  hasNextPage,
  hasPrevPage,
  totalEntries,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") ?? "1");
  const per_page = 10;

  const totalPages = Math.ceil(totalEntries.length / per_page);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    const newUrl = `${pathname}?${params.toString()}`;

    if (page) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }

    router.push(newUrl);
  };

  // Function to generate pagination buttons with ellipses
  const renderPaginationButtons = () => {
    const visiblePages = 3;
    const halfVisiblePages = Math.floor(visiblePages / 2);

    const startPage = Math.max(1, page - halfVisiblePages);
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[0.875rem] md:h-[38px] md:w-[38px] ${
            page === i
              ? "bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white"
              : "border-[1px] border-[#BCBCBC] text-[#BCBCBC]"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    const renderFirstEllipsis = startPage > 1;
    const renderLastEllipsis = endPage < totalPages;

    return (
      <>
        {renderFirstEllipsis && (
          <button
            key="first"
            className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[0.875rem] md:h-[38px] md:w-[38px] ${
              page === 1
                ? "bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white"
                : "border-[1px] border-[#BCBCBC] text-[#BCBCBC]"
            }`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        )}
        {renderFirstEllipsis && <span>...</span>}
        {pages}
        {renderLastEllipsis && <span>...</span>}
        {renderLastEllipsis && (
          <button
            key="last"
            className={`flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[0.875rem] md:h-[38px] md:w-[38px] ${
              page === totalPages
                ? "bg-primary_color text-white"
                : "border-[1px] border-[#BCBCBC] text-[#BCBCBC]"
            }`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        )}
      </>
    );
  };

  return (
    <section className="z-0 flex flex-col-reverse justify-between gap-[1rem] md:flex-row md:items-center">
      <div className="flex items-center gap-[1rem] text-[0.875rem] md:justify-center">
        <div className="flex items-center justify-center text-[#A6A8B1]">
          <p className="flex h-[38px] w-[38px] items-center justify-center rounded-[0.5rem] bg-[#5E636614]">
            10
          </p>
          <span className="pl-[0.5rem]">Items per page</span>
        </div>
        <p className="text-[#363636]">{`${page}-${totalPages - 1} of ${
          totalEntries.length
        } items`}</p>
      </div>
      <div className="font-[500 flex flex-wrap items-center justify-center gap-[1rem] text-[0.875rem] text-gray-800">
        <button
          className={`text-[1rem] ${!hasPrevPage ? "opacity-20" : ""}`}
          disabled={!hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev
        </button>

        <div className="flex gap-[1rem]">{renderPaginationButtons()}</div>

        <button
          className={`flex gap-[1rem] font-[500] text-gray-800 ${
            !hasNextPage ? "opacity-20" : ""
          }`}
          disabled={!hasNextPage}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};
export default TablePagination;
