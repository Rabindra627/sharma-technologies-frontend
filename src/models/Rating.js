// models/Rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  blog: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Blog",
      required: true
    },
  user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
  value: { 
      type: Number,
      min: 1, 
      max: 5, 
      required: true
    },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate ratings per user per blog
ratingSchema.index({ blog: 1, user: 1 }, { unique: true });

export default mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
