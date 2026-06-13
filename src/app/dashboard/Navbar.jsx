"use client";

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
  return (
    <header className="sticky top-0 z-40">
      <div className="h-15 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          
          {/* Mobile Menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              lg:hidden
              p-2 rounded-xl
              hover:bg-slate-100
              transition-all
            "
          >
            <Menu size={22} />
          </button>

          {/* Desktop Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              hidden lg:flex
              p-2 rounded-xl
              hover:bg-slate-100
              transition-all
            "
          >
            <Menu size={20} />
          </button>

          <div>
            {/* <h1 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-xs text-slate-500">
              Welcome back 👋
            </p> */}
          </div>
        </div>

        {/* Center Search */}
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
                bg-white-100
                border border-transparent
                focus:border-purple-500
                focus:ring-4
                focus:ring-purple-100
                outline-none
                transition-all
              "
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          
          {/* Notification */}
          <button
            className="
              relative
              p-3
              rounded-2xl
              bg-slate-100
              hover:bg-slate-200
              transition-all
            "
          >
            <Bell size={20} />

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

          {/* User Profile */}
          <button
            className="
              flex items-center gap-3
              bg-white
              border border-slate-200
              rounded-2xl
              px-3 py-1
              m-2
              hover:shadow-md
              transition-all
            "
          >
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Admin"
              className="
                w-10 h-10
                rounded-xl
                object-cover
              "
            />

            <div className="hidden sm:block text-left">
              <h4 className="text-sm font-semibold text-slate-800">
                Rabindra
              </h4>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-500"
            />
          </button>
        </div>
      </div>
    </header>
  );
}