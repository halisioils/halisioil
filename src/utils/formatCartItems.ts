import { formatCurrency } from "./formatCurrency";

export function formatCartItems(cartItemsJson?: string): string {
  if (!cartItemsJson) return "No items in the cart";

  try {
    // Parse the cart items JSON string
    const cartItems = JSON.parse(cartItemsJson) as {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];

    // Map each item to a readable format
    return cartItems
      .map(
        (item) =>
          `x${item.quantity} ${item.name} (${formatCurrency(item.price)})`,
      )
      .join(", ");
  } catch (error) {
    return "Invalid cart data";
  }
}
