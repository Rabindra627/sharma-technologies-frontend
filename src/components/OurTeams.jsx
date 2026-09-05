"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedinIn, FaGithub, FaTwitter, FaFacebookF } from "react-icons/fa";

const teamMembers = [
  {
    name: "Rabindra Sharma",
    role: "Founder & Full Stack Developer",
    image: "/images/team/founder.png",
    description:
      "As the founder, Rabindra is the visionary and strategic leader of Sharma Technologies. Based out of Janakpur, Nepal, he drives digital innovation and manages the core development team.",
    linkedin: "https://www.linkedin.com/in/rabindra-sharma-3b46a7189",
    github: "https://github.com/RabindraSharma?tab=repositories",
    twitter: "#",
    facebook: "https://www.facebook.com/profile.php?id=100006317468529",
  },
  {
    name: "Birendra Thakur",
    role: "Marketing Executive",
    image: "/images/team/me.png",
    description:
      "The strategic and creative engine behind product promotion. Responsible for driving multi-channel growth campaigns and establishing long-term enterprise brand value.",
    linkedin: "#",
    github: "#",
    twitter: "#",
    facebook: "#",
  },
  {
    name: "Anand Sharma",
    role: "Frontend Developer",
    image: "/images/team/anand-2.jpeg",
    description:
      "Specializes in frontend architecture and UI/UX engineering. Focuses on transforming complex backend logic into responsive, highly interactive web applications.",
    linkedin: "#",
    github: "#",
    twitter: "#",
    facebook: "#",
  },
  {
    name: "Shiv Shankar Thakur",
    role: "Marketing Field Officer",
    image: "/images/team/Shiv.jpeg",
    description:
      "A Marketing Field Officer operates on the ground to drive product visibility, expand retail distribution, collect market intelligence, and support local sales teams. While a Field Marketing Manager handles strategic events and pipeline generation (often in B2B/Tech), a Marketing Field Officer focuses on direct physical outreach, store execution, and territory activation frequently.",
    linkedin: "#",
    github: "#",
    twitter: "#",
    facebook: "#",
  },
];

// Staggered orchestration for the parent grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18, // Time delay between each card pop-up
    },
  },
};

// Scroll Pop-Up Animation Variant
const popupVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.6, // Starts small for the pop-up effect
    y: 60 
  },
  show: { 
    opacity: 1, 
    scale: 1, // Scales up to normal size
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 18 // Bouncy spring feel
    }
  },
};

export default function OurTeamPage() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-200/30 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-blue-600 text-xs font-bold uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm"
          >
            The Minds Behind Sharma Technologies
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-3xl font-extrabold text-blue-400 mt-6 tracking-tight"
          >
            Meet Our Leadership & Engineering
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed"
          >
            A dedicated group of software engineers, system architects, and digital strategists building high-performance solutions for global enterprises.
          </motion.p>
        </div>

        {/* Scroll-Triggered Pop-up Team Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }} // Triggers when cards scroll into view
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={popupVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group bg-white border border-slate-200/80 rounded-3xl p-7 flex flex-col justify-between items-center text-center shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-300 transition-shadow duration-300 relative cursor-pointer"
            >
              <div className="flex flex-col items-center w-full">
                {/* Avatar with Glow Effect */}
                <div className="relative w-28 h-28 mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition duration-500" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mt-2 mb-4">
                  {member.role}
                </span>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  {member.description}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 w-full">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <FaLinkedinIn size={13} />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <FaGithub size={13} />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-sky-500 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <FaTwitter size={13} />
                  </a>
                )}
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-50 text-slate-500 hover:bg-blue-700 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    <FaFacebookF size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}