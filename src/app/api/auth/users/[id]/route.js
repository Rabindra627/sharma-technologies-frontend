import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

// PUT: Update an existing user
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    console.log("Updating user with ID:", id);
    const body = await req.json();
    const { name, email, password, role, active, avatarUrl } = body;

    await connectDB();

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (typeof active === "boolean") updateFields.active = active;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;

    // Hash new password if provided
    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a user
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}