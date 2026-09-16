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
    // Optional: You could validate the token here too before redirecting
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Token verification for protected pages
  if (token && !isPublicPath) {
    try {
      // Secret must be encoded into a Uint8Array for 'jose'
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch (error) {
      // If token is invalid/expired, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Ensure the matcher catches ALL routes you want to protect or redirect from
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*'
  ]
};