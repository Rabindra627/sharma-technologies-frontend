"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaArrowRight, FaRocket, FaShieldAlt, FaCode } from "react-icons/fa";

const MotionImage = motion(Image);

// Stagger Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export default function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 80]);

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
      className="relative min-h-screen flex items-center justify-center bg-white text-slate-900 overflow-hidden pt-28 pb-20"
    >
      {/* Background Animated Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-200/40 via-blue-200/30 to-indigo-200/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      {/* Main Grid Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8">
          
          {/* Left Column: Interactive Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-2xl mx-auto lg:mx-0"
          >
            {/* Pill Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200/60 text-cyan-700 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                <FaRocket className="text-cyan-500 animate-pulse" />
                Next-Gen Enterprise Solutions
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
            >
              Grow Your Business With{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                Sharma Technologies
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase"
            >
              Custom Software • Web Engineering • Mobile Apps • Cloud AI
            </motion.p>

            {/* Paragraph Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed"
            >
              We craft modern web platforms, mobile applications, cloud infrastructures, and digital transformation strategy to help enterprise teams scale efficiently.
            </motion.p>

            {/* CTA Group */}
            <motion.div variants={itemVariants} className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={(e) => handleScrollClick(e, "services")}
                className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-slate-900/10 hover:bg-cyan-600 transition-all duration-300 outline-none active:scale-[0.97]"
              >
                <span>Get Started Now</span>
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={(e) => handleScrollClick(e, "blog")}
                className="inline-flex items-center gap-2 bg-white text-slate-700 px-7 py-4 rounded-2xl font-bold text-sm sm:text-base border border-slate-200 shadow-sm hover:border-cyan-300 hover:text-cyan-600 transition-all duration-300"
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Showcase Image with Interactive Micro-Badges */}
          <div className="lg:col-span-5 w-full flex items-center justify-center relative">
            
            {/* Ambient Image Glow */}
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

            <motion.div
              style={{ y: yParallax }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative w-full max-w-[440px] sm:max-w-[500px] aspect-square flex items-center justify-center p-6 bg-slate-50/50 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl"
            >
              <MotionImage
                src="/images/service.png"
                alt="Sharma Technologies Software Services Showcase"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-contain p-4 filter drop-shadow-xl"
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Interactive Floating Micro Glass Badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
                  <FaCode size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Architecture</p>
                  <p className="text-xs font-bold text-slate-800">Clean Code</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <FaShieldAlt size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Reliability</p>
                  <p className="text-xs font-bold text-slate-800">Enterprise Ready</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}