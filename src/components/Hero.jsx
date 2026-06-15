"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const MotionImage = motion(Image);

export default function Hero() {
  const handleScrollClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen xl:min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden pt-20"
    >
      {/* Dynamic Visual Content Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-6 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        
        {/* Left: Text Content */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 max-w-2xl mx-auto lg:mx-0">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-none"
          >
            Build Future With <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-200">Sharma Technologies</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg font-semibold tracking-wider text-cyan-200 uppercase"
          >
            Custom Software • Web Development • IoT Systems • AI Solutions
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-white/90 font-normal leading-relaxed text-justify lg:text-left"
          >
            <strong className="font-semibold text-white">Sharma Technologies</strong> is a software development company specializing in innovative web
            applications, mobile applications, enterprise software solutions,
            cloud computing, IoT systems, and digital transformation services.
            We help businesses improve efficiency, enhance customer experiences,
            and achieve growth through modern technology solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="pt-2"
          >
            <button
              onClick={(e) => handleScrollClick(e, "services")}
              className="group flex items-center gap-2.5 bg-white text-blue-600 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-indigo-900/20 hover:bg-cyan-400 hover:text-white transition-all duration-300 outline-none active:scale-[0.98]"
            >
              Get Started
              <FaArrowRight className="text-xs transition-transform duration-300 transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Right: Graphic/Illustration Container */}
        <div className="lg:col-span-5 w-full flex items-center justify-center mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[420px] sm:max-w-[500px] lg:max-w-full aspect-square md:aspect-[4/3] lg:aspect-square pointer-events-none"
          >
            <MotionImage
              src="/images/service.png"
              alt="Sharma Technologies Software Services Showcase"
              fill
              priority
              sizes="(max-w: 768px) 100vw, (max-w: 1200px) 50vw, 40vw"
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] filter"
              animate={{ 
                y: [0, -10, 0] 
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* High Resolution Bottom Geometric Wave Mask */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none translate-y-[2px] z-20">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto min-h-[40px]"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}