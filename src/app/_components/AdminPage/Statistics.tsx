"use client";
import React from "react";
import { api } from "~/trpc/react";
import type Stripe from "stripe";
import { raleway } from "~/utils/font";
import { type Order } from "~/lib/types";
import { calculateTotalRevenue } from "~/utils/calculateTotalRevenue";
import { formatCurrency } from "~/utils/formatCurrency";

const Statistics = () => {
  const orders = api.order.getAllOrders.useQuery();

  const entries: Order[] =
    orders.data?.map((order) => {
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
        createdAt: new Date(createdAt), // Ensure createdAt is a Date object
        stripe_Session: parsedStripeSession,
      };
    }) ?? [];

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const firstDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );
    const lastDayOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6),
    );
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayOrders = entries.filter((order) => isToday(order.createdAt));
  const weekOrders = entries.filter((order) => isThisWeek(order.createdAt));
  const monthOrders = entries.filter((order) => isThisMonth(order.createdAt));

  const todayRevenue = calculateTotalRevenue(todayOrders);
  const weekRevenue = calculateTotalRevenue(weekOrders);
  const monthRevenue = calculateTotalRevenue(monthOrders);

  return (
    <section>
      <section className="my-[2rem]">
        <h2
          className={`text-[1.5rem] font-semibold leading-[1rem] text-[#84919A] ${raleway.className}`}
        >
          Orders
        </h2>
        <div className="my-[1rem] flex flex-col items-center justify-between gap-[1rem] md:flex-row">
          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">Today</h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {todayOrders.length}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`${todayOrders.length} orders today`}</p>
          </div>

          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">
              This Week
            </h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {weekOrders.length}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`${weekOrders.length} orders this week`}</p>
          </div>

          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">
              This Month
            </h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {monthOrders.length}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`${monthOrders.length} orders this month`}</p>
          </div>
        </div>
      </section>
      <section className="my-[2rem]">
        <h2
          className={`text-[1.5rem] font-semibold leading-[1rem] text-[#84919A] ${raleway.className}`}
        >
          Revenue
        </h2>
        <div className="my-[1rem] flex flex-col items-center justify-between gap-[1rem] md:flex-row">
          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">Today</h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {formatCurrency(todayRevenue / 100)}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`Made on orders ${todayOrders.length} today`}</p>
          </div>

          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">
              This Week
            </h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {formatCurrency(weekRevenue / 100)}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`Made on orders ${weekOrders.length}  this week`}</p>
          </div>

          <div className="bg-white-200 flex h-full w-full flex-col items-center justify-between gap-[1rem] rounded-md border border-gray-100 bg-opacity-70 bg-clip-padding py-[1rem] backdrop-blur-3xl backdrop-filter">
            <h2 className="text-[1rem] font-semibold text-[#333333]">
              This Month
            </h2>

            <h3 className="text-[2rem] font-bold text-[#B88E2F]">
              {formatCurrency(monthRevenue / 100)}
            </h3>
            <p className="text-[0.875rem] font-medium text-[#84919A]">{`Made on orders ${monthOrders.length} this month`}</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Statistics;
