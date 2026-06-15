"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";

const blogs = [
  {
    title: "Smart IoT Buildings",
    description: "How IoT is transforming modern building management.",
    image: "/images/IoT-smart.png",
    date: "Apr 6, 2026",
    author: "Rabindra Sharma",
  },
  {
    title: "AI in Healthcare",
    description: "Revolutionizing patient care with AI-powered tools.",
    image: "/images/health-care.png",
    date: "Apr 5, 2026",
    author: "Dr. John Doe",
  },
  {
    title: "Smart Traffic Systems",
    description: "Using AI and sensors for intelligent traffic control.",
    image: "/images/smart-traffic.png",
    date: "Apr 4, 2026",
    author: "UrbanTech",
  },
  {
    title: "Web Development",
    description: "Building website for enterprise business and platform.",
    image: "/images/webblog.png",
    date: "June 4, 2026",
    author: "Anand Sharma",
  },
];

export default function BlogsSection() {
  // Container configuration for smooth staggered items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      },
    }
  };

  // Card individual upward animation fade
  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="blog" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Latest Blogs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Stay updated with our recent insights, tech breakdowns, and engineering innovations.
          </motion.p>
        </div>

        {/* Dynamic Responsive Progressive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeInOut" } }}
              className="h-full flex"
            >
              <div className="w-full flex bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 border border-slate-100 dark:border-slate-800/60">
                <BlogCard {...blog} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}