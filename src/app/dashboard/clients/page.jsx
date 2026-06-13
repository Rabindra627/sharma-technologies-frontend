"use client";

import React, { useState } from "react";

// Initial mock data for enterprise clients
const INITIAL_CLIENTS = [
  { id: "CLN-8801", name: "Apex Retail Group", liaison: "Sarah Jenkins", email: "s.jenkins@apexretail.com", industry: "E-Commerce", revenue: "$145,000", health: "Excellent", logoColor: "from-blue-500 to-indigo-600" },
  { id: "CLN-4122", name: "Nexus AI Labs", liaison: "Marcus Chen", email: "m.chen@nexuslabs.ai", industry: "Technology", revenue: "$98,200", health: "Good", logoColor: "from-purple-500 to-pink-600" },
  { id: "CLN-7319", name: "Blockchain Horizons", liaison: "Elena Rostova", email: "e.rostova@bchorizons.com", industry: "Finance", revenue: "$210,000", health: "At Risk", logoColor: "from-amber-500 to-orange-600" },
  { id: "CLN-1044", name: "Stellar Health Corp", liaison: "David Kross", email: "d.kross@stellarhealth.org", industry: "Healthcare", revenue: "$34,500", health: "Good", logoColor: "from-emerald-500 to-teal-600" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form State
  const [formData, setFormData] = useState({
    name: "",
    liaison: "",
    email: "",
    industry: "Technology",
    revenue: "",
    health: "Good"
  });

  // Simulated Fluid Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      setClients(INITIAL_CLIENTS);
    }, 850);
  };

  // Form Input Listener
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create Client Profile Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.liaison || !formData.email) return;

    const newId = `CLN-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Pick a random gradient pairs for custom monogram look
    const gradients = [
      "from-cyan-500 to-blue-600",
      "from-fuchsia-500 to-purple-600",
      "from-violet-500 to-indigo-600",
      "from-rose-500 to-red-600"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newClient = {
      id: newId,
      name: formData.name,
      liaison: formData.liaison,
      email: formData.email,
      industry: formData.industry,
      revenue: formData.revenue.startsWith("$") ? formData.revenue : `$${formData.revenue}`,
      health: formData.health,
      logoColor: randomGradient
    };

    setClients([newClient, ...clients]);
    setFormData({ name: "", liaison: "", email: "", industry: "Technology", revenue: "", health: "Good" });
    setIsModalOpen(false);
  };

  // Health State Style Decorator
  const getHealthStyle = (health) => {
    switch (health) {
      case "Excellent": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/40";
      case "Good": return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/40";
      case "At Risk": return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/40";
      default: return "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation / Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Client Hub</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage institutional partners, account health metrics, and fiscal pipeline revenue.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {/* Smooth Async Refresh Toggle */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            {/* Modal Dialog Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              <span>Onboard Client</span>
            </button>
          </div>
        </div>

        {/* --- DESKTOP STRUCTURED TABLE (md: viewport upwards) --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Company / Brand</th>
                  <th className="py-4 px-6">Account Director</th>
                  <th className="py-4 px-6">Industry Cluster</th>
                  <th className="py-4 px-6">LTV Revenue</th>
                  <th className="py-4 px-6">Account Health</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/60 rounded" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-1.5" />
                        <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </td>
                      <td className="py-4 px-6"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                      <td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                      <td className="py-4 px-6"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                      <td className="py-4 px-6"><div className="h-8 w-8 ml-auto bg-slate-200 dark:bg-slate-800 rounded-lg" /></td>
                    </tr>
                  ))
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all duration-200">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${client.logoColor} flex items-center justify-center text-white font-black text-xs uppercase shadow-sm group-hover:scale-105 transition-transform`}>
                          {client.name.substring(0, 2)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {client.name}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{client.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-700 dark:text-slate-300 block">{client.liaison}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{client.email}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{client.industry}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{client.revenue}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getHealthStyle(client.health)}`}>
                          {client.health}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MOBILE CARDS FLUID GRID (Responsive break underneath md viewport) --- */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/40 rounded pt-2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-4 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))
          ) : (
            clients.map((client) => (
              <div key={client.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${client.logoColor} flex items-center justify-center text-white font-black text-xs uppercase shrink-0`}>
                      {client.name.substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block text-base leading-tight">{client.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{client.id} • {client.industry}</span>
                    </div>
                  </div>

                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:bg-slate-800 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  </button>
                </div>

                {/* Director Core Matrix Details */}
                <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl space-y-1 text-xs">
                  <span className="text-slate-400 dark:text-slate-500 block font-medium uppercase tracking-wider text-xxs">Account Director</span>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">{client.liaison}</span>
                    <span className="text-slate-400 font-mono select-all text-xxs max-w-[150px] truncate">{client.email}</span>
                  </div>
                </div>

                {/* Metrics Indicator Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-0.5 font-medium">LTV Revenue</span>
                    <span className="text-slate-900 dark:text-slate-50 font-extrabold text-sm">{client.revenue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-medium">Health Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold border ${getHealthStyle(client.health)}`}>
                      {client.health}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dynamic Empty State Fallback */}
        {!isLoading && clients.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-2">
            <svg className="w-8 h-8 mx-auto stroke-current opacity-60" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="font-medium text-sm">No onboarded client accounts cataloged.</p>
          </div>
        )}
      </div>

      {/* --- ADD NEW CLIENT SMOOTH MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-scaleIn overflow-hidden transform transition-all">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Onboard New Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Enterprise"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="Technology">Technology</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Account Health</label>
                  <select
                    name="health"
                    value={formData.health}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Account Director</label>
                  <input
                    type="text"
                    name="liaison"
                    value={formData.liaison}
                    onChange={handleInputChange}
                    placeholder="Sarah Connor"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Pipeline LTV</label>
                  <input
                    type="text"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    placeholder="e.g. 25,000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Liaison Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              {/* Operations Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Save Partner
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}