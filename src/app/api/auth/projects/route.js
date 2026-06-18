import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";


// GET: Retrieve all projects from the cluster
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new project from your frontend creation modal
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Mapping exact keys from your "Create New Project" modal fields
    const newProject = await Project.create({     
      projectName: body.projectName,
      category: body.category,
      initialStatus: body.initialStatus,
      clientPartner: body.clientPartner,
      budgetAllocation: body.budgetAllocation,    
    });

    return NextResponse.json({ success: true, data: newProject, message : "Project Successfully created!!"}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}