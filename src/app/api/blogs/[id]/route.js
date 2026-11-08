import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload buffer stream to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "blogs") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

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

    // 1. Parse FormData instead of request.json() to support image uploads
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const author = formData.get("author");
    const category = formData.get("category");
    const readTime = formData.get("readTime");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const imageFile = formData.get("image");

    // 2. Validate required text fields
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

    const normalizedSlug = slug.toLowerCase().trim();

    // 3. Check duplicate slug
    const existingBlog = await Blog.findOne({
      slug: normalizedSlug,
      _id: { $ne: id },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Another blog already uses this slug.",
        },
        { status: 400 }
      );
    }

    // 4. Find blog
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

    // 5. Handle Image Upload to Cloudinary if a new file was provided
    let imageUrl = blog.image; // Keep existing image by default
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cloudinaryResponse = await uploadToCloudinary(
        buffer,
        "sharma-technologies/blogs"
      );
      imageUrl = cloudinaryResponse.secure_url;
    }

    // 6. Update fields
    blog.title = title.trim();
    blog.description = description.trim();
    blog.author = author.trim();
    blog.category = category.trim();
    blog.readTime = readTime.trim();
    blog.slug = normalizedSlug;
    blog.content = content.trim();
    blog.image = imageUrl;

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