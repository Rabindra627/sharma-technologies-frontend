import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/sharmatech_db";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(MONGODB_URI);
};

