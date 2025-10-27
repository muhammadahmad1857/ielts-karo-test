import { NextRequest, NextResponse } from "next/server";
import { isSuperAdmin } from "./dal/auth/users";

export  function middleware(request: NextRequest): NextResponse {
  // Get the "token" cookie from the request
  const token = request.cookies.get("token");
  const isLoggedIn = token !== undefined;

  // Get the current pathname from the request URL
  const pathname = request.nextUrl.pathname;

  // 🧩 1. Super admin route protection
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      // Not logged in → redirect to /auth
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Await the async function
    // const isAdmin = await isSuperAdmin();
    // console.log("isAdmin", isAdmin);
    // if (!isAdmin) {
    //   // Logged in but not super admin → redirect to home
    //   return NextResponse.redirect(new URL("/abc", request.url));
    // }

    // Super admin → allow access
    return NextResponse.next();
  }

  // 🧩 2. Prevent logged-in users from accessing /auth routes
  if (isLoggedIn && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🧩 3. Prevent non-logged-in users from accessing protected pages
  if (!isLoggedIn && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // 🧩 4. Allow all other cases
  return NextResponse.next();
}

// Configure middleware to run only on page requests
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
