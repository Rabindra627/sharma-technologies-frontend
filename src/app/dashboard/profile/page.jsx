"use client";

import React, { useState } from "react";
import { 
  User, 
  Shield, 
  Bell, 
  KeyRound, 
  Camera, 
  Mail, 
  Briefcase, 
  MapPin, 
  Building,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form State
  const [profileData, setProfileData] = useState({
    firstName: "Rabindra",
    lastName: "Sharma",
    email: "rabindra@enterprise.io",
    phone: "+977 9801234567",
    role: "Administrator",
    organization: "Apex Digital Labs",
    location: "Kathmandu, Nepal",
    bio: "Lead Solutions Architect & System Administrator. Passionate about designing resilient cloud architectures, streamlining CI/CD pipelines, and crafting clean, fluid user spaces.",
    notifications: {
      securityAlerts: true,
      pipelineUpdates: true,
      weeklyDigest: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (setting) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Smooth simulated API pipeline persist state
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 900);
  };

  const tabs = [
    { id: "general", label: "General Profile", icon: User },
    { id: "security", label: "Security & Keys", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-purple-500/10">
      
      {/* Toast Feedback Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-scaleIn font-medium text-sm">
          <CheckCircle2 size={18} />
          <span>Profile records successfully synchronized!</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Card Header Layout */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
          {/* Cover Photo Backdrop */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* User Core Bio Data Bar */}
          <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-14 sm:-mt-16 text-center sm:text-left">
            <div className="relative group/avatar">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 bg-white shadow-md transition-transform duration-300 group-hover/avatar:scale-[1.02]"
              />
              <button className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-slate-900 text-white hover:bg-purple-600 dark:bg-slate-800 dark:hover:bg-purple-600 shadow transition-colors" title="Change Avatar">
                <Camera size={14} />
              </button>
            </div>

            <div className="flex-1 space-y-1 sm:mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <span className="inline-flex items-center self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/40">
                  {profileData.role}
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Building size={13} /> {profileData.organization}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {profileData.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SYSTEM TABS BAR LAYOUT --- */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar whitespace-nowrap gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all relative border-b-2 -mb-px outline-none ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <IconComponent size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- MAIN INTERACTIVE WORKSPACE --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 transition-all duration-300">
          
          {/* TAB CONTENT: GENERAL PROFILE */}
          {activeTab === "general" && (
            <form onSubmit={handleFormSubmit} className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-base font-bold">Personal Account Profiles</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Modify system identity metadata data channels across directories.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950/20 dark:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950/20 dark:border-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950/20 dark:border-slate-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950/20 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Corporate Placement</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="organization"
                      value={profileData.organization}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Geographic Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">Professional Bio Statement</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800 resize-none leading-relaxed"
                />
              </div>

              {/* Action Operations Tray */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md active:scale-95 disabled:opacity-50 transition-all min-w-[130px]"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Synchronize Profile</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB CONTENT: SECURITY ARCHITECTURE */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-base font-bold">Access Security Matrices</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage password architectures, MFA authentication protocols, and dynamic keys.</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold block">Change Account Password</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Update system credential hashes regularly for protection.</span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 shadow-sm transition-all">
                    <KeyRound size={14} />
                    <span>Trigger Reset</span>
                  </button>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold block">Two-Factor Authentication (MFA)</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Enforce mobile token handshake challenges on every session deployment.</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xxs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 tracking-wider uppercase self-start sm:self-auto">
                    Active Sec-Tier
                  </span>
                </div>

                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold block">Hardware Security Token Keys</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Register cryptographic FIDO2 USB devices or alternative keys.</span>
                  </div>
                  <button className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline self-start sm:self-auto">
                    Configure Keys &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PREFERENCES PANEL */}
          {activeTab === "preferences" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-base font-bold">Notification Protocols</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure delivery channels for event-driven system logs.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <span className="text-sm font-semibold block">Critical Security Vulnerability Advisories</span>
                    <span className="text-xs text-slate-400">Receive real-time alerts upon anomalous session intrusions.</span>
                  </div>
                  <button
                    onClick={() => handleToggleChange("securityAlerts")}
                    className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${profileData.notifications.securityAlerts ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-md transition-transform duration-200 shadow-sm ${profileData.notifications.securityAlerts ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <span className="text-sm font-semibold block">Continuous Deployment Pipeline Outputs</span>
                    <span className="text-xs text-slate-400">Notify upon successful container orchestration and node instances.</span>
                  </div>
                  <button
                    onClick={() => handleToggleChange("pipelineUpdates")}
                    className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${profileData.notifications.pipelineUpdates ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-md transition-transform duration-200 shadow-sm ${profileData.notifications.pipelineUpdates ? "translate-x-5" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <span className="text-sm font-semibold block">Weekly Operations Digest</span>
                    <span className="text-xs text-slate-400">Receive aggregated system throughput analytics reports.</span>
                  </div>
                  <button
                    onClick={() => handleToggleChange("weeklyDigest")}
                    className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${profileData.notifications.weeklyDigest ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-md transition-transform duration-200 shadow-sm ${profileData.notifications.weeklyDigest ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}