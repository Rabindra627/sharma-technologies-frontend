// app/api/dashboard/stats/route.js

import User from "@/models/User";
import Contact from "@/models/Contact";

// import Project from "@/models/Project";

export async function GET() {
  const totalUsers = await User.countDocuments();
  const totalEnquiries = await Contact.countDocuments();
//   const totalProjects = await Project.countDocuments();

  return Response.json({
    totalUsers,
    totalEnquiries
    // totalProjects,
  });
}