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

Modern facilities integrate connected devices that continuously monitor
temperature, humidity, occupancy, lighting, and HVAC systems.

These systems generate real-time data which enables predictive
maintenance and automated decision-making.

Organizations can significantly reduce operating costs while
improving sustainability and occupant comfort.

The future of smart infrastructure will be powered by AI,
edge computing, and cloud-based analytics platforms.
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

Machine learning algorithms help doctors analyze medical images,
predict diseases, and improve patient outcomes.

AI-powered systems also assist in drug discovery and clinical research.

Hospitals are increasingly adopting intelligent healthcare solutions
to enhance operational efficiency.
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
Smart traffic systems leverage advanced multi-sensor nodes alongside predictive cloud algorithms to reduce intersection wait-times, detect road incidents instantly, and dynamically route emergency services safely through dense urban districts.
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
    content: `Web development is the process of building and maintaining websites and web applications. It includes everything from creating simple static pages to complex systems like e-commerce platforms, social networks, and enterprise solutions. In today’s digital world, having a strong online presence is essential for businesses and individuals alike. A well-designed website not only attracts users but also builds trust and drives growth.`,
  },
];

export default function BlogsSection() {
  // 1. Pass your mock static 'blogs' array as the default initial state
  const [blogData, setBlogData] = useState(blogs);
  const [loading, setLoading] = useState(true);
  const dateObject = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",  // "short" -> Apr, "long" -> April
    year: "numeric",
  });
  
  useEffect(() => {    
    async function fetchBlogs() {
      try {
        const response = await fetch("/api/blogs"); 
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // If API succeeds, overwrite with live database content
          setBlogData(result.data);
          
        }
      } catch (err) {
        console.error("API Fetch failed, using static fallback data:", err.message);
        // No need to set an error state here; blogData already contains your default `blogs` array
      } finally {
        setLoading(false);
      }      
      
     
    }

    fetchBlogs();
    
  }, []);  
  // 2. Remove the rigid error check so the component never crashes or shows an error screen
  if (loading) return <p className="p-8 text-center text-slate-600 dark:text-slate-400">Loading blogs...</p>;
  if (!blogData || blogData.length === 0) return <p className="p-8 text-center text-slate-500">No articles found.</p>;

  const featuredBlog = blogData[0];
  
  
  return (
    <section
      id="blog"
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
          <Link href={`/blogs/${featuredBlog.slug}`}>
            <div className="grid lg:grid-cols-2 bg-white dark:bg-slate-800 shadow-xl cursor-pointer">

              <div className="relative h-[200px] lg:h-[300px]">
                <Image
                  src={featuredBlog.image}
                  alt={featuredBlog.title}                                    
                  fill                  
                  className="w-full h-64 object-cover rounded-lg"
                />
                
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="w-fit px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                  Featured Post
                </span>

                <h3 className="mt-6 text-3xl md:text-5xl font-bold dark:text-white text-slate-900">
                  {featuredBlog.title}
                </h3>

                <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
                  {featuredBlog.description}
                </p>

                <div className="flex flex-wrap gap-5 mt-6 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <FaUser />
                    {featuredBlog.author}
                  </span>

                  <span className="flex items-center gap-2">
                    <FaCalendarAlt />
                    {dateObject.format(new Date(featuredBlog.createdAt))}
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

          {blogData.slice(1).map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={`/blogs/${blog.slug}`}>
                <div className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full cursor-pointer">

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
                        {dateObject.format(new Date(blog.createdAt))}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold dark:text-white text-slate-900 group-hover:text-cyan-600 transition">
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