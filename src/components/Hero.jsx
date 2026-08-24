"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowRight, FaRocket, FaShieldAlt, FaCode } from "react-icons/fa";

const MotionImage = motion(Image);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 60]);

  const handleScrollClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offsetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen xl:min-h-[92vh] flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white overflow-hidden pt-24 pb-28"
    >
      {/* Visual Content Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24 relative z-10">
        
        {/* Left: Interactive Content with Premium Font Styling */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6 max-w-2xl mx-auto lg:mx-0"
        >
          {/* Eyebrow Pill Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg shadow-blue-950/20">
              <FaRocket className="text-cyan-300 animate-pulse text-xs" />
              Next-Gen Enterprise Solutions
            </span>
          </motion.div>

          {/* Main Title / Heading Styling */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-3xl md:text-3xl lg:text-[2rem] font-black tracking-tight leading-[1.1] text-white drop-shadow-sm"
          >
            Grow Your Business With{" "}
            <span className="block sm:inline mt-1 sm:mt-0 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_4px_16px_rgba(34,211,238,0.25)]">
              Sharma Technologies
            </span>
          </motion.h1>

          {/* Subheading Tagline Styling */}
          <motion.p
            variants={itemVariants}
            className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] uppercase text-cyan-200/90 leading-relaxed border-l-0 lg:border-l-2 border-cyan-400/50 lg:pl-3"
          >
            Custom Software • Web Engineering • Mobile Apps • Cloud Solutions
          </motion.p>

          {/* Body Paragraph Description Styling */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-blue-50/90 font-normal leading-relaxed text-balance lg:text-left tracking-normal max-w-xl"
          >
            <strong className="font-semibold text-white">Sharma Technologies</strong> delivers enterprise-grade software platforms, full-stack web applications, mobile ecosystems, and cloud architecture built to drive operational performance and scale growth.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="pt-3 flex flex-wrap gap-4 justify-center lg:justify-start">
            <button
              onClick={(e) => handleScrollClick(e, "services")}
              className="group flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-extrabold text-sm sm:text-base tracking-wide shadow-2xl shadow-indigo-950/40 hover:bg-cyan-300 hover:text-slate-900 transition-all duration-300 outline-none active:scale-[0.98]"
            >
              <span>Get Started</span>
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Illustration & Micro-Badges */}
        <div className="lg:col-span-5 w-full flex items-center justify-center mt-8 lg:mt-0 relative">
          
          <motion.div
            style={{ y: yParallax }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-full aspect-square flex items-center justify-center p-4"
          >
            <MotionImage
              src="/images/service.png"
              alt="Sharma Technologies Software Services Showcase"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)] filter"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Micro Glass Floating Badge - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-4 left-0 sm:left-2 bg-white/10 backdrop-blur-lg p-3.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-white"
            >
              <div className="p-2.5 rounded-xl bg-cyan-400/20 text-cyan-200">
                <FaCode size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-cyan-200/90 font-bold uppercase tracking-widest">Architecture</p>
                <p className="text-xs font-extrabold text-white">Clean Code</p>
              </div>
            </motion.div>

            {/* Micro Glass Floating Badge - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-6 right-0 sm:right-2 bg-white/10 backdrop-blur-lg p-3.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-white"
            >
              <div className="p-2.5 rounded-xl bg-blue-400/20 text-blue-200">
                <FaShieldAlt size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-cyan-200/90 font-bold uppercase tracking-widest">Reliability</p>
                <p className="text-xs font-extrabold text-white">Enterprise Ready</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Bottom Geometric Wave Mask Pattern */}
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