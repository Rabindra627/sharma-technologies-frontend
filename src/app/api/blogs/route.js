import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Blog from "@/models/Blog";  
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

// --- POST HANDLER (Create Blog Post) ---
export async function POST(request) {
  try {
    await connectDB();
    
    // 1. Parse incoming Form Data
    const formData = await request.formData();
    
    const title = formData.get("title");
    const description = formData.get("description");
    const author = formData.get("author");
    const category = formData.get("category");
    const readTime = formData.get("readTime");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const imageFile = formData.get("image"); 

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

    // 4. Handle Image Upload (Local Disk Storage)
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
    const uploadDir = path.join(process.cwd(), "public/images/blogs");
    const filePath = path.join(uploadDir, filename);

    // Ensure directory exists and write file
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const imageUrlPath = `/images/blogs/${filename}`;

    // 5. Save to database
    const newBlog = await Blog.create({
      title,
      description,
      image: imageUrlPath, 
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
      { 
        success: false, 
        message: "Server Error", 
        error: error.message || String(error) 
      },
      { status: 500 }
    );
  }
}

// --- GET HANDLER (Fetch Blog Posts) ---
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Ensure base numbers are evaluated correctly
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const category = searchParams.get("category");

    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // Execute queries in parallel to speed up execution time
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Blog.countDocuments(filter)
    ]);

    return NextResponse.json(
      {
        success: true,
        count: blogs.length,
        pagination: {
          totalBlogs,
          currentPage: page,
          totalPages: Math.ceil(totalBlogs / limit),
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