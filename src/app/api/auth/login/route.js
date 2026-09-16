// app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User"; // updated schema with role + active
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 });
    }

    // Check if account is active
    if (!user.active) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 403 });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 });
    }

    // Generate JWT with role claim (no password in payload!)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Build response
    const response = NextResponse.json(
      {
        message: "Authentication successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
