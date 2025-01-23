"use client";
import React from "react";
import type Stripe from "stripe";
import { api } from "~/trpc/react";
import { capitalizeFirstLetter } from "~/utils/capitalizeFirstLetter";
import dayjs from "~/utils/dayjsConfig";
import { formatCartItems } from "~/utils/formatCartItems";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatRecipientAddress } from "~/utils/formatRecipientAddress";
import LoadingComponent from "~/utils/LoadingComponent";
import { statusStyles } from "~/utils/utilityStyles";

const Order = ({ userId }: { userId: string }) => {
  const orders = api.order.getAllOrdersByAUser.useQuery({ userId });

  const page = 1;
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

  if (orders.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <section className="my-[2rem] max-w-[1000px]">
      {entries.map((entry) => (
        <div key={entry.id}>
          <div className="pb-[1rem]">
            <h3 className="text-[1.2rem] font-semibold">
              {dayjs(entry.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </h3>
          </div>
          <div className="relative border-b-[1px] border-b-[#1C1C1C1A] pb-[1rem] text-[#252c32] md:flex md:gap-[1rem]">
            <div className="pb-[0.5rem]">
              <p
                className={`mb-[1rem] w-fit rounded-[1rem] px-[1rem] font-[400] ${statusStyles(entry.status)}`}
              >
                {capitalizeFirstLetter(entry.status).replace("_", " ")}
              </p>

              <p className="font-[400]">
                {`${formatRecipientAddress(
                  entry.stripe_Session?.shipping_details
                    ? entry.stripe_Session?.shipping_details
                    : null,
                )}, ${entry.stripe_Session?.customer_details?.email} ${entry.stripe_Session?.customer_details?.phone ? entry.stripe_Session?.customer_details?.phone : ""}`}
              </p>
            </div>

            <p className="font-medium text-[#333333]">
              {` ${formatCartItems(
                entry.stripe_Session?.metadata?.cartItems,
              )}, Amount Total: ${entry.stripe_Session?.amount_total ? formatCurrency(entry.stripe_Session.amount_total / 100) : "0.00"}`}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Order;
