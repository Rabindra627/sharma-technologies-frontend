import mongoose from "mongoose";

// 1. Create a Counter Schema to keep track of sequential IDs safely
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema, "counters");

// 2. Updated Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      unique: true,
      index: true,
    },
    projectName: {
      type: String,
      required: [true, "Project Name is strictly required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category classification is required"],
    },
    initialStatus: {
      type: String,
      required: [true, "Initial Status is required."],
    },
    clientPartner: {
      type:String,
      ref: "Organization", // Link to client organization instead of storing raw string
      required: [true, "Client Partner reference is required"],
    },
    budgetAllocation: {
      type: Number,
      required: [true, "Budget Allocation must be a valid number"],
      min: [0, "Budget allocation metrics cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// 3. Pre-validate hook to safely increment counter and format prefix
ProjectSchema.pre("validate", async function (next) {
  if (this.isNew && !this.projectId) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "projectId" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true } // Fixed deprecation warning
      );

      // Formats number to 4 digits: e.g., 1 -> "0001", 42 -> "0042"
      const paddedSequence = String(counter.seq).padStart(4, "0");
      this.projectId = `PRJ-${paddedSequence}`;
      console.log(this.projectId);      
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema, "projects");