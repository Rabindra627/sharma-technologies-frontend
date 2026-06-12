"use client"
// This layout page design for responsive based by Rabindra Sharma on 03.08.2026
import { useState } from "react"
import Sidebar from "@/app/dashboard/Sidebar"
import Navbar from "@/app/dashboard/Navbar"

export default function AdminLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (

    <div className="flex h-screen bg-gray-100">
      {/* Sidebar added on 03.08.2026 */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar added on 03.08.2026 */}
        <Navbar
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          setMobileOpen={setMobileOpen}
        />
        {/* Below added main content view on 03.08.2026 */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}