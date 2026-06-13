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