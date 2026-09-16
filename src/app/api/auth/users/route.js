import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const token = (await cookies()).get("token")?.value;
    
    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODE : ", decoded);
    // Optional: Admin-only access
    // if (decoded.role !== "admin") {
    //   return Response.json(
    //     { message: "Forbidden" },
    //     { status: 403 }
    //   );
    // }

    
    const users = await User.find({});

    return Response.json(users);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, active, avatarUrl } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
      active: typeof active === "boolean" ? active : true,
      avatarUrl: avatarUrl || undefined,
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
}