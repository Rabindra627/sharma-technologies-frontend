"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

// Initial mock data
const INITIAL_PROJECTS = [
  { id: "PRJ-001", name: "E-Commerce Platform", category: "Full Stack", status: "Active", client: "Apex Retail", budget: "$12,500" },
  { id: "PRJ-002", name: "AI SaaS Dashboard", category: "AI & Data", status: "In Progress", client: "Nexus Labs", budget: "$8,200" },
  { id: "PRJ-003", name: "Crypto Mobile App", category: "Mobile", status: "Review", client: "BlockChain Inc", budget: "$15,000" },
  { id: "PRJ-004", name: "Portfolio Website", category: "Frontend", status: "Completed", client: "Sarah J.", budget: "$2,400" },
];

export default function ProjectsTablePage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Project Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    client: "",
    budget: "",
    status: ""
  });

  // Simulated Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      setProjects(projects);
    }, 900);
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // handled projects submission
  // Create Project Submission with API Integration
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Guard clause using your local form state keys
    if (!formData.name || !formData.client) return; 

    try {
      // 1. Fire the POST request to your App Router backend endpoint
      const response = await fetch("/api/auth/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Corrected keys to precisely match your Mongoose Model configuration
          "projectName": formData.name,
          "category": formData.category,
          "initialStatus": formData.status,
          "clientPartner": formData.client,
          "budgetAllocation": Number(formData.budget.replace(/[^0-9.]/g, "")) // Strips "$" or commas cleanly to match Mongoose Numbers
        }),
      });

      const result = await response.json();      
      if(result.success){
        toast.success(result.message);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to instantiate project asset.");
      }

      // 2. Map the MongoDB response data safely back into your client state format
      const createdProject = {
        id: result.data._id, // Uses the real MongoDB Object ID
        name: result.data.projectName,
        category: result.data.category,
        status: result.data.initialStatus,
        client: result.data.clientPartner,
        budget: `$${result.data.budgetAllocation.toLocaleString()}`
      };

      // 3. Prepend the live saved project context into view and close the modal
      setProjects([createdProject, ...projects]);
      setFormData({ name: "", category: "", client: "", budget: "", status: "In Progress" });
      setIsModalOpen(false);

    } catch (error) {
      console.error("Project dispatch transmission failure:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Fetch projects from the API on component mount
  React.useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/projects");
        const result = await response.json();

        if (response.ok && result.success) {
          // Map the MongoDB data format to your table's state format
          const mappedProjects = result.data.map((project) => ({
            id: project._id,
            name: project.projectName,
            category: project.category,
            status: project.initialStatus,
            client: project.clientPartner,
            budget: typeof project.budgetAllocation === "number" 
              ? `$${project.budgetAllocation.toLocaleString()}` 
              : project.budgetAllocation
          }));
          
          setProjects(mappedProjects);
        } else {
          console.error("Failed to load registry assets:", result.error);
        }
      } catch (error) {
        console.error("Network communication failure during fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array ensures this fires exactly once when the page loads


  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50";
      case "In Progress": return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50";
      case "Review": return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50";
      case "Completed": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Project Registry</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Track, manage, and configure active software deployments.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
              title="Refresh Data"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            {/* Triggers Modal Open */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* --- DESKTOP INTERACTIVE TABLE VIEW (Visible on md screens and up) --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Project ID</th>
                  <th className="py-4 px-6">Project Details</th>
                  <th className="py-4 px-6">Client Partner</th>
                  <th className="py-4 px-6">Budget Allocation</th>
                  <th className="py-4 px-6">Status Indicator</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-5 px-6"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="py-5 px-6">
                        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
                      </td>
                      <td className="py-5 px-6"><div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="py-5 px-6"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div></td>
                      <td className="py-5 px-6"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
                      <td className="py-5 px-6"><div className="h-8 w-8 ml-auto bg-slate-200 dark:bg-slate-800 rounded-lg"></div></td>
                    </tr>
                  ))
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors duration-200">
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">{project.id}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold block text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 inline-block">{project.category}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{project.client}</td>
                      <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">{project.budget}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(project.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-currentColor mr-1.5 opacity-80"></span>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MOBILE CARDS GRID VIEW (Visible only on mobile/small viewports) --- */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded font-mono" />
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block text-base">{project.name}</span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500 dark:text-slate-400 mt-1 inline-block">
                      {project.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                    {project.id}
                  </span>
                </div>

                {/* Grid Metadata Row */}
                <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Client Partner</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{project.client}</span>
                  </div>
                  
                  <div>
                    <span className="text-slate-400 dark:text-slate-400 block mb-0.5 font-medium">Budget</span>
                    <span className="text-slate-900 dark:text-slate-50 font-bold text-sm">{project.budget}</span>
                  </div>
                </div>

                {/* Footer Interaction Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/30">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(project.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-currentColor mr-1.5 opacity-80" />
                    {project.status}
                  </span>

                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD NEW PROJECT MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn">
          
          {/* Modal Container */}
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl transform scale-100 transition-all duration-300 animate-scaleIn overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Create New Project</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Analytics Pipeline"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI & Data">AI & Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Active">Active</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Client Partner</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Budget Allocation</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g. 7,500"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Save Project
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}