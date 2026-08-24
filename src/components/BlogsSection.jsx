"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";

const blogs = [
  {
    title: "Smart IoT Buildings",
    description:
      "How IoT sensors and AI are transforming modern building management systems with real-time telemetry and cloud automation.",
    image: "/images/IoT-smart.png",
    date: "Apr 6, 2026",
    author: "Rabindra Sharma",
    category: "IoT & Cloud",
    readTime: "5 min read",
    slug: "smart-iot-buildings",
  },
  {
    title: "AI in Healthcare",
    description:
      "Discover how artificial intelligence is revolutionizing patient care, diagnostic workflows, and automated triage.",
    image: "/images/health-care.png",
    date: "Apr 5, 2026",
    author: "Dr. John Doe",
    category: "AI Systems",
    readTime: "6 min read",
    slug: "ai-in-healthcare",
  },
  {
    title: "Smart Traffic Systems",
    description:
      "Using edge sensors and machine learning algorithms to optimize intersection signals and cut urban commute times.",
    image: "/images/smart-traffic.png",
    date: "Apr 4, 2026",
    author: "UrbanTech",
    category: "Smart City",
    readTime: "5 min read",
    slug: "smart-traffic-systems",
  },
  {
    title: "Web Development",
    description:
      "Building enterprise-grade applications with modern web technologies, headless architectures, and scalable cloud pipelines.",
    image: "/images/webblog.png",
    date: "June 4, 2026",
    author: "Anand Sharma",
    category: "Engineering",
    readTime: "4 min read",
    slug: "web-development",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 20 },
  },
};

export default function BlogsSection() {
  const [blogData, setBlogData] = useState(blogs);
  const [loading, setLoading] = useState(true);

  const dateObject = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) return dateString;
    return dateObject.format(new Date(timestamp));
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs");
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setBlogData(result.data);
        }
      } catch (err) {
        console.error("API Fetch failed, using static fallback data:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="py-24 text-center bg-white text-slate-500 font-medium">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent mb-4" />
        <p>Fetching technical insights...</p>
      </div>
    );

  if (!blogData || blogData.length === 0)
    return <p className="py-24 text-center text-slate-500 bg-white">No articles found.</p>;

  const featuredBlog = blogData[0];

  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-900 relative overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-200/20 rounded-full blur-[130px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-cyan-600 text-xs font-bold uppercase tracking-widest bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100 shadow-sm"
          >
            Engineering Insights & Articles
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-3xl font-extrabold text-blue-400 mt-6 tracking-tight"
          >
            Latest Technical Blogs
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed"
          >
            Explore hands-on guides, system architecture trends, AI pipelines, and digital transformation strategy.
          </motion.p>
        </div>

        {/* Featured Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/60 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 mb-12 group"
        >
          <Link href={`/blogs/${featuredBlog.slug}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Image Container with object-contain */}
              <div className="lg:col-span-7 relative h-72 sm:h-80 md:h-96 lg:h-[420px] w-full bg-slate-50 p-6 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    fill
                    priority
                    className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-800 shadow-md border border-slate-100">
                  Featured Article
                </span>
              </div>

              {/* Content Box */}
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full bg-white">
                <div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-cyan-600 mb-3">
                    <span className="bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                      {featuredBlog.category || "Tech"}
                    </span>
                    {featuredBlog.readTime && (
                      <span className="flex items-center gap-1 text-slate-400 font-medium">
                        <FaClock size={11} /> {featuredBlog.readTime}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug">
                    {featuredBlog.title}
                  </h3>

                  <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                    {featuredBlog.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FaUser className="text-cyan-600" />
                      {featuredBlog.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-cyan-600" />
                      {formatDate(featuredBlog.createdAt || featuredBlog.date)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-full bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                    <FaArrowRight size={13} />
                  </div>
                </div>
              </div>

            </div>
          </Link>
        </motion.div>

        {/* Grid Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogData.slice(1).map((blog) => (
            <motion.div
              key={blog.slug}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-cyan-200 transition-all duration-300 flex flex-col justify-between"
            >
              <Link href={`/blogs/${blog.slug}`} className="flex flex-col h-full justify-between">
                <div>
                  {/* Fitted Image Frame */}
                  <div className="relative h-56 w-full bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                    <div className="relative w-full h-full">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-cyan-600 shadow-sm border border-slate-100">
                      {blog.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-cyan-600" />
                        {formatDate(blog.createdAt || blog.date)}
                      </span>
                      {blog.readTime && <span>{blog.readTime}</span>}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-slate-500 text-xs leading-relaxed">
                      {blog.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex justify-between items-center text-xs font-semibold text-slate-600 group-hover:text-cyan-600 transition-colors">
                  <span className="truncate max-w-[60%] text-slate-400 font-normal">By {blog.author}</span>
                  <span className="flex items-center gap-1.5 font-bold">
                    Read Article <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Button */}
        <div className="text-center mt-16">
          <Link href="/blogs">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white hover:bg-cyan-600 text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-lg shadow-slate-900/10"
            >
              Explore All Articles
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}