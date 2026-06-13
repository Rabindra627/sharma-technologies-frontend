import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/signup";

      // authenticated users shouldn't see auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // unauthenticated users can't see protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/", request.url)
      );

      response.cookies.delete("token");
      return response;
    }
  }



  return NextResponse.next();
}