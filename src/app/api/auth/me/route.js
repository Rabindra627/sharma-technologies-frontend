// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Return safe user info (no password)
    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    // Invalid/expired token → clear cookie
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete("token");
    return response;
  }
}
