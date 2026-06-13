"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar({
  setCollapsed,
  collapsed,
  setMobileOpen,
}) {
  const [isOpen, setIsOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const menuRef = useRef(null);

  // Mock Active User Data matching your interface layout
  const currentUser = {
    name: "Rabindra Sharma",
    role: "Administrator",
    email: "rabindra@enterprise.io",
    avatarUrl: "https://i.pravatar.cc/150?img=12"
  };

  const storedUser = JSON.parse(localStorage.getItem("user"));
 
  // Close the popup menu gracefully if clicked outside the container
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40">
      <div className="h-15 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between shadow-sm dark:bg-slate-900/90 dark:border-slate-800">
        
        {/* Left Side Controls */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              lg:hidden
              p-2 rounded-xl
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-all
            "
          >
            <Menu size={22} className="text-slate-700 dark:text-slate-200" />
          </button>

          {/* Desktop Collapse Trigger */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              hidden lg:flex
              p-2 rounded-xl
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-all
            "
          >
            <Menu size={20} className="text-slate-700 dark:text-slate-200" />
          </button>

          <div />
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-10">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                w-full
                pl-12 pr-4 py-3
                rounded-2xl
                bg-slate-50
                dark:bg-slate-950
                border border-transparent
                focus:border-purple-500
                focus:ring-4
                focus:ring-purple-100
                dark:focus:ring-purple-950/30
                outline-none
                transition-all
                text-slate-800
                dark:text-slate-100
              "
            />
          </div>
        </div>

        {/* Right Side Utility Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Utility */}
          <button
            className="
              relative
              p-3
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
              hover:bg-slate-200
              dark:hover:bg-slate-700
              transition-all
            "
          >
            <Bell size={20} className="text-slate-700 dark:text-slate-200" />

            <span
              className="
                absolute
                top-2 right-2
                w-2.5 h-2.5
                bg-red-500
                rounded-full
              "
            />
          </button>

          {/* Interactive User Profile Menu Wrapper */}
          <div className="relative inline-block text-left" ref={menuRef}>
            
            {/* Dropdown Anchor Target Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                flex items-center gap-3
                bg-white
                dark:bg-slate-950
                border border-slate-200
                dark:border-slate-800
                rounded-2xl
                px-3 py-1.5
                hover:shadow-md
                transition-all
                outline-none
                active:scale-[0.98]
              "
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <img
                src={storedUser?.avatarUrl || currentUser.avatarUrl}
                alt={`profile`}
                className="
                  w-9 h-9
                  rounded-xl
                  object-cover
                "
              />

              <div className="hidden sm:block text-left">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {storedUser.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                  {currentUser.role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* POPUP DROPDOWN MENU PANEL */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 focus:outline-none z-50 transform transition-all animate-scaleIn">
                
                {/* User Account Quick Details Card */}
                <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 rounded-t-2xl">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Signed In As</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={storedUser?.avatarUrl || currentUser.avatarUrl}
                      alt={'profile'}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="overflow-hidden">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm truncate">{storedUser.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block truncate font-mono">{storedUser.email}</span>
                    </div>
                  </div>
                </div>

                {/* Action Links & Navigation Options */}
                <div className="p-1.5 space-y-0.5">
                  <a
                    href="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Account Profile</span>
                  </a>

                  <a
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors group"
                  >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.767c-.31.236-.465.62-.412 1.002a5.573 5.573 0 010 .534c-.053.382.102.766.412 1.002l1.003.767c.383.293.493.814.26 1.43l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.216-.456a1.125 1.125 0 00-1.076.124a5.507 5.507 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 00-.646-.87a5.555 5.555 0 01-.22-.127a1.125 1.125 0 00-1.074-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.003-.767c.31-.236.465-.62.412-1.002a5.56 5.56 0 010-.534c.053-.382-.102-.766-.412-1.002l-1.003-.767a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.644-.869l.214-1.28z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>System Settings</span>
                  </a>
                </div>

                {/* Session Termination Button Divider */}
                <div className="p-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      alert("Ending dashboard session...");
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors group text-left"
                  >
                    <svg className="w-4 h-4 text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}