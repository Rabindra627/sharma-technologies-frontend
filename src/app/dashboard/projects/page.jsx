"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";

const INITIAL_PROJECTS = [
  { id: "PRJ-001", projectId: "PRJ-001", name: "E-Commerce Platform", category: "Full Stack", status: "ACTIVE", client: "Apex Retail", budget: "$12,500" },
  { id: "PRJ-002", projectId: "PRJ-002", name: "AI SaaS Dashboard", category: "AI & Data", status: "IN PROGRESS", client: "Nexus Labs", budget: "$8,200" },
  { id: "PRJ-003", projectId: "PRJ-003", name: "Crypto Mobile App", category: "Mobile", status: "REVIEW", client: "BlockChain Inc", budget: "$15,000" },
  { id: "PRJ-004", projectId: "PRJ-004", name: "Portfolio Website", category: "Frontend", status: "COMPLETED", client: "Sarah J.", budget: "$2,400" },
];

export default function ProjectsTablePage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Active Dropdown Menu State (stores row ID for open 3-dot menu)
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // DataTable Filter, Search, Sort & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // New / Edit Project Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Full Stack",
    client: "",
    budget: "",
    status: "IN PROGRESS"
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/projects");
        const result = await response.json();

        if (response.ok && result.success) {
          const mappedProjects = result.data.map((project) => ({
            id: project._id,
            projectId: project.projectId || `PRJ-${project._id.slice(-4)}`,
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
  }, []);

  // Simulated Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      toast.success("Registry synced successfully");
    }, 800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: "", category: "Full Stack", client: "", budget: "", status: "IN PROGRESS" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      category: project.category,
      client: project.client,
      budget: project.budget.replace(/[^0-9.]/g, ""),
      status: project.status
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  // Delete Project Handler
  const handleDeleteProject = async (id) => {
    try {
      setProjects((prev) => prev.filter((p) => p.id !== id && p.projectId !== id));
      toast.success("Project asset deleted");
      setActiveMenuId(null);
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  // Form Submission (Create & Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return; 

    try {
      const payload = {
        projectName: formData.name,
        category: formData.category,
        initialStatus: formData.status,
        clientPartner: formData.client,
        budgetAllocation: Number(formData.budget.replace(/[^0-9.]/g, ""))
      };

      if (editingProject) {
        // Edit flow
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id || p.projectId === editingProject.projectId
              ? {
                  ...p,
                  name: formData.name,
                  category: formData.category,
                  status: formData.status,
                  client: formData.client,
                  budget: `$${Number(formData.budget).toLocaleString()}`
                }
              : p
          )
        );
        toast.success("Project updated successfully");
      } else {
        // Create API flow
        const response = await fetch("/api/auth/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          toast.success(result.message || "Project created");
          const createdProject = {
            id: result.data._id,
            projectId: result.data.projectId || `PRJ-${Date.now().toString().slice(-4)}`,
            name: result.data.projectName,
            category: result.data.category,
            status: result.data.initialStatus,
            client: result.data.clientPartner,
            budget: `$${result.data.budgetAllocation.toLocaleString()}`
          };
          setProjects([createdProject, ...projects]);
        } else {
          throw new Error(result.error || "Failed to save asset.");
        }
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Transmission error:", error);
      toast.error(error.message);
    }
  };

  // DataTable Filtering, Searching & Sorting Logic
  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.projectId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === "All" || project.category === categoryFilter;
        const matchesStatus = statusFilter === "All" || project.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [projects, searchQuery, categoryFilter, statusFilter, sortField, sortOrder]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredAndSortedProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedProjects.slice(start, start + pageSize);
  }, [filteredAndSortedProjects, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50";
      case "IN PROGRESS": return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50";
      case "REVIEW": return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50";
      case "COMPLETED": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-blue-500/10">
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

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* --- DATATABLE CONTROLS BAR (Search & Filters) --- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Global Search Input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search projects, client, ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Mobile">Mobile</option>
              <option value="AI & Data">AI & Data</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {(searchQuery || categoryFilter !== "All" || statusFilter !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter("All"); setStatusFilter("All"); setCurrentPage(1); }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* --- DESKTOP INTERACTIVE TABLE VIEW --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th onClick={() => handleSort("projectId")} className="py-4 px-6 cursor-pointer hover:text-blue-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Project ID</span>
                      {sortField === "projectId" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th onClick={() => handleSort("name")} className="py-4 px-6 cursor-pointer hover:text-blue-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Project Details</span>
                      {sortField === "name" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th onClick={() => handleSort("client")} className="py-4 px-6 cursor-pointer hover:text-blue-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Client Partner</span>
                      {sortField === "client" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th onClick={() => handleSort("budget")} className="py-4 px-6 cursor-pointer hover:text-blue-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Budget Allocation</span>
                      {sortField === "budget" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th onClick={() => handleSort("status")} className="py-4 px-6 cursor-pointer hover:text-blue-600 select-none">
                    <div className="flex items-center gap-1.5">
                      <span>Status Indicator</span>
                      {sortField === "status" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
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
                ) : paginatedProjects.length > 0 ? (
                  paginatedProjects.map((project) => {
                    const rowKey = project.id || project.projectId;
                    const isMenuOpen = activeMenuId === rowKey;

                    return (
                      <tr key={rowKey} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors duration-200 relative">
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">{project.projectId}</td>
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
                        <td className="py-4 px-6 text-right relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(isMenuOpen ? null : rowKey); }}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
                            title="Action options"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                          </button>

                          {/* Floating Action Menu Popover */}
                          {isMenuOpen && (
                            <div ref={menuRef} className="absolute right-6 top-14 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 py-1 text-left animate-fadeIn">
                              <button
                                onClick={() => { toast.success(`Viewing details for ${project.name}`); setActiveMenuId(null); }}
                                className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(project)}
                                className="w-full px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                              >
                                Edit Project
                              </button>
                              <button
                                onClick={() => handleDeleteProject(rowKey)}
                                className="w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                              >
                                Delete Project
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 text-sm">
                      No matching projects found in registry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* DataTable Pagination Footer */}
          {!isLoading && filteredAndSortedProjects.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <div>
                Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(currentPage * pageSize, filteredAndSortedProjects.length)}</span> of{" "}
                <span className="font-semibold">{filteredAndSortedProjects.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <span className="font-medium px-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- MOBILE CARDS GRID VIEW --- */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : paginatedProjects.length > 0 ? (
            paginatedProjects.map((project) => {
              const rowKey = project.id || project.projectId;
              const isMenuOpen = activeMenuId === rowKey;

              return (
                <div 
                  key={rowKey} 
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block text-base">{project.name}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500 dark:text-slate-400 mt-1 inline-block">
                        {project.category}
                      </span>
                    </div>

                    <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(isMenuOpen ? null : rowKey); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                      </button>

                      {/* Mobile Floating Action Menu */}
                      {isMenuOpen && (
                        <div ref={menuRef} className="absolute right-0 top-10 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 py-1 text-left">
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="w-full px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(rowKey)}
                            className="w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-slate-100 dark:border-slate-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Client Partner</span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{project.client}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Budget</span>
                      <span className="text-slate-900 dark:text-slate-50 font-bold text-sm">{project.budget}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/30 text-xs font-mono text-slate-400">
                    <span>{project.projectId}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(project.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-currentColor mr-1.5 opacity-80" />
                      {project.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No matching projects found.
            </div>
          )}

          {/* Mobile Pagination */}
          {!isLoading && filteredAndSortedProjects.length > 0 && (
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD / EDIT PROJECT MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-scaleIn">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {editingProject ? "Edit Project Asset" : "Create New Project"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="IN PROGRESS">In Progress</option>
                    <option value="ACTIVE">Active</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
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
                  placeholder="e.g. 7500"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

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
                  {editingProject ? "Save Changes" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}