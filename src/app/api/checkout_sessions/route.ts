import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "~/trpc/server";

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

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/cancel`,
    });

    // Save the order to the Prisma database
    const totalAmount = cartItems.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.quantity,
      0,
    );

    await api.order.create({
      userId,
      pricePaid: totalAmount, // Price in smallest currency unit (pence)
      productIds: cartItems.map((item) => item.id), // Assuming 'id' is the product identifier
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
