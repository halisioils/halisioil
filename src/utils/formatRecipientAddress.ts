import type Stripe from "stripe";

export const formatRecipientAddress = (
  shipping_details: Stripe.Checkout.Session["shipping_details"],
) => {
  if (!shipping_details?.address) return "";

  const { name, address } = shipping_details;
  const { line1, line2, city, state, postal_code, country } = address;

  return `${name}, 
      ${line1} 
      ${line2 ? line2 + ", " : ""} 
      ${city}, 
      ${state ? state + ", " : ""} 
      ${postal_code}, 
      ${country}`;
};
