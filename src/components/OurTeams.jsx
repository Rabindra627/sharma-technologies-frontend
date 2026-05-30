"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const teamMembers = [
  {
    name: "Rabindra Sharma",
    role: "Founder & Full Stack Developer",
    image: "/images/team/founder.png",
    description:
      "As the founder, Rabindra is the visionary and strategic leader of Sharma Technologies. Based out of Janakpur, Nepal, he is responsible for establishing the company's direction, managing the core team, and driving digital innovation for businesses worldwide.",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Birendra Thakur",
    role: "Marketing Executive",
    image: "/images/team/me.png",    
    description:
      "A Marketing Executive is the strategic and creative engine behind how a company promotes its products, services, or brand. They are responsible for executing campaigns that grab consumer attention, drive sales, and build long-term brand loyalty.",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Anand Sharma",
    role: "Frontend Developer",
    image: "/team/frontend.jpg",
    description:
      "Specialized in React, Next.js animations, and responsive interfaces.",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
  {
    name: "Bikash Lama",
    role: "Backend Developer",
    image: "/team/backend.jpg",
    description:
      "Experienced in Java, Spring Boot, REST APIs, and database systems.",
    linkedin: "#",
    github: "#",
    twitter: "#",
  },
];

export default function OurTeamPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-gray-100 text-gray-900 py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Meet Our Team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gray-600 max-w-3xl mx-auto text-lg mb-16"
        >
          Our talented team delivers innovative software solutions, modern web
          applications, and scalable digital products for businesses worldwide.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg mb-5">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">{member.name}</h2>
                <p className="text-cyan-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {member.description}
                </p>

                <div className="flex items-center justify-center gap-5 text-xl text-gray-700">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    className="hover:text-cyan-400 transition"
                  >
                    <FaLinkedin />
                  </a>

                  <a
                    href={member.github}
                    target="_blank"
                    className="hover:text-cyan-400 transition"
                  >
                    <FaGithub />
                  </a>

                  <a
                    href={member.twitter}
                    target="_blank"
                    className="hover:text-cyan-400 transition"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
