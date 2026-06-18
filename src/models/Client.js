import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company Name is strictly required"],
      trim: true,
      unique: true, // Prevents duplicate partner profiles
    },
    industry: {
      type: String,
      required: [true, "Industry sector classification is required"],
      enum: ["Technology", "Healthcare", "Finance", "Real Estate", "Infrastructure", "Retail", "Other"],
      default: "Technology",
    },
    accountHealth: {
      type: String,
      required: [true, "Account health tier is required"],
      enum: ["Good", "Fair", "At Risk"],
      default: "Good",
    },
    accountDirector: {
      type: String,
      required: [true, "An Account Director must be assigned"],
      trim: true,
    },
    pipelineBudget: {
      type: Number,
      required: [true, "Pipeline LTV metric must be a valid number"],
      min: [0, "Budget valuation metrics cannot be negative"],
    },
    liaisonEmail: {
      type: String,
      required: [true, "Liaison contact email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email format"],
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt` tracking fields
  }
);

// Prevent Next.js hot-reloading from recompiling models repeatedly 
export default mongoose.models.Client ||
 mongoose.model("Client", ClientSchema);
