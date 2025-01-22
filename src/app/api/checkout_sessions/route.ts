import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "~/trpc/server";
import { type Address } from "~/lib/types";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface RawBody {
  cartItems: CheckoutItem[];
  userId: string;
  address: Address;
}

type CheckoutItem = {
  id: string;
  quantity: number;
  name: string;
  price: number; // Price in pounds
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { cartItems, userId } = (await req.json()) as RawBody;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid request format. 'cartItems' must be a non-empty array.",
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid request format. 'userId' is required." },
        { status: 400 },
      );
    }

    // Transform the items into Stripe's expected format
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert price from pounds to pence
      },
      quantity: item.quantity,
    }));

    // Create an order in the database
    let data;
    try {
      data = await api.order.create({
        userId,
        cartItems,
      });
    } catch (err) {
      console.error("Error creating order:", err);
      return NextResponse.json(
        { error: "Failed to create order." },
        { status: 500 },
      );
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA", "FR", "DE"], // Use a smaller list unless required
      },
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/cancel`,
      metadata: {
        orderId: data.id,
      },
    });

    // Return the session URL
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe session." },
      { status: 500 },
    );
  }
}
