"use client";

import { motion } from "framer-motion";

export default function TechTrack() {
  const techStats = [
    {
      name: "Next.js",
      percentage: 45,
      colorClass: "bg-slate-900",
      bgLight: "bg-slate-100",
      textColor: "text-slate-900"
    },
    {
      name: "Tailwind CSS (UI & Layout)",
      percentage: 30,
      colorClass: "bg-cyan-500",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600"
    },
    {
      name: "TypeScript (Logic & Types)",
      percentage: 15,
      colorClass: "bg-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      name: "Framer Motion (Animations)",
      percentage: 10,
      colorClass: "bg-fuchsia-500",
      bgLight: "bg-fuchsia-50",
      textColor: "text-fuchsia-600"
    },
    {
      name: "Java Core Engine",
      percentage: 100,
      colorClass: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      name: "Generative AI Integration", 
      percentage: 20,
      colorClass: "bg-amber-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600"
    },
  ];

  // Container configuration for smooth staggered item reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="stacks" className="w-full py-16 sm:py-24 bg-white text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-blue-400"
          >
            Our Stacks
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed"
          >
            A clear structural breakdown of the modern technologies driving our agency&apos;s web builds and application architectures.
          </motion.p>
        </div>

        {/* Dynamic Responsive Columns Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8"
        >
          {techStats.map((tech) => (
            <motion.div 
              key={tech.name} 
              variants={itemVariants}
              className="flex flex-col space-y-2.5 group"
            >
              {/* Labels Line */}
              <div className="flex justify-between items-end px-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide transition-colors group-hover:text-slate-900">
                  {tech.name}
                </span>
                <span className={`text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-full ${tech.bgLight} ${tech.textColor}`}>
                  {tech.percentage}%
                </span>
              </div>

              {/* Minimal Clean Track */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden relative">
                {/* Smooth Animated Width Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${tech.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease:"easeOut", delay: 0.1 }}
                  className={`h-full rounded-full ${tech.colorClass} relative`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Explanatory Architecture Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16 text-center text-[11px] font-medium tracking-wide uppercase text-slate-400 max-w-md mx-auto"
        >
          Percentages reflect standard code volume allocation and core component design architecture.
        </motion.p>
        
      </div>
    </section>
  );
}