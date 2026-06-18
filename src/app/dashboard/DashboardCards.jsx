"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, FolderKanban, Mail, Users, TrendingUp } from "lucide-react";

export default function DashboardCards() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnquiries: 0,
    totalProjects: 0,
    totalClients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/auth/stats");
        const data = await res.json();

        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Users",
      count: stats.totalUsers,
      growth: "+12%",
      icon: Users,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Enquiries",
      count: stats.totalEnquiries,
      growth: "+18%",
      icon: Mail,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Projects",
      count: stats.totalProjects,
      growth: "+7%",
      icon: FolderKanban,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Clients",
      count: stats.totalClients,
      growth: "+22%",
      icon: Briefcase,
      color: "from-emerald-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={index}
            whileHover={{ y: -8,scale: 1.02,}}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl border border-slate-100"
          >
            {/* Background Glow */}
            <div
              className={`absolute top-0 right-0 w-40 h-10 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-3xl`}
            />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm">{card.title}</p>

                <h3 className="text-2xl font-bold mt-3 text-slate-800">
                  {card.count || 0}

                  
                </h3>

                <div className="flex items-center gap-1 mt-1 text-green-500">
                  <TrendingUp size={12} />
                  <span className="text-sm font-medium">{card.growth}</span>
                </div>
              </div>

              <div
                className={`w-14 h-10 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white shadow-lg`}
              >
                <Icon size={14} />
              </div>
            </div>

            {/* Mini Graph */}
            {/* <div className="mt-1 flex items-end gap-1 h-8">
              {[20, 35, 25, 55, 40, 75, 65].map(
                (bar, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${bar}%` }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                    }}
                    className={`flex-1 rounded-t-md bg-gradient-to-t ${card.color}`}
                  />
                )
              )}
            </div> */}
          </motion.div>
        );
      })}
    </div>
  );
}
