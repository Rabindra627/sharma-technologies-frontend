"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Mail,
  Users,
  LogOut,
  FolderKanban,
  Briefcase,
  ChevronDown,
  Circle
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Track open states for submenus
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (name) => {
    if (collapsed && setCollapsed) {
      setCollapsed(false);
    }
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const menu = [
    { 
      name: "Dashboard", 
      link: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "Users", 
      icon: Users,
      hasSubmenu: true,
      subItems: [
        { name: "All Users", link: "/dashboard/manage-users" },
        { name: "Roles & Permissions", link: "/dashboard/manage-users/roles" },
      ]
    },
    { 
      name: "Inquiries",       
      icon: Mail,
      hasSubmenu : true,
      subItems : [
        {name : "Active Enquiry", link: "/dashboard/inquiries"}
      ] 
    },
    { 
      name: "Projects", 
      icon: FolderKanban,
      hasSubmenu: true,
      subItems: [
        { name: "Active Projects", link: "/dashboard/projects" },
        { name: "Archived", link: "/dashboard/projects/archived" },
      ]
    },
    { 
      name: "Clients",       
      icon: Briefcase ,
      hasSubmenu : true,
      subItems: [
        {name: 'All Clients', link: "/dashboard/clients"}
      ]
    },
  ];

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("user");
        sessionStorage.clear();
        toast.success('Logged Out Successfully!');
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      }
    } catch (error) {
      toast.error("Error logging out");
      console.error(error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:relative z-50
          h-screen
          bg-white/95 backdrop-blur-xl
          border-r border-slate-200
          shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)]
          transition-all duration-300 ease-in-out overflow-x-hidden
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="h-15 flex items-center px-4 border-b border-slate-100 overflow-hidden">
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-50">
            <img
              src="/images/sharma-tech.png"
              alt="Admin"
              className="w-8 h-8 rounded-lg object-cover"
            />
          </div>

          <div
            className={`ml-3 transition-all duration-300 ease-in-out whitespace-nowrap ${
              collapsed ? "opacity-0 translate-x-[-10px] pointer-events-none" : "opacity-100 translate-x-0"
            }`}
          >            
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="px-3 py-4 space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const isSubmenuOpen = !!openSubmenus[item.name];
            
            const isParentActive = item.hasSubmenu 
              ? item.subItems.some(sub => pathname === sub.link)
              : pathname === item.link;

            if (item.hasSubmenu) {
              return (
                <div key={item.name} className="space-y-1">
                  {/* Dropdown Trigger Header Button */}
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`
                      w-full group relative flex items-center p-1.5 rounded-xl
                      transition-all duration-300 ease-in-out
                      ${
                        isParentActive && !collapsed
                          ? "bg-slate-50 text-slate-900 font-medium" 
                          : "text-slate-600 hover:bg-slate-50/70"
                      }
                    `}
                  >
                    <div
                      className={`
                        p-1.5 rounded-lg transition-all duration-300 flex-shrink-0
                        ${isParentActive ? "bg-slate-200/60 text-slate-800" : "bg-slate-50 group-hover:bg-white text-slate-500"}
                      `}
                    >
                      <Icon size={16} />
                    </div>

                    <span
                      className={`
                        ml-2.5 font-medium text-xs whitespace-nowrap transition-all duration-300 ease-in-out
                        ${collapsed ? "opacity-0 translate-x-[-10px] pointer-events-none" : "opacity-100 translate-x-0"}
                      `}
                    >
                      {item.name}
                    </span>

                    {/* Chevron Indicator */}
                    {!collapsed && (
                      <ChevronDown
                        size={14}
                        className={`ml-auto text-slate-400 transition-transform duration-300 ${
                          isSubmenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Smooth Animated Height Submenu Container */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isSubmenuOpen && !collapsed
                        ? "grid-rows-[1fr] opacity-100 mt-0.5"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden space-y-0.5 pl-9 pr-2">
                      {item.subItems.map((sub) => {
                        const isChildActive = pathname === sub.link;
                        return (
                          <Link
                            key={sub.link}
                            href={sub.link}
                            className={`
                              flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition-all duration-200
                              ${
                                isChildActive
                                  ? "text-slate-900 bg-slate-100 font-semibold"
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                              }
                            `}
                          >
                            <Circle 
                              size={5} 
                              className={isChildActive ? "fill-slate-800 stroke-slate-800" : "fill-slate-300 stroke-slate-300"} 
                            />
                            <span className="whitespace-nowrap">{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Top Level Link Item (No children)
            return (
              <Link
                key={item.link}
                href={item.link}
                className={`
                  group relative flex items-center p-1.5 rounded-xl
                  transition-all duration-300 ease-in-out
                  ${
                    isParentActive
                      ? "bg-slate-50 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50/70"
                  }
                `}
              >
                {isParentActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-900 rounded-r-full" />
                )}

                <div
                  className={`
                    p-1.5 rounded-lg transition-all duration-300 flex-shrink-0
                    ${
                      isParentActive
                        ? "bg-slate-200/60 text-slate-800"
                        : "bg-slate-50 group-hover:bg-white text-slate-500"
                    }
                  `}
                >
                  <Icon size={16} />
                </div>

                <span
                  className={`
                    ml-2.5 whitespace-nowrap transition-all duration-300 ease-in-out
                    ${collapsed ? "opacity-0 translate-x-[-10px] pointer-events-none" : "opacity-100 translate-x-0"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section (Logout) */}
        <div className="absolute bottom-3 left-0 right-0 px-3">
          <button
            onClick={onLogout}
            className={`
              flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-950 
              border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 
              hover:shadow-sm text-slate-600 dark:text-slate-400 hover:text-red-600
              transition-all outline-none active:scale-[0.98]
            `}
          >
            <div className="flex-shrink-0">
              <LogOut size={16} />
            </div>
            <span
              className={`
                whitespace-nowrap font-medium text-xs transition-all duration-300 ease-in-out
                ${collapsed ? "w-0 opacity-0 ml-0 pointer-events-none" : "w-auto opacity-100 ml-1"}
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}