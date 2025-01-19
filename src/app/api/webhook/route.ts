import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "~/trpc/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Check if the payment was successful
        if (session.payment_status === "paid") {
          const userId = session.client_reference_id; // Assumes you passed userId in the session
          const productIds = session.metadata?.product_ids?.split(","); // Assumes product IDs are stored in metadata
          const totalAmount = session.amount_total; // Total amount in smallest currency unit (pence)

          console.log(session.metadata);

          if (userId && productIds && totalAmount) {
            // Create the order in the database
            await api.order.create({
              userId,
              pricePaid: totalAmount,
              productIds,
              paid: true,
              // Assuming address details are in metadata, modify as per your implementation
              street: session.metadata?.street,
              city: session.metadata?.city,
              state: session.metadata?.state,
              zipCode: session.metadata?.zip_code,
              country: session.metadata?.country,
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
      case "payment_intent.succeeded":
        console.log("Payment intent succeeded.");
        break;

      case "payment_intent.payment_failed":
        console.log("Payment intent failed.");
        break;

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
