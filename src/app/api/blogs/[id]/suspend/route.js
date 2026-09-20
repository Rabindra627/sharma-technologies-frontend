import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog ID is required.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const suspended = Boolean(body.suspended);

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        suspended,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: suspended
          ? "Blog suspended successfully."
          : "Blog activated successfully.",
        data: blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Suspend Blog Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}