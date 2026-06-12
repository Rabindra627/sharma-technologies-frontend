"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Mail,
  Users,
  LogOut,
  FolderKanban,
  Briefcase,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      link: "/dashboard/manage-users",
      icon: Users,
    },
    {
      name: "Inquiries",
      link: "/dashboard/inquiries",
      icon: Mail,
    },
    {
      name: "Projects",
      link: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Clients",
      link: "/dashboard/clients",
      icon: Briefcase,
    },
  ];

  const onLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        localStorage.removeItem("user");
        sessionStorage.clear();

        router.push("/");
        router.refresh();
      }
    } catch (error) {
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

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50
          h-screen
          bg-white/95 backdrop-blur-xl
          border-r border-slate-200
          shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-58"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-15 flex items-center px-6 border-b border-slate-100">
          <div className="w-12 h-12  bg-gradient-to-r from-white-600 to-white-600 flex items-center justify-center text-white font-bold">
            <img
              src="/images/sharma-tech.png"
              alt="Admin"
              width={100}
              height={100}
              className="rounded-xl object-cover"
            />
          </div>

          {!collapsed && (
            <div className="ml-3">
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="px-3 py-6 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`
                  group relative flex items-center gap-4
                  px-4 py-3 rounded-2xl
                  transition-all duration-300
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {/* Active Indicator */}
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                )}

                <div
                  className={`
                    p-2 rounded-xl transition
                    ${
                      active
                        ? "bg-white/20"
                        : "bg-slate-100 group-hover:bg-white"
                    }
                  `}
                >
                  <Icon size={18} />
                </div>

                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={onLogout}
            className="
              w-full flex items-center justify-center gap-2
              py-3 rounded-2xl
              bg-gradient-to-r from-red-500 to-rose-500
              text-white font-medium
              shadow-lg
              hover:scale-[1.02]
              transition-all duration-300
            "
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
