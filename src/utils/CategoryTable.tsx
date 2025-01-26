"use client";
import React, { type FC } from "react";
import type { TableProps } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "./LoadingComponent";
import TablePagination from "./TablePagination";
import Skeleton from "./Skeleton";
import { useCategoryDropdown } from "~/hooks/useDropdown";
import CategoryDropdown from "./CategoryDropdown";

const CategoryTable: FC<TableProps> = ({ page, per_page }) => {
  const categories = api.category.getAllCategories.useQuery();

  const { dropdownId, setDropdownId, dropdownRef } = useCategoryDropdown();

  // Calculate pagination values
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries =
    categories &&
    categories.data?.slice(start, end).map((entry) => ({
      id: entry.id,
      name: entry.name,
    }));

  const handleClick = (productId: string) => {
    setDropdownId((prevId) => (prevId === productId ? "" : productId));
  };

  if (categories.isPending)
    return (
      <div className="mx-auto flex w-[100%] max-w-[1440px] items-center justify-center p-4">
        <LoadingComponent />
      </div>
    );

  return (
    <>
      {categories && categories.data && categories.data.length > 0 ? (
        <section className="mt-[1rem] max-w-[1000px]">
          <div className="z-10 min-h-[50vh] overflow-y-hidden overflow-x-scroll pb-[6rem]">
            <div
              ref={dropdownRef}
              className="relative z-10 mb-[1rem] h-auto w-[1000px] rounded-[0.75rem] border-[1px] border-[#1C1C1C1A]"
            >
              <div className="category-table h-[40px]">
                <p className="truncate p-[0.75rem] text-center text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  S/N
                </p>

                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Category Name
                </p>
                <p className="truncate p-[0.75rem] text-center text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"></p>
              </div>
              {entries?.map((data, index) => (
                <div key={data.id} className="relative">
                  <div className="category-table border-t-[1px] border-t-[#1C1C1C1A] text-[#252c32]">
                    <p className="flex h-[100%] w-[100%] items-center justify-center">
                      {index}
                    </p>

                    <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {data.name}
                    </p>

                    <div className="relative flex justify-end">
                      <button
                        onClick={() => {
                          handleClick(data.id);
                        }}
                        className="flex cursor-pointer items-center justify-center truncate p-[0.75rem] text-center text-[0.875rem] font-[400]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                      </button>
                      {dropdownId === data.id && (
                        <CategoryDropdown
                          id={data.id}
                          updateL="Update Category"
                          deleteL="Delete Category"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="flex flex-wrap items-center justify-between gap-[1rem] pt-[1rem]">
            <TablePagination
              totalEntries={categories.data}
              hasNextPage={end < categories.data.length}
              hasPrevPage={start > 0}
            />
          </section>
        </section>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default CategoryTable;
