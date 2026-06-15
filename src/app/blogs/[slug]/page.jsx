import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

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
    slug: "smart-IoT-buildings",
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
];

export default async function BlogDetails({ params }) {
   const blog = blogs.find((item) => item.slug === params.slug);

  if (!blog) {
    notFound();
  }
  return (
    <main className="bg-slate-50 dark:bg-slate-900 min-h-screen pt-24 pb-16">

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[550px] overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">

            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-white mb-6 hover:text-cyan-400 transition"
            >
              <FaArrowLeft />
              Back to Blogs
            </Link>

            <span className="inline-block bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {blog.category}
            </span>

            <h1 className="mt-6 text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight">
              {blog.title}
            </h1>

            <p className="mt-5 text-lg text-gray-200 max-w-3xl">
              {blog.description}
            </p>

            <div className="flex flex-wrap gap-6 mt-8 text-gray-300">
              <span className="flex items-center gap-2">
                <FaUser />
                {blog.author}
              </span>

              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                {blog.date}
              </span>

              <span className="flex items-center gap-2">
                <FaClock />
                {blog.readTime}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Article */}
          <article className="lg:col-span-2">

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-lg">

              <h2 className="text-3xl font-bold mb-8 dark:text-white">
                Article Overview
              </h2>

              <div className="space-y-6">
                {blog.content
                  .split("\n")
                  .filter((p) => p.trim())
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>

            </div>

          </article>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Author */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg text-center">

              <div className="w-20 h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center text-3xl font-bold mx-auto">
                {blog.author.charAt(0)}
              </div>

              <h3 className="mt-4 text-xl font-bold dark:text-white">
                {blog.author}
              </h3>

              <p className="text-slate-500 mt-2">
                Technology Contributor
              </p>

            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg">

              <h3 className="font-bold text-lg mb-5 dark:text-white">
                Technologies
              </h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "Next.js",
                  "React",
                  "IoT",
                  "AI",
                  "Cloud",
                  "Node.js",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-cyan-50 dark:bg-slate-700 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 text-white">

              <h3 className="text-xl font-bold">
                Stay Updated
              </h3>

              <p className="mt-3 text-white/90">
                Subscribe to receive the latest technology articles and insights.
              </p>

              <button className="mt-5 bg-white text-cyan-700 px-5 py-3 rounded-xl font-semibold">
                Subscribe
              </button>

            </div>

          </aside>

        </div>

      </section>
    </main>
  );
}