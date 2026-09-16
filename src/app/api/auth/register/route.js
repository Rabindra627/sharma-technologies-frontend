// app/api/signup/route.js
import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
import User from "@/models/User"; // updated schema with role + active
import { connectDB } from "@/lib/mongodb";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedEmail = body.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password securely
    // const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create new user (role defaults to "USER", active defaults to true)
    const newUser = await User.create({
      name: body.name.trim(),
      email: normalizedEmail,
      password: body.password,
      avatarUrl: body.avatarUrl || "",
      role: "USER",       // default role
      active: true,       // default active
    });

    return NextResponse.json(
      {
        message: "User registered successfully!",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          active: newUser.active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
