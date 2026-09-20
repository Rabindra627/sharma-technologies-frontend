import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function PUT(request, { params }) {
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

    const {
      title,
      description,
      author,
      category,
      readTime,
      slug,
      content,
    } = body;

    // Validate fields
    if (
      !title ||
      !description ||
      !author ||
      !category ||
      !readTime ||
      !slug ||
      !content
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const normalizedSlug = slug
      .toLowerCase()
      .trim();

    // Check duplicate slug
    const existingBlog = await Blog.findOne({
      slug: normalizedSlug,
      _id: { $ne: id },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another blog already uses this slug.",
        },
        { status: 400 }
      );
    }

    // Find blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found.",
        },
        { status: 404 }
      );
    }

    // Update fields
    blog.title = title.trim();
    blog.description = description.trim();
    blog.author = author.trim();
    blog.category = category.trim();
    blog.readTime = readTime.trim();
    blog.slug = normalizedSlug;
    blog.content = content.trim();

    await blog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully!",
        data: blog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Blog Error:", error);

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