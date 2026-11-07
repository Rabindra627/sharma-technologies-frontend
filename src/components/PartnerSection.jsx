"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Sample partner brand data (replace with your actual partner logos/names)
const partners = [
  { id: 1, name: 'CloudScale', logo: '☁️ CloudScale' },
  { id: 2, name: 'DataCore', logo: '📊 DataCore' },
  { id: 3, name: 'CyberGuard', logo: '🛡️ CyberGuard' },
  { id: 4, name: 'QuantumPay', logo: '💳 QuantumPay' },
  { id: 5, name: 'DevOpsify', logo: '⚙️ DevOpsify' },
  { id: 6, name: 'InnoVenture', logo: '💡 InnoVenture' },
  { id: 7, name: 'AlphaNet', logo: '🌐 AlphaNet' },
];

export default function PartnerSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Strategic Partners & Alliances
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Collaborating with industry leaders to drive innovation
          </p>
        </div>
      </div>

      {/* Infinite Logo Marquee Container */}
      <div className="relative w-full overflow-hidden flex items-center py-6">
        
        {/* Left and Right Fade Gradients for Smooth Edges */}
        <div className="absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex w-max">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex items-center gap-12 sm:gap-16 pr-12 sm:pr-16 shrink-0 hover:[animation-play-state:paused]"
          >
            {/* Render items twice to achieve a seamless infinite loop effect */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center px-8 py-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm shadow-gray-100 dark:shadow-none hover:border-blue-400 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 min-w-[180px] sm:min-w-[210px]"
              >
                <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {partner.logo}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}