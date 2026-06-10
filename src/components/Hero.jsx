"use client";


import Image from "next/image";

import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";


const MotionImage = motion(Image);

export default function Hero() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 p-10">
      <div className="max-w-7xl mx-auto text-justify px-6">

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{opacity: 1, y: 1}}
          transition={{ duration: 0.7 , delay: 0.2}}
          className="text-3xl md:text-3xl font-bold sm:py-20"
        >
          Build Future With Sharma Technologies
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        className="mt-3 text-md md:text-xl">
          Custom Software • Web Development • IoT Systems • AI Solutions
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >is a software development company specializing in innovative web applications, mobile applications, enterprise software solutions, cloud computing, IoT systems, and digital transformation services. We help businesses improve efficiency, enhance customer experiences, and achieve growth through modern technology solutions.</motion.p>
        
     <motion.button
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          document.getElementById("services")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
      className="mt-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-white hover:text-blue-600 hover:border-white transition-all duration-300"
    >
  Get Started
  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
</motion.button>

      </div>
      <div className="max-w-7xl mx-auto text-center px-6">
        <MotionImage
          src="/images/service.png"
          alt="Service"
          width={600}
          height={400}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 , delay : 0.6}}
        />
      </div>
    </div>
  {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full">        
        <svg
          viewBox="0 0 1430 220"
          className="w-full h-56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff81"
            d="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,176C1120,160,1280,160,1360,160L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>

    </section>

    
  );
}