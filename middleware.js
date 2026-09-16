import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/signup";

  // 1. Unauthenticated users can't see protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Authenticated users shouldn't see auth pages
  if (isPublicPath && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // If USER → keep them on landing page, hide login/signup
      if (payload.role === "USER") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // If ADMIN → send them to dashboard
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 3. Token verification for protected pages
  if (token && !isPublicPath) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Role-based access control
      if (path.startsWith("/admin") && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (path.startsWith("/dashboard") && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      if (
        (path.startsWith("/blogs") ||
         path.startsWith("/comments") ||
         path.startsWith("/ratings")) &&
        payload.role !== "USER"
      ) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

    } catch (error) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Apply middleware only to relevant routes
export const config = {
  matcher: [
    "/", 
    "/login", 
    "/signup", 
    "/dashboard/:path*", 
    "/admin/:path*", 
    "/blogs/:path*", 
    "/comments/:path*", 
    "/ratings/:path*"
  ]
};
