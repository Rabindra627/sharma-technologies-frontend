"use client";

import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  FolderKanban,
  DollarSign,
  TrendingUp,
  Mail,
  UserPlus,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Activities
const activities = [
  {
    title: "New client added",
    time: "2 minutes ago",
    icon: Users,
  },
  {
    title: "New project added",
    time: "10 minutes ago",
    icon: FolderKanban,
  },
  {
    title: "New inquiry received",
    time: "25 minutes ago",
    icon: Mail,
  },
  {
    title: "New user registered",
    time: "1 hour ago",
    icon: UserPlus,
  },
];

const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 5500 },
  { month: "Mar", revenue: 8000 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 9800 },
  { month: "Jun", revenue: 12000 },
];

const projectData = [
  { name: "Web", total: 12 },
  { name: "App", total: 8 },
  { name: "CRM", total: 15 },
  { name: "CMS", total: 10 },
];

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Revenue",
      value: "$48,560",
      icon: DollarSign,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Projects",
      value: "42",
      icon: FolderKanban,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Clients",
      value: "28",
      icon: Briefcase,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Users",
      value: "8,420",
      icon: Users,
      color: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="p-1 space-y-2">
      {/* Header */}
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h3>

                  <div className="flex items-center gap-1 mt-3 text-green-500">
                    <TrendingUp size={16} />
                    +12.4%
                  </div>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          );
        })} */}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-6">Revenue Growth</h2>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

          {/* {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users size={18} />
              </div>

              <div>
                <h4 className="font-medium">New client added</h4>

                <p className="text-sm text-slate-500">2 minutes ago</p>
              </div>
            </div>
          ))} */}
          {activities.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Icon size={18} className="text-purple-600" />
                </div>

                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.time}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-6">Projects Overview</h2>

        <div className="h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="total" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
