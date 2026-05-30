"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function Portfolio() {
  const projects = [
    { title: "E-School System", image: "/images/e-school.png" },
    { title: "Logistics Management", image: "/images/logistics.png" },
    { title: "IoT Smart Building", image: "/images/IoT-smart.png" },
    { title: "Smart Traffic System", image: "/images/smart-traffic.png" },
    { title: "Healthcare App", image: "/images/health-care.png" },
  ];

  const carouselRef = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      setScrollWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      if (carouselRef.current.scrollLeft >= maxScrollLeft) {
        carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        carouselRef.current.scrollBy({ left: 280, behavior: "smooth" }); // slide one card width
      }
    }, 3000); // every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-white" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">Our Portfolio</h2>

        <motion.div
          ref={carouselRef}
          className="mt-12 overflow-hidden flex gap-6 cursor-default"
        >
          {projects.concat(projects).map((project, index) => ( // duplicate for smooth loop
            <motion.div
              key={index}
              variants={item}
              initial="hidden"
              animate="show"
              whileHover={{ scale: 1.05 }}
              className="min-w-[250px] md:min-w-[280px] bg-white shadow-lg rounded-xl overflow-hidden flex-shrink-0"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={500}
                height={300}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}