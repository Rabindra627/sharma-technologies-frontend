"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

export default function Portfolio() {
  const projects = [
    {
      title: "E-School System",
      category: "Education Tech",
      image: "/images/e-school.png",
      tag: "Web & Mobile",
    },
    {
      title: "Logistics Management",
      category: "Supply Chain",
      image: "/images/logistics.png",
      tag: "Cloud Platform",
    },
    {
      title: "IoT Smart Building",
      category: "Smart Automation",
      image: "/images/IoT-smart.png",
      tag: "IoT & AI",
    },
    {
      title: "Smart Traffic System",
      category: "Civic Infrastructure",
      image: "/images/smart-traffic.png",
      tag: "AI Analytics",
    },
    {
      title: "Healthcare App",
      category: "Health & Care",
      image: "/images/health-care.png",
      tag: "Mobile App",
    },
  ];

  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth continuous auto-scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrameId;

    const scroll = () => {
      if (!isPaused && carousel) {
        carousel.scrollLeft += 1; // Smooth pixel-by-pixel scrolling

        // Seamless infinite loop reset point
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-slate-900 relative overflow-hidden" id="portfolio">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
            Featured Works
          </span>
          <h2 className="text-3xl md:text-3xl font-extrabold text-blue-400 mt-6 tracking-tight">
            Our Portfolio
          </h2>
          <p className="text-slate-500 mt-4 text-base md:text-lg">
            Explore our latest enterprise solutions, intelligent AI models, and modern user platforms.
          </p>
        </div>

        {/* Interactive Carousel */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={carouselRef}
            className="flex gap-8 overflow-x-auto no-scrollbar py-6 px-4 scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Duplicated array for seamless infinite looping */}
            {[...projects, ...projects].map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="min-w-[300px] md:min-w-[340px] bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex-shrink-0 flex flex-col justify-between group/card"
              >
                {/* Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Overlay Glass Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow-sm border border-white/50">
                    {project.tag}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 tracking-wide uppercase">
                      {project.category}
                    </span>
                    <h3 className="font-bold text-xl text-slate-900 mt-1 group-hover/card:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Interactive Action Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover/card:text-blue-600 transition-colors">
                    <span>View Case Study</span>
                    <div className="p-2 rounded-full bg-slate-50 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all duration-300">
                      <FaArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}