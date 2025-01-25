import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { api } from "~/trpc/server";

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    throw new Error("Something went wrong");
  }

  // Ensure you await the call to resolve the promise
  let dbUser = await api.user.getLoggedInUser({ email: user.email });

  if (!dbUser) {
    // Await the creation of the user
    dbUser = await api.user.create({ email: user.email });
  }

  // Get the redirect URL from the query parameters (if it exists)
  const redirectTo =
    request.nextUrl.searchParams.get("halisi_redirectTo") ?? "/";

  // Redirect to the specified URL (or root if not specified)
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
