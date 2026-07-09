import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb"; // Direct function to connect to MongoDB
import Blog from "@/models/Blog";  // Path to your schema file
import path from "path";
import fs from "fs/promises";
// import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  try {
    await connectDB();

    // 1. Parse incoming Form Data instead of JSON
    const formData = await request.formData();
    
    const title = formData.get("title");
    const description = formData.get("description");
    const author = formData.get("author");
    const category = formData.get("category");
    const readTime = formData.get("readTime");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const imageFile = formData.get("image"); // This grabs the actual File object

    // 2. Validation
    if (!title || !description || !imageFile || !author || !category || !readTime || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // 3. Duplicate Check
    const normalizedSlug = slug.toLowerCase().trim();
    const existingBlog = await Blog.findOne({ slug: normalizedSlug });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: "A blog with this slug already exists." },
        { status: 400 }
      );
    }

    // 4. Process and Save Image File Local to Directory
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    
    // Create a unique filename to prevent overwriting files with identical names
    const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
    
    // Define your local upload path (saves to public/uploads/)
    const uploadDir = path.join(process.cwd(), "public/images/blogs");
    const filePath = path.join(uploadDir, filename);

    // Ensure the destination directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write the file buffer to the folder
    await fs.writeFile(filePath, buffer);

    // This is the public URL path that will be saved in your DB
    const imageUrlPath = `/images/blogs/${filename}`;

    // 5. Save to database
    const newBlog = await Blog.create({
      title,
      description,
      image: imageUrlPath, // Storing the local file path string
      author,
      category,
      readTime,
      slug: normalizedSlug,
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