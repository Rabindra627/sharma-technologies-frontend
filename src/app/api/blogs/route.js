import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Blog from "@/models/Blog";  
import path from "path";
import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Safe for Vercel Free tier body limits)
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const author = formData.get("author");
    const category = formData.get("category");
    const readTime = formData.get("readTime");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const imageFile = formData.get("image"); 

    // Validation
    if (!title || !description || !imageFile || !author || !category || !readTime || !slug || !content) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    if (!ALLOWED_FILE_TYPES.includes(imageFile.type)) {
      return NextResponse.json({ success: false, message: "Invalid file type. Only JPG, PNG, and WebP allowed." }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: "File size exceeds the 4MB limit." }, { status: 400 });
    }

    const normalizedSlug = slug.toLowerCase().trim();
    const existingBlog = await Blog.findOne({ slug: normalizedSlug });
    if (existingBlog) {
      return NextResponse.json({ success: false, message: "A blog with this slug already exists." }, { status: 400 });
    }

    // Process File Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let imageUrlPath = "";

    // Check environment context
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // PRODUCTION RUNTIME: Upload directly to your Cloudinary storage
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blogs", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrlPath = cloudinaryResponse.secure_url;
    } else {
      // LOCAL RUNTIME: Save inside your local machine structure
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
      const uploadDir = path.join(process.cwd(), "public/images/blogs");
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      
      imageUrlPath = `/images/blogs/${filename}`;
    }

    // Save configuration to MongoDB
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

    return NextResponse.json({ success: true, message: "Blog post created successfully!", data: newBlog }, { status: 201 });

  } catch (error) {
    console.error("Upload handler failed:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}

// GET remains perfectly identical across both environments
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const category = searchParams.get("category");

    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).lean(),
      Blog.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      count: blogs.length,
      pagination: { totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit) },
      data: blogs,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error", error: error.message }, { status: 500 });
  }
}