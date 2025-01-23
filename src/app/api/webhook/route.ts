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

        const userId = session.client_reference_id; // Assumes you passed userId

        try {
          // Create the order with explicit typing for stripe_Session
          await api.order.create({
            userId: userId ?? "",
            stripe_Session: session as unknown as Record<string, unknown>,
          });

          console.log("Order created successfully after payment.");
        } catch (parseError) {
          console.error(
            "Missing required information in session metadata.",
            parseError,
          );
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
