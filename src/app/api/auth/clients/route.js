import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Client from "@/models/Client";


// GET: Retrieve all projects from the cluster
export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: clients }, { status: 200 });
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
    const newClient = await Client.create({     
      companyName: body.name,
      industry: body.industry,
      accountHealth: body.health,
      accountDirector: body.liaison,
      pipelineBudget: body.revenue,   
      liaisonEmail: body.email      
    });

    return NextResponse.json({ success: true, data: newClient, message : "Project Successfully created!!"}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}