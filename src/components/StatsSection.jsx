"use client";
import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const statsData = [
  {
    id: 1,
    label: 'Successful Projects',
    value: 200,
    suffix: '+',
    description: 'Delivered on time and exceeding expectations.',
  },
  {
    id: 2,
    label: 'Global Clients',
    value: 150,
    suffix: '+',
    description: 'Trusted by startups and Fortune 500 companies.',
  },
  {
    id: 3,
    label: 'Team Experts',
    value: 5,
    suffix: '',
    description: 'Dedicated professionals driven by excellence.',
  },
  {
    id: 4,
    label: 'Customer Satisfaction',
    value: 99,
    suffix: '%',
    description: 'Committed to delivering top-notch quality.',
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-3xl font-extrabold text-blue-500 mt-6 tracking-tight">
            Trusted by Businesses Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            We turn bold ideas into scalable digital products with measurable impact and success.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-blue-50/70 dark:bg-blue-950/20 p-8 rounded-2xl shadow-xl shadow-blue-500/5 dark:shadow-none border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <div>
                <div className="text-3xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                  <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
                  {stat.suffix}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {stat.label}
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}