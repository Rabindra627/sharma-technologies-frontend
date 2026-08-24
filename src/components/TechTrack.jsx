"use client";

import { motion } from "framer-motion";
import { FaCodeBranch, FaLayerGroup } from "react-icons/fa";

export default function TechTrack() {
  const techStats = [
    {
      name: "Next.js",
      category: "Frontend Framework",
      percentage: 100,
      colorClass: "bg-slate-900",
      glowColor: "shadow-slate-900/20",
      bgLight: "bg-slate-100",
      textColor: "text-slate-900"
    },
    {
      name: "Tailwind CSS",
      category: "UI & Layout Engine",
      percentage: 99.9,
      colorClass: "bg-cyan-500",
      glowColor: "shadow-cyan-500/30",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600"
    },
    {
      name: "TypeScript",
      category: "Logic & Type Safety",
      percentage: 99,
      colorClass: "bg-blue-600",
      glowColor: "shadow-blue-600/30",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      name: "Framer Motion",
      category: "Physics & UI Animations",
      percentage: 85,
      colorClass: "bg-fuchsia-500",
      glowColor: "shadow-fuchsia-500/30",
      bgLight: "bg-fuchsia-50",
      textColor: "text-fuchsia-600"
    },
    {
      name: "Java Core Engine",
      category: "Enterprise Systems",
      percentage: 100,
      colorClass: "bg-orange-500",
      glowColor: "shadow-orange-500/30",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      name: "Generative AI Integration", 
      category: "LLM & Agent Pipelines",
      percentage: 75,
      colorClass: "bg-amber-500",
      glowColor: "shadow-amber-500/30",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      name: "Spring Boot", 
      category: "Microservices & API",
      percentage: 80,
      colorClass: "bg-emerald-500",
      glowColor: "shadow-emerald-500/30",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      name: "Hibernate ORM", 
      category: "Data Persistence",
      percentage: 99,
      colorClass: "bg-cyan-600",
      glowColor: "shadow-cyan-600/30",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    {
      name: "SQL Server", 
      category: "Relational Database",
      percentage: 100,
      colorClass: "bg-rose-500",
      glowColor: "shadow-rose-500/30",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600"
    },
    {
      name: "Oracle DB", 
      category: "High-Availability DB",
      percentage: 99.9,
      colorClass: "bg-red-600",
      glowColor: "shadow-red-600/30",
      bgLight: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      name: "Node.js", 
      category: "Runtime & Backend Services",
      percentage: 89.99,
      colorClass: "bg-green-600",
      glowColor: "shadow-green-600/30",
      bgLight: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  // Container configuration for smooth staggered item reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 240, damping: 20 },
    },
  };

  return (
    <section id="stacks" className="w-full py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 relative overflow-hidden font-sans">
      
      {/* Background Lighting Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-cyan-700 text-xs font-extrabold uppercase tracking-widest bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100 shadow-sm"
          >
            <FaLayerGroup className="text-cyan-500" /> Technology Ecosystem
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-3xl font-black tracking-tight text-slate-900 mt-5"
          >
            Our Core <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">Tech Stacks</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            A high-performance breakdown of modern frameworks, language engines, and database systems powering our enterprise builds.
          </motion.p>
        </div>

        {/* Stacks Grid with Interactive Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {techStats.map((tech) => (
            <motion.div 
              key={tech.name} 
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-cyan-300/80 transition-all duration-300 group relative"
            >
              {/* Header Label Line */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors flex items-center gap-2">
                    <FaCodeBranch className="text-slate-300 group-hover:text-cyan-500 transition-colors text-sm" />
                    {tech.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {tech.category}
                  </p>
                </div>

                <span className={`text-xs font-black tracking-wider px-3 py-1 rounded-full border border-slate-100 ${tech.bgLight} ${tech.textColor} shadow-sm`}>
                  {tech.percentage}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-100/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50 relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${tech.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className={`h-full rounded-full ${tech.colorClass} ${tech.glowColor} shadow-md relative`}
                >
                  {/* Subtle Light Reflection Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Note Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="inline-block px-5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-[11px] font-bold tracking-widest uppercase text-slate-400 shadow-sm">
            Percentages reflect standard code allocation & core system design integration.
          </p>
        </motion.div>
        
      </div>
    </section>
  );
}