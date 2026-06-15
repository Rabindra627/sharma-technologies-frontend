"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const blogs = [
  {
    title: "Smart IoT Buildings",
    description:
      "How IoT sensors and AI are transforming modern building management systems.",
    image: "/images/IoT-smart.png",
    date: "Apr 6, 2026",
    author: "Rabindra Sharma",
    category: "IoT",
    slug: "smart-IoT-buildings",
  },
  {
    title: "AI in Healthcare",
    description:
      "Discover how artificial intelligence is revolutionizing patient care.",
    image: "/images/health-care.png",
    date: "Apr 5, 2026",
    author: "Dr. John Doe",
    category: "AI",
    slug: "ai-in-healthcare",
  },
  {
    title: "Smart Traffic Systems",
    description:
      "Using sensors and machine learning for intelligent traffic management.",
    image: "/images/smart-traffic.png",
    date: "Apr 4, 2026",
    author: "UrbanTech",
    category: "Smart City",
    slug: "smart-traffic-systems",
  },
  {
    title: "Web Development",
    description:
      "Building enterprise-grade applications with modern web technologies.",
    image: "/images/webblog.png",
    date: "June 4, 2026",
    author: "Anand Sharma",
    category: "Development",
    slug: "web-development",
  },
];

export default function BlogsSection() {
  return (
    <section
      id="blogs"
      className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 font-medium text-sm">
            Latest Articles
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Insights & Technology Blogs
          </h2>

          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
            Explore the latest trends in software development, AI, cloud
            computing, IoT, and digital transformation.
          </p>
        </div>

        {/* Featured Blog */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl mb-12"
        >
          <Link href={`/blogs/${blogs[0].slug}`}>
            <div className="grid lg:grid-cols-2 bg-white dark:bg-slate-800 shadow-xl">

              <div className="relative h-[300px] lg:h-[500px]">
                <Image
                  src={blogs[0].image}
                  alt={blogs[0].title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="w-fit px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                  Featured Post
                </span>

                <h3 className="mt-6 text-3xl md:text-5xl font-bold dark:text-white">
                  {blogs[0].title}
                </h3>

                <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
                  {blogs[0].description}
                </p>

                <div className="flex flex-wrap gap-5 mt-6 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <FaUser />
                    {blogs[0].author}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    {blogs[0].date}
                  </span>
                </div>

                <button className="mt-8 w-fit px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition">
                  Read Article →
                </button>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {blogs.slice(1).map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">

                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />

                    <span className="absolute top-4 left-4 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6">

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {blog.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold dark:text-white group-hover:text-cyan-600 transition">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-slate-600 dark:text-slate-400">
                      {blog.description}
                    </p>

                    <div className="flex justify-between items-center mt-6">
                      <span className="text-sm text-slate-500">
                        {blog.author}
                      </span>

                      <span className="text-cyan-600 font-semibold">
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
        <div className="text-center mt-16">
          <Link href="/blogs">
            <button className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold hover:scale-105 transition">
              View All Articles
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}