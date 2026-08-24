"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";

const blogs = [
  {
    title: "Smart IoT Buildings",
    description:
      "How IoT sensors and AI are transforming modern building management systems.",
    image: "/images/IoT-smart.png",
    date: "Apr 6, 2026",
    author: "Rabindra Sharma",
    category: "IoT",
    readTime: "5 min read",
    slug: "smart-iot-buildings",
    content: `
Smart buildings use IoT sensors, automation, and cloud technologies
to optimize energy efficiency, security, and operational performance.
`,
  },
  {
    title: "AI in Healthcare",
    description:
      "Discover how artificial intelligence is revolutionizing patient care.",
    image: "/images/health-care.png",
    date: "Apr 5, 2026",
    author: "Dr. John Doe",
    category: "AI",
    readTime: "6 min read",
    slug: "ai-in-healthcare",
    content: `
Artificial intelligence is transforming healthcare by enabling
faster diagnosis and personalized treatment.
`,
  },
  {
    title: "Smart Traffic Systems",
    description:
      "Using sensors and machine learning for intelligent traffic management.",
    image: "/images/smart-traffic.png",
    date: "Apr 4, 2026",
    author: "UrbanTech",
    category: "Smart City",
    readTime: "5 min read",
    slug: "smart-traffic-systems",
    content: `
Smart traffic systems leverage advanced multi-sensor nodes alongside predictive cloud algorithms to reduce intersection wait-times.
`,
  },
  {
    title: "Web Development",
    description:
      "Building enterprise-grade applications with modern web technologies.",
    image: "/images/webblog.png",
    date: "June 4, 2026",
    author: "Anand Sharma",
    category: "Development",
    readTime: "4 min read",
    slug: "web-development",
    content: `Web development is the process of building and maintaining websites and web applications.`,
  },
];

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
    if (isNaN(timestamp)) {
      return dateString;
    }
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
        console.error(
          "API Fetch failed, using static fallback data:",
          err.message
        );
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <p className="p-8 text-center text-slate-600 dark:text-slate-400">
        Loading blogs...
      </p>
    );
  if (!blogData || blogData.length === 0)
    return <p className="p-8 text-center text-slate-500">No articles found.</p>;

  const featuredBlog = blogData[0];

  return (
    <section id="blog" className="py-12 sm:py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1.5 sm:py-2 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-medium text-xs sm:text-sm">
            Latest Articles
          </span>
          <h2 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Insights & Technology Blogs
          </h2>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
            Explore the latest trends in software development, AI, cloud
            computing, IoT, and digital transformation.
          </p>
        </div>

        {/* Featured Blog */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-8 sm:mb-12 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Link href={`/blogs/${featuredBlog.slug}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-800 cursor-pointer">
              
              {/* Featured Image Container */}
              <div className="relative h-56 sm:h-72 md:h-80 lg:h-full min-h-[240px] sm:min-h-[300px] w-full overflow-hidden">
                <Image
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              {/* Featured Content */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <div>
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold">
                    Featured Post
                  </span>
                </div>
                <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl font-bold dark:text-white text-slate-900 leading-snug">
                  {featuredBlog.title}
                </h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 line-clamp-3">
                  {featuredBlog.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <FaUser className="text-cyan-600 dark:text-cyan-400" />
                    {featuredBlog.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-cyan-600 dark:text-cyan-400" />
                    {formatDate(featuredBlog.createdAt || featuredBlog.date)}
                  </span>
                </div>
                <div className="mt-6 sm:mt-8">
                  <span className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogData.slice(1).map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Link href={`/blogs/${blog.slug}`} className="block h-full">
                <div className="group bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-slate-100 dark:border-slate-800">
                  
                  {/* Grid Image Container */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-cyan-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                      {blog.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                        <FaCalendarAlt className="text-cyan-600 dark:text-cyan-400" />
                        <span>{formatDate(blog.createdAt || blog.date)}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {blog.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs sm:text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[50%]">
                        {blog.author}
                      </span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link href="/blogs">
            <button className="px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs sm:text-sm font-semibold hover:scale-105 transition-transform active:scale-95 shadow-md">
              View All Articles
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}