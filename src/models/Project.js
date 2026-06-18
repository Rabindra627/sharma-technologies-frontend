import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project Name is strictly required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category classification is required"]            
    },
    initialStatus: {
      type: String,
      required: [true, "Initial Status is required"]      
    },
    clientPartner: {
      type: String,
      required: [true, "Client Partner name is required"],
      trim: true,
    },
    budgetAllocation: {
      type: Number,
      required: [true, "Budget Allocation must be a valid number"],
      min: [0, "Budget allocation metrics cannot be negative"],
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

// Prevent Next.js hot-reloading from compiling models repeatedly
export default mongoose.models.Project || mongoose.model("Project", ProjectSchema,'projects');
