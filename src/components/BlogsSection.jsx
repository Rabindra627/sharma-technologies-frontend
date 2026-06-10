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
];

export default function BlogsSection() {
  return (
    <section id="blog" className="py-16 px-5 md:px-16 bg-gray-50 dark:bg-gray-900">
      <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{opacity: 1, y: 1}}
          transition={{ duration: 0.7 , delay: 0.2}}
        className="text-3xl font-bold text-center mb-10 dark:text-white text-blue-400">
        Latest Blogs
      </motion.h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        {blogs.map((blog, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <BlogCard {...blog} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}