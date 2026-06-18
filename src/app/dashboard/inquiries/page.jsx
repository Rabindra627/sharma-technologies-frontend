"use client";

import React, { useState, useEffect } from "react";
// import { format } from 'date-fns';

// Mock Data for Incoming Customer/Client Enquiries
const INITIAL_ENQUIRIES = [
  { id: "ENQ-9021", sender: "Alexandra Vance", company: "Vanguard Tech", subject: "Enterprise API Integration License", date: "Today, 9:42 AM", priority: "High", stage: "Unread", message: "We are looking to sync our internal HRM with your cloud endpoints. Need documentation on rate limits and bulk webhook pricing structures for 5,000+ daily seats." },
  { id: "CLN-4122", sender: "Devon Miller", company: "Quantum Drift", subject: "Custom UI/UX Theme Engineering", date: "Yesterday", priority: "Medium", stage: "In Progress", message: "Can your system support dynamic CSS variables passed via metadata injections? Our clients require custom white-label dashboard themes out-of-the-box." },
  { id: "ENQ-3310", sender: "Hana Takahashi", company: "Sora Media", subject: "Urgent: SLA Tier Upgrades", date: "June 11, 2026", priority: "Critical", stage: "Unread", message: "Our media platform is experiencing heavy traffic surges. We need to instantly migrate from Standard Support to the Dedicated Tier with sub-15min response targets." },
  { id: "ENQ-0844", sender: "Robert Boyle", company: "BioGenix Group", subject: "Data Compliance & HIPAA Checklist", date: "June 08, 2026", priority: "Low", stage: "Resolved", message: "Just confirming if your multi-tenant database clusters are fully SOC2 and HIPAA compliant before signing our yearly master service contract." },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStage, setFilterStage] = useState("All");
  
  // FIXED: Declared missing error state variables
  const [error, setError] = useState(null);

  // Fetch data from your API on component mount
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchEnquiries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/auth/getEnquiries", { signal: controller.signal });
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          // Update the state with the fetched array
          console.log(json.data)
          setEnquiries(json.data);
        } else {
          setError(json.message || "Something went wrong fetching data.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to connect to the server");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquiries();

    // Cleanup abort execution if component unmounts early
    return () => controller.abort();
  }, []);

  // const formattedDate = format(new Date("2026-06-18T08:12:53.965Z"), "dd MM yyyy HH:mm:ss");

  // Smooth UI Loader Refresh Sequence
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      setEnquiries(INITIAL_ENQUIRIES);
    }, 800);
  };

  // Archive / Delete Handler
  const handleArchive = (id, e) => {
    e.stopPropagation(); // Avoid triggering row selections
    setEnquiries(prev => prev.filter(item => item.id !== id));
    if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
  };

  // Stage Advancement Triage Handler
  const updateStage = (id, nextStage) => {
    setEnquiries(prev => prev.map(item => item.id === id ? { ...item, stage: nextStage } : item));
    if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => ({ ...prev, stage: nextStage }));
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

  // Handle safe mapping check in case filteredEnquiries evaluates undefined
  const filteredEnquiries = (enquiries || []).filter(enq => filterStage === "All" || enq.stage === filterStage);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative overflow-x-hidden selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Enquiry Influx</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Triage incoming enterprise requests, evaluate priority tickets, and route leads.</p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Quick Segment Filters */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl space-x-1 text-xs font-medium border border-slate-200/50 dark:border-slate-800/80">
              {["All", "Unread", "In Progress"].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setFilterStage(stg)}
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

        {/* --- DESKTOP FLUID ROW TABLE (lg: screen visibility breakpoint) --- */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6 w-1/4">Sender Information</th>
                  <th className="py-4 px-6 w-2/5">Subject & Intent Header</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Received</th>
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
                ) : (
                  filteredEnquiries.map((enq) => (
                    <tr 
                      key={enq.id} 
                      onClick={() => setSelectedEnquiry(enq)}
                      className={`group cursor-pointer transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/20 ${enq.stage === "Unread" ? "bg-blue-500/[0.02] font-medium" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{enq.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{enq.email || 'First User'}</span>
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
                          {enq.priority || 'HIGH'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 dark:text-slate-500 whitespace-nowrap">{enq.createdAt}</td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={(e) => handleArchive(enq.id, e)}
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
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MOBILE ACCORDION CARD GRID (Responsive break underneath lg viewport) --- */}
        <div className="block lg:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                <div className="h-12 w-full bg-slate-50 dark:bg-slate-800/40 rounded" />
              </div>
            ))
          ) : (
            filteredEnquiries.map((enq) => (
              <div 
                key={enq.id}
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
                  <span className="text-xxs font-mono text-slate-400 dark:text-slate-500">{enq.id}</span>
                  <button 
                    onClick={(e) => handleArchive(enq.id, e)}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State Triage */}
        {!isLoading && filteredEnquiries.length === 0 && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 space-y-2">
            <svg className="w-8 h-8 mx-auto stroke-current opacity-40" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="font-medium text-sm">All cleared. No filtered enquiries found in queue.</p>
          </div>
        )}
      </div>

      {/* --- SLIDE-OVER CONTEXT DRAWER PANEL (Fluid responsive side animation sheet) --- */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop Click Out close triggers */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedEnquiry(null)} />
          
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform animate-slideLeft border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-xxs font-mono font-bold tracking-widest text-slate-400 block uppercase mb-1">{selectedEnquiry.id}</span>
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
                  <span className="text-slate-400">{selectedEnquiry.createdAt}</span>
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
                      onClick={() => updateStage(selectedEnquiry.id, stage)}
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
                onClick={(e) => { handleArchive(selectedEnquiry.id, e); }}
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