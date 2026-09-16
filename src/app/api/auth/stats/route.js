// app/api/dashboard/stats/route.js

import User from "@/models/User";
import Contact from "@/models/Contact";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Client from "@/models/Client";

export async function GET() {
  const totalUsers = await User.countDocuments();
  const totalEnquiries = await Contact.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalBlogs = await Blog.countDocuments();
  const totalClients = await Client.countDocuments();

  return Response.json({
    totalUsers,
    totalEnquiries,
    totalProjects,
    totalBlogs,
    totalClients
  });
}