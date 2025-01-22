import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "~/trpc/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const config = {
  api: {
    bodyParser: false, // Disable Next.js' default body parsing to handle raw body
  },
};

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature") ?? "";

    // Convert NextRequest body (ReadableStream) to Buffer
    const rawBody = await req.arrayBuffer(); // Read the stream as ArrayBuffer
    const buffer = Buffer.from(rawBody); // Convert ArrayBuffer to Buffer

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Check if the payment was successful
        if (session.payment_status === "paid") {
          const userId = session.client_reference_id; // Assumes you passed userId in the session
          const totalAmount = session.amount_total; // Total amount in the smallest currency unit (e.g., cents)

          if (
            userId &&
            totalAmount &&
            session.shipping_details?.address &&
            session.metadata?.orderId
          ) {
            await api.order.updateOrder({
              id: session.metadata.orderId, // Ensure `id` corresponds to the order ID
              amount_paid: totalAmount, // Correct field name
              status: "pending", // Update the status
              paid: true, // Indicate the order is paid
              shippingDetails: {
                name: session.shipping_details?.name ?? "",
                email: session.customer_email ?? "",
                street: [
                  session.shipping_details?.address?.line1,
                  session.shipping_details?.address?.line2, // Optional line 2
                ]
                  .filter(Boolean)
                  .join(" "), // Combine street lines into a single string
                city: session.shipping_details?.address?.city ?? "",
                state: session.shipping_details?.address?.state ?? "",
                zipCode: session.shipping_details?.address?.postal_code ?? "",
                country: session.shipping_details?.address?.country ?? "",
              },
            });

            console.log("Order created successfully after payment.");
          } else {
            console.error("Missing required information in session metadata.");
          }
        } else {
          console.log("Payment failed, no order created.");
        }
        break;
      }

      // Add more event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
