import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize  Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface RawBody {
  cartItems: CheckoutItem[];
  userId: string;
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

    // Validate the structure of the request body
    if (!cartItems || !Array.isArray(cartItems)) {
      console.error("Invalid request body:", cartItems);
      return NextResponse.json(
        { error: "Invalid request format. Expected 'cartItems' array." },
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

    // Serialize cartItems to a JSON string for metadata
    const serializedCartItems = JSON.stringify(cartItems);

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      client_reference_id: userId ? userId : "not_logged_in",
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA", "FR", "DE"],
      },
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/cancel`, // Add product IDs to the cancel URL
      metadata: {
        cartItems: serializedCartItems,
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
