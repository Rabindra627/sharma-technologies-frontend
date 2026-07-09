import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import Blog from "@/models/Blog";  
import path from "path";
import fs from "fs/promises";
import cloudinary from "@/lib/cloudinary";

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
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    if (process.env.NODE_ENV === "production") {
      // --- PRODUCTION ENVIRONMENT: Upload to Cloudinary ---
      // Convert buffer to Base64 to stream upload directly to Cloudinary without local disk storage
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
      
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "blogs", // Organizes files into a 'blogs' folder inside Cloudinary
      });

      imageUrlPath = uploadResponse.secure_url; // Use Cloudinary HTTPS URL
    } else {
      // --- DEVELOPMENT ENVIRONMENT: Save Locally ---
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
      const uploadDir = path.join(process.cwd(), "public/images/blogs");
      const filePath = path.join(uploadDir, filename);

      // Ensure directory exists and write file
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);

      imageUrlPath = `/images/blogs/${filename}`; // Relative public path
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
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// GET handler remains unchanged...
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