// app/api/ratings/[blogId]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Rating from "@/models/Rating";

export async function GET(req, { params }) {
  await dbConnect();
  const { blogId } = params;

  const result = await Rating.aggregate([
    { $match: { blog: new mongoose.Types.ObjectId(blogId) } },
    {
      $group: {
        _id: "$blog",
        averageRating: { $avg: "$value" },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return NextResponse.json({ averageRating: 0, totalRatings: 0 });
  }

  return NextResponse.json(result[0]);
}
