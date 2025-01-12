import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { api } from "~/trpc/server";

export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const apiUrl = `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}`;

  if (!user?.email) {
    throw new Error("Something went wrong");
  }

  // Ensure you await the call to resolve the promise
  let dbUser = await api.user.getLoggedInUser({ email: user.email });

  if (!dbUser) {
    // Await the creation of the user
    dbUser = await api.user.create({ email: user.email });
  }

  // Redirect to the root pathname
  return NextResponse.redirect(new URL(apiUrl, request.url));
}
