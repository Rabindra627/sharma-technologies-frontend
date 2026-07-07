import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaUser, FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";

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

export default async function BlogDetails({ params }) {
  const { slug } = await params;

  const blog = blogs.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (!blog) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900">
        {/* Modern Smoother Dynamic Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 px-4 pt-32 pb-24 text-white sm:px-6 lg:px-8 lg:pb-32">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px] pointer-events-none" />

          {/* TOP TO MIDDLE SMOOTH BLEND (Guarantees Navbar Links Visibility) */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

          {/* MIDDLE TO BOTTOM SMOOTH DEEP BLEND */}
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
          {/* Top Navigation Back Action */}
         
          {/* Hero Content Metadata Area (Perfectly Centered and Clear) */}
          <div className="relative max-w-4xl mx-auto  flex flex-col items-start justify-start text-start z-20 px-4">
            <Link
                href="/#blog"
                className="inline-flex py-6  gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition group"
              >
                <FaArrowLeft className="transform group-hover:-translate-x-1 transition duration-200" />
                Back to Blogs
              </Link>
            <span className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase shadow-md mb-6">
              {blog.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {blog.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-medium opacity-100 drop-shadow-sm">
              {blog.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs md:text-sm text-slate-200 font-medium">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <FaUser className="text-cyan-400" />
                {blog.author}
              </span>

              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                <FaCalendarAlt className="text-cyan-400" />
                {blog.date}
              </span>

              {blog.readTime && (
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm">
                  <FaClock className="text-cyan-400" />
                  {blog.readTime}
                </span>
              )}
            </div>
          </div>

          {/* Seamless Wave Divider Base */}
          <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none translate-y-[2px] z-20">
            <svg
              viewBox="0 0 1440 60"
              className="w-full h-auto min-h-[20px]"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#f8fafc"
                d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,60L1320,60C1200,60,960,60,720,60C480,60,240,60,120,60L0,60Z"
              />
            </svg>
          </div>
        </section>

        {/* Content Layout Area */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Dynamic Markdown/Text Article Output */}
            <article className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 dark:border-slate-700/50">
                <h2 className="text-2xl font-black mb-6 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">
                  Article Overview
                </h2>

                <div className="space-y-6">
                  {blog.content
                    .split("\n")
                    .filter((p) => p.trim())
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-normal"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </article>

            {/* Context Sidebar Elements */}
            <aside className="space-y-6">
              {/* Author Profile */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg text-center border border-slate-100 dark:border-slate-700/50">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                  {blog.author.charAt(0)}
                </div>

                <h3 className="mt-4 text-xl font-bold dark:text-white">
                  {blog.author}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Technology Contributor
                </p>
              </div>

              {/* Tech Tags */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-bold text-lg mb-4 dark:text-white">
                  Technologies
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {["Next.js", "React", "IoT", "AI", "Cloud", "Node.js"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 font-medium"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Newsletter Container */}
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />

                <h3 className="text-xl font-bold">Stay Updated</h3>

                <p className="mt-3 text-sm text-cyan-50/90 leading-relaxed">
                  Subscribe to receive the latest technology articles and
                  insights.
                </p>

                <button className="mt-6 w-full sm:w-fit bg-white text-cyan-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-cyan-50 transition active:scale-95">
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
