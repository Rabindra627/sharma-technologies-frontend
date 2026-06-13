"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Globe, 
  Lock, 
  CreditCard, 
  Sliders, 
  Check, 
  AlertTriangle,
  Moon,
  Sun,
  Laptop
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [isUpdating, setIsUpdating] = useState(false);
  const [themeSetting, setThemeSetting] = useState("system");

  // App Settings Mock State
  const [settingsState, setSettingsState] = useState({
    siteName: "Apex Dashboard",
    publicRegistration: fontcolorCheck(true),
    sessionTimeout: "60",
    twoFactorEnforced: false,
    billingEmail: "finance@apexlabs.io",
    currency: "USD",
  });

  function fontcolorCheck(val) { return val; }

  const handleToggle = (key) => {
    setSettingsState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettingsState(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 800);
  };

  const navigationItems = [
    { id: "general", label: "Preferences", icon: Sliders },
    { id: "localization", label: "Region & Localization", icon: Globe },
    { id: "security", label: "Authentication & Security", icon: Lock },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-purple-500/10">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600 dark:text-purple-400" />
            <span>System Configurations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Configure layout engines, regional properties, global security filters, and billing pipelines.</p>
        </div>

        {/* --- SPLIT LAYOUT CONTAINER --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: NAVIGATION ANCHORS (Sticky on Desktop) */}
          <nav className="md:col-span-4 lg:col-span-3 flex flex-row md:flex-col overflow-x-auto no-scrollbar gap-1 p-1 bg-slate-100/70 dark:bg-slate-900/50 rounded-2xl md:bg-transparent md:dark:bg-transparent md:p-0 md:sticky md:top-24">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap outline-none text-left w-full ${
                    activeSection === item.id
                      ? "bg-white text-purple-600 shadow-sm border border-slate-200/40 dark:bg-slate-900 dark:text-purple-400 dark:border-slate-800"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT COLUMN: INTERACTIVE FORM SHIELD */}
          <div className="md:col-span-8 lg:col-span-9 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 transition-all">
            
            {/* SUB-SECTION: GENERAL PREFERENCES */}
            {activeSection === "general" && (
              <form onSubmit={handleSaveChanges} className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold">Preferences</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Personalize dashboard visual treatments and core instance meta titles.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Workspace Master Title</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settingsState.siteName}
                    onChange={handleSelectChange}
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950/20 dark:border-slate-800"
                  />
                </div>

                {/* Theme Mode Selector Matrix */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Interface Theme Engine</label>
                  <div className="grid grid-cols-3 gap-2.5 max-w-md">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Laptop },
                    ].map((t) => {
                      const ThemeIcon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setThemeSetting(t.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                            themeSetting === t.id
                              ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400"
                              : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <ThemeIcon size={16} />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Inline Toggle Switches */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60 max-w-xl">
                    <div>
                      <span className="text-sm font-semibold block">Public Open Registration Workspace</span>
                      <span className="text-xs text-slate-400">Allow third-party users outside your tenant cluster to register account keys.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("publicRegistration")}
                      className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${settingsState.publicRegistration ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-md transition-transform duration-200 shadow-sm ${settingsState.publicRegistration ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Actions Bar Footer */}
                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md active:scale-95 disabled:opacity-50 transition-all min-w-[140px]"
                  >
                    {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Commit Parameters</span><Check size={16} /></>}
                  </button>
                </div>
              </form>
            )}

            {/* SUB-SECTION: LOCALIZATION */}
            {activeSection === "localization" && (
              <form onSubmit={handleSaveChanges} className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold">Region & Localization</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Adjust standard telemetry timestamps and fiscal formatting properties.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">System Base Currency</label>
                    <select
                      name="currency"
                      value={settingsState.currency}
                      onChange={handleSelectChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                    >
                      <option value="USD">USD - United States Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="NPR">NPR - Nepalese Rupee (Rs)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Telemetry Timezone Offset</label>
                    <select
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                      defaultValue="UTC+5:45"
                    >
                      <option value="UTC-5">UTC-05:00 Eastern Time (US)</option>
                      <option value="UTC+0">UTC+00:00 Greenwich Mean Time</option>
                      <option value="UTC+5:30">UTC+05:30 Indian Standard Time</option>
                      <option value="UTC+5:45">UTC+05:45 Kathmandu, Nepal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" disabled={isUpdating} className="px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all">
                    {isUpdating ? "Saving..." : "Save Localization Settings"}
                  </button>
                </div>
              </form>
            )}

            {/* SUB-SECTION: AUTHENTICATION & SECURITY */}
            {activeSection === "security" && (
              <form onSubmit={handleSaveChanges} className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold">Authentication & Security Filters</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enforce enterprise node rulesets and session fallback configurations.</p>
                </div>

                <div className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Maximum Session Inactivity TTL (Minutes)</label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={settingsState.sessionTimeout}
                      onChange={handleSelectChange}
                      className="w-full max-w-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <span className="text-sm font-semibold block">Mandate Multi-Factor Authentication (MFA)</span>
                      <span className="text-xs text-slate-400">Require all administrative roles to secure their profile with an MFA device handshake.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle("twoFactorEnforced")}
                      className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${settingsState.twoFactorEnforced ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-md transition-transform duration-200 shadow-sm ${settingsState.twoFactorEnforced ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" disabled={isUpdating} className="px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all">
                    {isUpdating ? "Deploying..." : "Enforce Security Architecture"}
                  </button>
                </div>
              </form>
            )}

            {/* SUB-SECTION: SUBSCRIPTION & BILLING */}
            {activeSection === "billing" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold">Subscription & Billing</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Review infrastructure licensing metrics, invoices, and routing addresses.</p>
                </div>

                {/* Pricing Tier Card */}
                <div className="p-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-xl">
                  <div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">Active Provision Architecture</span>
                    <h4>Enterprise Cluster Pro Plus</h4>
                    <span className="text-xs text-slate-400">Next automatic license charge cycles on July 1, 2026.</span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-lg font-black block">$249.00 <span className="text-xs font-normal text-slate-400">/mo</span></span>
                    <span className="text-xxs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full uppercase">Corporate SLA Tier</span>
                  </div>
                </div>

                <div className="space-y-2 max-w-xl">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Invoicing Contact E-mail</label>
                  <input
                    type="email"
                    name="billingEmail"
                    value={settingsState.billingEmail}
                    onChange={handleSelectChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-purple-500 dark:border-slate-800"
                  />
                </div>

                <div className="pt-2">
                  <button className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                    <span>Download Historical Invoice Assets Ledger</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}