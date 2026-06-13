import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value ||'';

  // Protect dashboard routes
  console.log("TOKEN : ",token);
  // path
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/' || path === '/login' || path === 'signup';

    
    
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }
  if(!isPublicPath && !token){
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  if (token) {
    try {
      jwt.verify(token,process.env.JWT_SECRET);

      if (isPublicPath && token) {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    } catch(error) {
      const response = NextResponse.redirect(
        new URL("/", request.url)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
     "/dashboard",
    "/dashboard/:path*", 
    "/login",
    "/signup",
    "/profile"   
  ],
};

