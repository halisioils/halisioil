import { useSearchParams } from "next/navigation";
import React from "react";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/formatCurrency";
import Skeleton from "~/utils/Skeleton";
import dayjs from "~/utils/dayjsConfig";
import TablePagination from "~/utils/TablePagination";

const Orders = () => {
  const searchParams = useSearchParams();
  const orders = api.order.getAllOrders.useQuery();

  const page = parseInt(searchParams.get("page") ?? "1", 10); // Ensure page is a number
  const per_page = 10;

  // Calculate pagination values
  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries =
    orders &&
    orders.data?.slice(start, end).map((order) => {
      const {
        id,
        amount_paid,
        userId,
        paid,
        status,
        createdAt,
        updatedAt,
        shipping_name,
        shipping_email,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zipCode,
        shipping_country,
        lineItems,
      } = order;

      // Combine address fields
      const address = [
        shipping_name,
        shipping_email,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zipCode,
        shipping_country,
      ]
        .filter(Boolean)
        .join(", ");

      // Map line items
      const items =
        lineItems?.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })) || [];

      return {
        id,
        amount_paid,
        userId,
        paid,
        status,
        createdAt,
        updatedAt,
        shipping_name,
        shipping_email,
        address,
        items,
      };
    });

  const transformedOrders =
    orders.data?.map((order) => ({
      id: order.id,
      status: order.status || "AVAILABLE", // Provide a default status if missing
      description: "No description provided", // Placeholder for description
      name: "Unnamed Product", // Placeholder for name
      price: order.amount_paid ?? 0, // Use pricePaid or 0 as default
      categoryIds: [], // Default empty array for categoryIds
      properties: [], // Default empty array for properties
    })) ?? [];

  console.log(entries);

  return (
    <>
      {orders && orders.data && orders.data.length > 0 ? (
        <section className="max-w-[1000px]">
          <section className="my-[1rem]"></section>
          <section className="z-10 min-h-[50vh] overflow-y-hidden overflow-x-scroll pb-[6rem]">
            <div className="relative z-10 mb-[1rem] h-auto w-[1000px] rounded-[0.75rem] border-[1px] border-[#1C1C1C1A]">
              <div className="order-table h-[40px]">
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Id
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  User details
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Paid
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  pricePaid
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Status
                </p>
                <p className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]">
                  Created At
                </p>
              </div>
              {entries?.map((data) => (
                <div key={data.id} className="relative">
                  <div className="order-table border-t-[1px] border-t-[#1C1C1C1A] text-[#252c32]">
                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {data.id}
                    </p>
                    <p className="whitespace-normal break-words p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {data.address}
                    </p>
                    <p
                      className={`break-words p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32] ${
                        data.paid === true
                          ? "bg-[#0D875A1A] text-[#0D875A]"
                          : data.paid === false
                            ? "bg-[#AC0F051A] text-[#AC0F05]"
                            : ""
                      }`}
                    >
                      {data.paid === true
                        ? "YES"
                        : data.paid === false
                          ? "NO"
                          : "N/A"}
                    </p>

                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {formatCurrency(Number(data.amount_paid))}
                    </p>
                    <p
                      className={`my-[0.5rem] h-fit truncate rounded-[5rem] px-[1rem] py-[0.2rem] text-left text-[0.875rem] font-[400] ${
                        data.status === "pending"
                          ? "bg-[#BC8A091A] text-[#BC8A09]"
                          : data.status === "pending"
                            ? "bg-[#AC0F051A] text-[#AC0F05]"
                            : data.status === "AVAILABLE"
                              ? "bg-[#0D875A1A] text-[#0D875A]"
                              : data.status === "COMING_SOON"
                                ? "bg-[#0077B61A] text-[#0077B6]"
                                : ""
                      }`}
                    >
                      {data.status.charAt(0).toUpperCase() +
                        data.status.slice(1).replace("_", " ")}
                    </p>
                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400] text-[#252c32]">
                      {dayjs(data.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="flex w-[100%] flex-wrap items-center justify-between gap-[1rem] pt-[1rem]">
            <TablePagination
              totalEntries={transformedOrders}
              hasNextPage={end < orders.data.length}
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

export default Orders;
