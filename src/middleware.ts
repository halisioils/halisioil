import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin", "/dashboard"], // Restrict middleware to only these paths
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { getUser, getPermission } = getKindeServerSession();

  const user = await getUser();

  // Get permissions for admin and super admin
  const super_admin_permission = await getPermission("SUPER_ADMIN");
  const admin_permission = await getPermission("ADMIN_USER");

  const adminUser =
    admin_permission?.isGranted === true ||
    super_admin_permission?.isGranted === true;
  const superAdminUser = super_admin_permission?.isGranted === true;

  // Handle /admin path
  if (pathname === "/admin") {
    // If user is not logged in, redirect to login with post_login_redirect URL
    if (!user) {
      const loginRedirectUrl = new URL(
        `/api/auth/login?post_login_redirect_url=/api/auth/creation?halisi_redirectTo=${encodeURIComponent("/admin")}`,
        request.url,
      );
      return NextResponse.redirect(loginRedirectUrl, { status: 303 });
    }

    // Check permissions and redirect if not granted
    if (!(adminUser || superAdminUser)) {
      const unauthorizedUrl = new URL(`/`, request.url);
      return NextResponse.redirect(unauthorizedUrl, { status: 303 });
    }
  }
  // Handle /dashboard path
  if (pathname === "/dashboard" && !user) {
    const loginRedirectUrl = new URL(
      `/api/auth/login?post_login_redirect_url=/api/auth/creation?halisi_redirectTo=${encodeURIComponent("/dashboard")}`,
      request.url,
    );
    return NextResponse.redirect(loginRedirectUrl, { status: 303 });
  }

  // Allow the request to continue for other cases
  return NextResponse.next();
}
