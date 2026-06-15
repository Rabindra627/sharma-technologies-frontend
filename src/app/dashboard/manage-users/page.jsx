"use client";

import React, { useState, useEffect } from "react";
import Image  from "next/image";
// Initial mock data for users
const INITIAL_USERS = [
  { id: "USR-9021", name: "Olivia Vance", email: "olivia@company.com", role: "Admin", status: "Active", joined: "Jan 12, 2026", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "USR-4412", name: "Marcus Chen", email: "marcus.c@company.com", role: "Editor", status: "Active", joined: "Feb 28, 2026", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { id: "USR-7832", name: "Elena Rostova", email: "elena.r@company.com", role: "Viewer", status: "Suspended", joined: "Mar 05, 2026", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { id: "USR-1099", name: "David Kross", email: "d.kross@company.com", role: "Developer", status: "Active", joined: "May 19, 2026", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "Active"
  });

  // Simulated Smooth Refresh Actions
  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      setUsers(INITIAL_USERS);
    }, 800);
  };

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create User Submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`
    };

    setUsers([newUser, ...users]);
    setFormData({ name: "", email: "", role: "Viewer", status: "Active" });
    setIsModalOpen(false);
  };

  // Delete User handler
  const handleDeleteUser = (id) => {    
    setUsers(users.filter(user => user._id !== id));
  };

  // Role Badge Styling System
  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/40";
      case "Developer": return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/40";
      case "Editor": return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/40";
      default: return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200";
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/auth/users");
        const data = await res.json();
        setUsers(data.users || data); 
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Actions Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">User Directory</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage user access permissions, identities, and account status credentials.</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            {/* Open Modal Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* --- DESKTOP TABLE VIEW (Visible on tablet/desktop sizes) --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Access Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Registration Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/60 rounded" />
                        </div>
                      </td>
                      <td className="py-4 px-6"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                      <td className="py-4 px-6"><div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                      <td className="py-4 px-6"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                      <td className="py-4 px-6"><div className="h-8 w-8 ml-auto bg-slate-200 dark:bg-slate-800 rounded-lg" /></td>
                    </tr>
                  ))
                ) : (
                  users.map((user) => (
                    <tr key={user?._id} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all duration-200">
                      <td className="py-4 px-6 flex items-center gap-3">                        
                        <Image
                          src={user?.avatarUrl || "/images/profile/default-user.png"}
                          alt="User"
                          width={50}
                          height={50}
                          className ={`w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition-transform`}
                        />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-100 block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRoleStyle(user.role)}`}>
                          {user?.role || 'Admin'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">{user.createdAt}</td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => handleDeleteUser(user._id)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-90">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        {/* --- MOBILE CARDS GRID VIEW (Visible only on mobile/small screens) --- */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))
          ) : (
            users.map((user) => (
              <div 
                key={user.id} 
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 block">{user.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono block max-w-[180px] truncate">{user.email}</span>
                    </div>
                  </div>
                  
                  {/* Delete Button on card top right */}
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Sub Metadata Row */}
                <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-medium">Access Role</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold border ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-slate-400 dark:text-slate-500 block mb-1 font-medium">Status</span>
                    <span className={`inline-flex items-center gap-1.5 font-medium ${user.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="text-xxs text-slate-400 dark:text-slate-500 font-mono text-left pt-1">
                  Registered: {user.joined}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty Table Validation State */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 space-y-2">
            <svg className="w-8 h-8 mx-auto stroke-current opacity-70" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="font-medium text-sm">No registered directory profiles found.</p>
          </div>
        )}
      </div>

      {/* --- ADD USER ACCORDION MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-scaleIn overflow-hidden transform transition-all">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">Invite New Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Coordinates</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Access Tier</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Developer">Developer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Account State</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

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
                  Provision User
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}