import { type Order } from "~/lib/types";

export const calculateTotalRevenue = (filteredOrders: Order[]) => {
  return filteredOrders.reduce(
    (total, order) => total + (order.stripe_Session?.amount_total ?? 0),
    0,
  );
};
