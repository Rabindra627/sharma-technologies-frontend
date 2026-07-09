import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Blog from "@/models/Blog";  
import path from "path";
import fs from "fs/promises";
import { getCloudinary } from "next-cloudinary"; 

// Constants & Production Guardrails
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Safely under Vercel Free Tier 4.5MB payload limit)
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// POST: Create a Blog Post (Supports Hybrid Environment Logic)
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

    // 2. Comprehensive Field Validation
    if (!title || !description || !imageFile || !author || !category || !readTime || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // 3. Security & Resource Guardrails (File Size & Format Checking)
    if (!ALLOWED_FILE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds the 4MB serverless threshold limit." },
        { status: 400 }
      );
    }

    // 4. Duplicate Entry Safeguard
    const normalizedSlug = slug.toLowerCase().trim();
    const existingBlog = await Blog.findOne({ slug: normalizedSlug });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: "A blog with this slug already exists." },
        { status: 400 }
      );
    }

    // 5. ArrayBuffer Conversion for Streaming Channels
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let imageUrlPath = "";

    // 6. Dynamic Environment Splitтер (Vercel vs Local Machine)
    if (process.env.NODE_ENV === "production") {
      // PRODUCTION (Vercel Node Engine): Pipes stream into next-cloudinary
      const cloudinaryInstance = getCloudinary();

      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinaryInstance.uploader.upload_stream(
          { 
            folder: "blogs", 
            resource_type: "image" 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrlPath = cloudinaryResponse.secure_url;
    } else {
      // DEVELOPMENT (Local Server): Saves inside your local public directory path
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
      const uploadDir = path.join(process.cwd(), "public/images/blogs");
      const filePath = path.join(uploadDir, filename);

      // Ensure directory pathway tree exists locally
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      
      imageUrlPath = `/images/blogs/${filename}`;
    }

    // 7. Instantiate and Save document inside MongoDB
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
    console.error("Critical execution breakdown:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch and Paginate all Blog entries
export async function GET(request) {
  try {
    await connectDB();

    // 1. URL Parameter Parsing
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const category = searchParams.get("category");

    // 2. Query Assembly
    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // 3. Parallel DB Operations (Optimizes network blocking speeds)
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean(), // Converts heavy Mongoose objects to light POJOs
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