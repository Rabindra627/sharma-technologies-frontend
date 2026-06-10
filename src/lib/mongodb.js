import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sharmatech:Mongodb@26@cluster0.xwpbycu.mongodb.net/sharmatechDb";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(MONGODB_URI);
};


