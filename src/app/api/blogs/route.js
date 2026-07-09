import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Blog from "@/models/Blog";  
import path from "path";
import fs from "fs/promises";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

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

    // 4. Handle Hybrid Image Upload (Local vs Production)
    let imageUrlPath = "";
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (process.env.NODE_ENV === "production") {
      // --- PRODUCTION ENVIRONMENT: Upload via Stream (Cloudinary v2 compatible) ---
      imageUrlPath = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "image/blogs", // Cloudinary v2 does not accept a leading slash (/)
            resource_type: "auto",  // Ensures standard image buffers map correctly
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        
        // Correctly pipe/end the buffer directly to the stream
        uploadStream.end(buffer);
      });

    } else {
      // --- DEVELOPMENT ENVIRONMENT: Save Locally ---
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
      const uploadDir = path.join(process.cwd(), "public/images/blogs");
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);

      imageUrlPath = `/images/blogs/${filename}`;
    }

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
    // Modified to grab the exact native error message structure Cloudinary throws
    return NextResponse.json(
      { 
        success: false, 
        message: "Server Error", 
        error: error.message || (error.error ? error.error.message : String(error)) 
      },
      { status: 500 }
    );
  }
}

// GET handler
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const category = searchParams.get("category");

    const filter = {};
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

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