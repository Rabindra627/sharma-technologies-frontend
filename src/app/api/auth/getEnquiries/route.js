import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Contact from "@/models/Contact"; // Adjust import path to match your project

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch every single document, sorted with newest first
    const allEnquiries = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: allEnquiries.length,
      data: allEnquiries,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch all enquiries",
      error: error.message,
    }, { status: 500 });
  }
}