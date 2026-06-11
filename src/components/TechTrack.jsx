// app/page.tsx
"use client"; // Required for Framer Motion client-side animations

import { motion } from "framer-motion";

export default function TechTrack() {
  const techStats = [
    {
      name: "Next.js (App Router & SSR)",
      percentage: 45,
      colorGradient: "from-zinc-950 via-zinc-800 to-black",
      glowColor: "shadow-black/40",
    },
    {
      name: "Tailwind CSS (UI & Layout)",
      percentage: 30,
      colorGradient: "from-sky-300 via-sky-400 to-sky-500",
      glowColor: "shadow-sky-400/50",
    },
    {
      name: "TypeScript (Logic & Types)",
      percentage: 15,
      colorGradient: "from-blue-700 via-blue-600 to-blue-800",
      glowColor: "shadow-blue-500/50",
    },
    {
      name: "Framer Motion (Animations)",
      percentage: 10,
      colorGradient: "from-purple-500 via-fuchsia-500 to-purple-600",
      glowColor: "shadow-fuchsia-500/60",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md rounded-full">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl font-extrabold text-blue-400 sm:text-4xl tracking-tight"
          >
            Our Stacks
          </motion.h1>
          <p className="mt-3 text-lg text-gray-500">
            A percentage breakdown of technologies driving our agency&apos;s web
            builds.
          </p>
        </div>

        {/* Framer Motion Animation Container */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.7, x: 1 }}
          transition={{ duration: 0.6, delay : 0.1 }}
          className="space-y-8"
        >
          {techStats.map((tech) => (
            <div key={tech.name} className="relative group">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-sm font-bold text-gray-800 tracking-wide">
                  {tech.name}
                </span>
                <span className="text-sm font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md shadow-sm">
                  {tech.percentage}%
                </span>
              </div>

              {/* 3D Deeply Beveled Progress Bar Track */}
              <div className="w-full bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100 rounded-full h-7 p-[3px] shadow-[inset_0_4px_6px_rgba(0,0,0,0.2),_0_1px_2px_rgba(255,255,255,0.8)] border border-gray-300/60 overflow-hidden">
                {/* 3D Liquid/Glass Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tech.percentage}%` }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className={`relative h-full rounded-full bg-gradient-to-r ${tech.colorGradient} shadow-[0_3px_8px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.4)] ${tech.glowColor} shadow-lg transition-all overflow-hidden`}
                >
                  {/* High-Gloss Top Reflection Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />

                  {/* Subtle Neon Edge Glow Highlight */}
                  <div className="absolute inset-0 border border-white/20 rounded-full pointer-events-none" />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer info breakdown */}
        <div className="mt-10 pt-6 border-t border-gray-200/80 text-center text-xs font-medium text-gray-400">
          Percentages reflect standard code volume allocation and component
          design architecture.
        </div>
      </div>
    </div>
  );
}
