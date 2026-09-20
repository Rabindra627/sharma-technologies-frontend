import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    // Only allow ADMIN for blog management
    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);

    const response = NextResponse.json(
      {
        authenticated: false,
        user: null,
        message: "Invalid or expired session",
      },
      { status: 401 }
    );

    // Remove invalid/expired cookie
    response.cookies.delete("token");

    return response;
  }
}