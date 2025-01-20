type ChectOutItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
};

// Define the expected structure of the API response for success
interface CheckoutResponse {
  url?: string; // URL for the Stripe checkout session
  error?: string; // If there is an error message
}

// Define the expected structure of the error response
interface ErrorResponse {
  error: string; // Error message from the server
}

export const handleCheckout = async (
  cartItems: ChectOutItem[],
  userId: string,
): Promise<void> => {
  try {
    // Preparing the data based on the cartItems
    const cartItemsData = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Sending a POST request to your checkout API endpoint
    const response = await fetch(`/api/checkout_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        cartItems: cartItemsData,
        userId: userId,
      }),
    });

    if (response.ok) {
      // Safely cast the response data to CheckoutResponse type
      const data: CheckoutResponse =
        (await response.json()) as CheckoutResponse;

      // Redirect to Stripe checkout page (URL is returned in the response)
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed: No URL returned.");
      }
    } else {
      // Handle error by casting the error response
      const errorData: ErrorResponse = (await response.json()) as ErrorResponse;
      console.error("Checkout API error:", errorData.error);
    }
  } catch (error) {
    console.error("Error during checkout:", error);
  }
};
