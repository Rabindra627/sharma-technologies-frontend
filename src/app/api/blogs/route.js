import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb"; // Direct function to connect to MongoDB
import Blog from "@/models/Blog";  // Path to your schema file

export async function POST(request) {
  try {
    // Ensure database connection is active
    await connectDB();

    const body = await request.json();
    const { title, description, image, author, category, readTime, slug, content } = body;

    // 1. Validation
    if (!title || !description || !image || !author || !category || !readTime || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // 2. Duplicate Check
    const existingBlog = await Blog.findOne({ slug: slug.toLowerCase().trim() });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: "A blog with this slug already exists." },
        { status: 400 }
      );
    }

    // 3. Save to database
    const newBlog = await Blog.create({
      title,
      description,
      image,
      author,
      category,
      readTime,
      slug,
      content
    });

    return NextResponse.json(
      { success: true, message: "Blog post created successfully!", data: newBlog },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
// GET : getAll blogs
export async function GET(request) {
  try {
    await connectDB();

    // 1. Extract query params from URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const category = searchParams.get("category");

    // 2. Build the query filter
    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // 3. Fetch data
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalBlogs = await Blog.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        count: blogs.length,
        pagination: {
          totalBlogs,
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBlogs / parseInt(limit)),
        },
        data: blogs,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}