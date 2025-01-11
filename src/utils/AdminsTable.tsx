"use client";
import React, { type FC } from "react";
import type { TableProps } from "~/lib/types";
import { api } from "~/trpc/react";
import LoadingComponent from "./LoadingComponent";
import TablePagination from "./TablePagination";
import Skeleton from "./Skeleton";
import AdminTableDropdown from "./AdminTableDropdown";
import { useAdminDropdown } from "~/hooks/useDropdown";
import dayjs from "~/utils/dayjsConfig";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

const AdminsTable: FC<TableProps> = ({ page, per_page }) => {
  const adminUsers = api.user.getAdminUsers.useQuery();

  const { dropdownId, setDropdownId, dropdownRef } = useAdminDropdown();

  // Calculate pagination values
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries =
    adminUsers &&
    adminUsers.data?.slice(start, end).map((entry) => ({
      id: entry.id,
      email: entry.email,
      permission: entry.permission as string,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));

  const handleClick = (productId: string) => {
    setDropdownId((prevId) => (prevId === productId ? "" : productId));
  };

  if (adminUsers.isPending)
    return (
      <div className="mx-auto flex w-[100%] max-w-[1440px] items-center justify-center p-4">
        <LoadingComponent />
      </div>
    );

  return (
    <>
      {adminUsers && adminUsers.data && adminUsers.data.length > 0 ? (
        <section className="max-w-[1000px]">
          <h2 className="font-semi-bold pb-[1rem] pt-[2rem] text-[1.5rem] text-[#252c32]">
            Existing Admins
          </h2>

          <div className="z-10 min-h-[50vh] overflow-y-hidden overflow-x-scroll pb-[6rem]">
            <div className="relative z-10 mb-[1rem] h-auto w-[1000px] rounded-[0.75rem] border-[1px] border-[#1C1C1C1A]">
              <div className="admin-table h-[40px]">
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Admin email
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Permission
                </p>

                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Created At
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Updated At
                </p>
                <p className="truncate p-[0.75rem] text-center text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"></p>
              </div>
              {entries?.map((data) => (
                <div key={data.id} className="relative">
                  <div className="admin-table border-t-[1px] border-t-[#1C1C1C1A]">
                    <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {data.email}
                    </p>
                    <p className="truncate p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {capitalizeFirstLetter(data.permission).replace("_", " ")}
                    </p>
                    <p className="truncate p-[0.75rem] text-left text-[0.75rem] leading-[1rem] text-[#252c32]">
                      {dayjs(data.createdAt).fromNow()}
                    </p>

                    <p className="truncate p-[0.75rem] text-left text-[0.75rem] leading-[1rem] text-[#252c32]">
                      {dayjs(data.updatedAt).fromNow()}
                    </p>

                    <div
                      ref={dropdownRef}
                      className="relative flex justify-end"
                    >
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
                        <AdminTableDropdown
                          id={data.id}
                          updateL="Update Admins"
                          deleteL="Delete Admins"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="pt-[1rem]">
            <TablePagination
              totalEntries={adminUsers.data}
              hasNextPage={end < adminUsers.data.length}
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

export default AdminsTable;
