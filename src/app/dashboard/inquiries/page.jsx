"use client";

import React, { useState, useEffect, useMemo } from "react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // DataTable State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // --- CORRECTED FETCH FUNCTION ---
  const fetchEnquiries = async (signal) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("/api/auth/getEnquiries", { signal });
      
      // Check if HTTP status is OK (e.g., 200-299)
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const json = await response.json();

      // Flexible extraction: handles { success: true, data: [...] }, { enquiries: [...] }, or raw [...] array
      let rawData = [];
      if (Array.isArray(json)) {
        rawData = json;
      } else if (Array.isArray(json.data)) {
        rawData = json.data;
      } else if (Array.isArray(json.enquiries)) {
        rawData = json.enquiries;
      } else if (json.success && json.enquiryList) {
        rawData = json.enquiryList;
      } else {
        throw new Error(json.message || "Invalid data format received from API");
      }

      // Normalize fields to ensure safe rendering across your UI
      const normalized = rawData.map((item) => ({
        ...item,
        id: item.id || item._id,
        sender: item.sender || item.name || "Unknown Client",
        company: item.company || "Independent",
        subject: item.subject || "General Inquiry",
        date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"),
        priority: item.priority || "Medium",
        stage: item.stage || "Unread",
        message: item.message || "No content provided.",
      }));

      setEnquiries(normalized);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch enquiries:", err);
        setError(err.message || "Failed to connect to the server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => fetchEnquiries(controller.signal), 0);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Smooth UI Loader Refresh Sequence
  const handleRefresh = () => {
    setIsRefreshing(true);
    const controller = new AbortController();
    fetchEnquiries(controller.signal).finally(() => {
      setTimeout(() => setIsRefreshing(false), 600);
    });
  };

  // Archive / Delete Handler
  const handleArchive = (id, e) => {
    e.stopPropagation();
    setEnquiries((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    if (selectedEnquiry?.id === id || selectedEnquiry?._id === id) setSelectedEnquiry(null);
  };

  // Stage Advancement Triage Handler
  const updateStage = (id, nextStage) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id || item._id === id ? { ...item, stage: nextStage } : item))
    );
    if (selectedEnquiry?.id === id || selectedEnquiry?._id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, stage: nextStage }));
    }
  };

  // DataTable Filtering, Searching & Sorting Logic
  const filteredAndSortedEnquiries = useMemo(() => {
    return enquiries
      .filter((enq) => {
        const matchesSearch =
          (enq.sender && enq.sender.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (enq.company && enq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (enq.subject && enq.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (enq.message && enq.message.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStage = filterStage === "All" || enq.stage === filterStage;
        const matchesPriority = filterPriority === "All" || enq.priority === filterPriority;

        return matchesSearch && matchesStage && matchesPriority;
      })
      .sort((a, b) => {
        let valA = a[sortField] || "";
        let valB = b[sortField] || "";

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [enquiries, searchQuery, filterStage, filterPriority, sortField, sortOrder]);

  // Paginated Slicing
  const totalPages = Math.ceil(filteredAndSortedEnquiries.length / pageSize) || 1;
  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedEnquiries.slice(start, start + pageSize);
  }, [filteredAndSortedEnquiries, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Critical": return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/40 animate-pulse";
      case "High": return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/40";
      case "Medium": return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/40";
      default: return "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/40";
    }
  };

  const getStageStyle = (stage) => {
    switch (stage) {
      case "Unread": return "bg-indigo-600 text-white font-semibold shadow-sm";
      case "In Progress": return "bg-amber-500 text-white font-semibold shadow-sm";
      case "Resolved": return "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-x-hidden selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Enquiry Inbox</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Evaluate priority tickets, search records, and manage enterprise enquiries.</p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Quick Segment Stage Filters */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl space-x-1 text-xs font-medium border border-slate-200/50 dark:border-slate-800/80">
              {["All", "Unread", "In Progress"].map((stg) => (
                <button
                  key={stg}
                  onClick={() => { setFilterStage(stg); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filterStage === stg ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  {stg}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Refresh Queue"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? "animate-spin text-indigo-500" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Alert Display Block */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 text-rose-800 dark:text-rose-400 text-sm font-medium">
             ⚠️ {error}
          </div>
        )}

        {/* --- DATATABLE CONTROLS BAR (Search & Dropdowns) --- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Global Search Box */}
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
              placeholder="Search sender, company, message..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={filterStage}
              onChange={(e) => { setFilterStage(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="Unread">Unread</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {(searchQuery || filterStage !== "All" || filterPriority !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setFilterStage("All"); setFilterPriority("All"); setCurrentPage(1); }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* --- DESKTOP FLUID ROW TABLE (lg: screen visibility breakpoint) --- */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th 
                    onClick={() => handleSort("sender")} 
                    className="py-4 px-6 w-1/4 cursor-pointer hover:text-blue-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sender Information</span>
                      {sortField === "sender" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("subject")} 
                    className="py-4 px-6 w-2/5 cursor-pointer hover:text-blue-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Subject & Intent Header</span>
                      {sortField === "subject" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("priority")} 
                    className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Priority</span>
                      {sortField === "priority" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("createdAt")} 
                    className="py-4 px-6 cursor-pointer hover:text-blue-600 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Received</span>
                      {sortField === "createdAt" && <span className="text-blue-500">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-1.5" />
                        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-1.5" />
                        <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800/50 rounded" />
                      </td>
                      <td className="py-4 px-6"><div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                      <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded" /></td>
                      <td className="py-4 px-6"><div className="h-8 w-8 ml-auto bg-slate-200 dark:bg-slate-800 rounded-lg" /></td>
                    </tr>
                  ))
                ) : paginatedEnquiries.length > 0 ? (
                  paginatedEnquiries.map((enq) => (
                    <tr 
                      key={enq.id || enq._id} 
                      onClick={() => setSelectedEnquiry(enq)}
                      className={`group cursor-pointer transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/20 ${enq.stage === "Unread" ? "bg-blue-500/[0.02] font-medium" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{enq.sender}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{enq.company}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 max-w-md">
                          {enq.stage === "Unread" && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                          <span className="text-slate-700 dark:text-slate-200 block truncate">{enq.subject}</span>
                        </div>
                        <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">{enq.message}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityStyle(enq.priority)}`}>
                          {enq.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 dark:text-slate-500 whitespace-nowrap text-xs">{enq.date}</td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={(e) => handleArchive(enq.id || enq._id, e)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/15 active:scale-95 transition-all"
                          title="Archive Ticket"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.34 6m-4.74 0l-.34-6m4.74-3H8.11m7.13 0a2 2 0 011.99 2v1h1.01m-10.14 0H4.62m2.41 0h10.14m-10.14 0V7a2 2 0 012-2h4a2 2 0 012 2v3m0 0h1.01" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 text-sm">
                      No matching records found in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* DataTable Pagination Footer */}
          {!isLoading && filteredAndSortedEnquiries.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <div>
                Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(currentPage * pageSize, filteredAndSortedEnquiries.length)}</span> of{" "}
                <span className="font-semibold">{filteredAndSortedEnquiries.length}</span> results
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

        {/* --- MOBILE ACCORDION CARD GRID --- */}
        <div className="block lg:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                <div className="h-12 w-full bg-slate-50 dark:bg-slate-800/40 rounded" />
              </div>
            ))
          ) : paginatedEnquiries.length > 0 ? (
            paginatedEnquiries.map((enq) => (
              <div 
                key={enq.id || enq._id}
                onClick={() => setSelectedEnquiry(enq)}
                className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border transition-all duration-200 active:scale-[0.99] ${enq.stage === "Unread" ? "border-indigo-200 dark:border-indigo-900/60 shadow-sm" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {enq.stage === "Unread" && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug">{enq.sender}</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">{enq.company} • {enq.date}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-extrabold border tracking-wider uppercase shrink-0 ${getPriorityStyle(enq.priority)}`}>
                    {enq.priority}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 font-medium border-t border-slate-100 dark:border-slate-800/60 pt-2.5 line-clamp-2">
                  <span className="text-slate-900 dark:text-slate-50 font-bold block mb-0.5">{enq.subject}</span>
                  {enq.message}
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50 dark:border-slate-800/30">
                  <span className="text-xxs font-mono text-slate-400 dark:text-slate-500">{enq.id || enq._id}</span>
                  <button 
                    onClick={(e) => handleArchive(enq.id || enq._id, e)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No matching profiles found.
            </div>
          )}

          {/* Mobile Pagination Control */}
          {!isLoading && filteredAndSortedEnquiries.length > 0 && (
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

      {/* --- SLIDE-OVER CONTEXT DRAWER PANEL --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedEnquiry(null)} />
          
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform animate-slideLeft border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xxs font-mono font-bold tracking-widest text-slate-400 block uppercase mb-1">{selectedEnquiry.id || selectedEnquiry._id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Enquiry Workspace</h3>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6 text-sm">
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/60 space-y-3">
                <div>
                  <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Sender Profile</label>
                  <span className="text-base font-bold block text-slate-800 dark:text-slate-100">{selectedEnquiry.sender}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedEnquiry.company}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-slate-400">{selectedEnquiry.date}</span>
                  <span className={`px-2.5 py-0.5 text-xxs font-extrabold uppercase rounded-full border ${getPriorityStyle(selectedEnquiry.priority)}`}>
                    {selectedEnquiry.priority} Priority
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Message Intent Topic</label>
                <h4 className="text-md font-bold text-slate-900 dark:text-slate-50 leading-snug">{selectedEnquiry.subject}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/40 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-medium select-text whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Workflow Dispatch Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Unread", "In Progress", "Resolved"].map((stage) => (
                    <button
                      key={stage}
                      onClick={() => updateStage(selectedEnquiry.id || selectedEnquiry._id, stage)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${selectedEnquiry.stage === stage ? getStageStyle(stage) : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400"}`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="flex-1 py-2.5 text-center text-sm font-semibold rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50"
              >
                Close Ticket
              </button>
              <button 
                onClick={(e) => { handleArchive(selectedEnquiry.id || selectedEnquiry._id, e); setSelectedEnquiry(null); }}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
              >
                Mark Handled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}