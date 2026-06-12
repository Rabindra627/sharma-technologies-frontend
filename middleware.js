import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Protect dashboard routes

  // path
    const path = request.nextUrl.pathname;
    const isProtected = path.startsWith("/dashboard");

    const isAuthPage = path === "/login";
    
  if (
    !token &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }
  if (token) {
    try {
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      if (isAuthPage) {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("token");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
  ],
};

