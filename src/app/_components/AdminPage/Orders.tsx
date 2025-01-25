"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { formatCurrency } from "~/utils/formatCurrency";
import Skeleton from "~/utils/Skeleton";
import dayjs from "~/utils/dayjsConfig";
import TablePagination from "~/utils/TablePagination";
import LoadingComponent from "~/utils/LoadingComponent";
import type Stripe from "stripe";
import { formatCartItems } from "~/utils/formatCartItems";
import { formatRecipientAddress } from "~/utils/formatRecipientAddress";
import { paidStyles } from "~/utils/utilityStyles";
import StatusToggle from "~/utils/StatusToggle";

const Orders = () => {
  const searchParams = useSearchParams();
  const orders = api.order.getAllOrders.useQuery();

  console.log(orders.data);

  const [orderStatuses, setOrderStatuses] = useState(
    orders.data?.reduce(
      (acc, order) => {
        acc[order.id] = order.status;
        return acc;
      },
      {} as Record<string, string>,
    ) ?? {},
  );

  const page = parseInt(searchParams.get("page") ?? "1", 10); // Ensure page is a number
  const perPage = 10;

  // Calculate pagination values
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const entries =
    orders.data?.slice(start, end).map((order) => {
      const { id, userId, status, createdAt, stripe_Session } = order;

      // Validate and parse stripe_Session
      const isValidStripeSession = (
        session: unknown,
      ): session is Stripe.Checkout.Session =>
        typeof session === "object" &&
        session !== null &&
        "id" in session &&
        "object" in session;

      const parsedStripeSession = isValidStripeSession(stripe_Session)
        ? stripe_Session
        : null;

      return {
        id,
        userId,
        status,
        createdAt,
        stripe_Session: parsedStripeSession,
      };
    }) ?? [];

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const transformedOrders =
    orders.data?.map((order) => ({
      id: order.id,
      status: order.status || "AVAILABLE", // Provide a default status if missing
      description: "No description provided", // Placeholder for description
      name: "Unnamed Product", // Placeholder for name
      categoryIds: [], // Default empty array for categoryIds
      properties: [], // Default empty array for properties
    })) ?? [];

  if (orders.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {entries.length > 0 ? (
        <section className="max-w-[1000px]">
          <section className="z-10 min-h-[50vh] overflow-x-auto pb-[6rem]">
            <div className="relative z-10 mb-[1rem] w-[1000px] rounded-[0.75rem] border-[1px] border-[#1C1C1C1A]">
              <div className="order-table h-[40px]">
                {[
                  "Order ID",
                  "Date",
                  "Paid",
                  "Status",
                  "Recipient",
                  "Product",
                ].map((header) => (
                  <p
                    key={header}
                    className="truncate p-[0.75rem] text-left text-[0.75rem] font-semibold leading-[1rem] text-[#84919A]"
                  >
                    {header}
                  </p>
                ))}
              </div>
              {entries.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className="order-table border-t-[1px] border-t-[#1C1C1C1A] text-[#252c32]">
                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400]">
                      {entry.stripe_Session?.id}
                    </p>
                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400]">
                      {dayjs(entry.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </p>

                    <p
                      className={`mx-[0.5rem] p-[0.75rem] text-left text-[0.875rem] font-[400] ${paidStyles(
                        entry.stripe_Session?.payment_status.toLowerCase() ??
                          "unknown",
                      )}`}
                    >
                      {entry.stripe_Session?.payment_status}
                    </p>
                    <StatusToggle
                      id={entry.id}
                      selectedStatus={orderStatuses[entry.id] ?? "pending"}
                      onStatusChange={(newStatus) =>
                        updateOrderStatus(entry.id, newStatus)
                      }
                    />
                    <p className="whitespace-normal break-words p-[0.75rem] text-left text-[0.875rem] font-[400]">
                      {`${formatRecipientAddress(
                        entry.stripe_Session?.shipping_details
                          ? entry.stripe_Session?.shipping_details
                          : null,
                      )}, ${entry.stripe_Session?.customer_details?.email} ${entry.stripe_Session?.customer_details?.phone ? entry.stripe_Session?.customer_details?.phone : ""}`}
                    </p>

                    <p className="break-words p-[0.75rem] text-left text-[0.875rem] font-[400]">
                      {` ${formatCartItems(
                        entry.stripe_Session?.metadata?.cartItems,
                      )}, Amount Total: ${entry.stripe_Session?.amount_total ? formatCurrency(entry.stripe_Session.amount_total / 100) : "0.00"}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <TablePagination
            totalEntries={transformedOrders}
            hasNextPage={end < (orders.data?.length ?? 0)}
            hasPrevPage={start > 0}
          />
        </section>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default Orders;
