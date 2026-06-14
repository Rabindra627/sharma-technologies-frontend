"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
  // Smooth Scroll
  const handleScrollClick = (e, href) => {
    e.preventDefault();

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
      
      {/* Top Glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/40"></div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">

          {/* Company */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/sharma-tech.png"
                alt="Sharma Technologies"
                width={65}
                height={65}
                className="object-contain"
              />

              <div>
                {/* <h2 className="text-2xl font-bold">
                  Sharma Technologies
                </h2>

                <p className="text-cyan-400 text-sm">
                  Software & Digital Solutions
                </p> */}
              </div>
            </div>

            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              We build scalable software, IoT systems, cloud platforms,
              mobile applications, and modern digital experiences for
              startups and enterprises worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {[
                FaFacebookF,
                FaLinkedinIn,
                FaGithub,
                FaTwitter,
              ].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4 text-gray-400">
              {[
                ["Home", "#home"],
                ["About", "#about"],
                ["Services", "#services"],
                ["Portfolio", "#portfolio"],
                ["Contact", "#contact"],
              ].map(([label, href], index) => (
                <li key={index}>
                  <a
                    href={href}
                    onClick={(e) => handleScrollClick(e, href)}
                    className="hover:text-cyan-400 transition duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Services
            </h3>

            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-cyan-400 transition">
                Web Development
              </li>

              <li className="hover:text-cyan-400 transition">
                Mobile App Development
              </li>

              <li className="hover:text-cyan-400 transition">
                Cloud Solutions
              </li>

              <li className="hover:text-cyan-400 transition">
                IoT Systems
              </li>

              <li className="hover:text-cyan-400 transition">
                SEO Optimization
              </li>

              <li className="hover:text-cyan-400 transition">
                Digital Marketing
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Contact
            </h3>

            <div className="space-y-5 text-gray-400">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FaEnvelope className="text-cyan-400" />
                </div>

                <span className="text-sm">
                  info@sharmatechnologies.com
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FaPhone className="text-cyan-400" />
                </div>

                <span className="text-sm">
                  (+977) 9705130627
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FaPhone className="text-cyan-400" />
                </div>

                <span className="text-sm">
                  (+91) 8882930206
                </span>
              </div>
            </div>

            {/* Back To Top */}
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="mt-8 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
            >
              <FaArrowUp />
              Back to Top
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          
          <p>
            © 2026 Sharma Technologies. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-cyan-400 transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="hover:text-cyan-400 transition"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
      {/*WhatsApp Chat | Untitled WhatsApp Chat */} 
      <script src="https://elfsightcdn.com/platform.js" async></script>
      <div class="elfsight-app-2108d846-f6c2-493e-94d6-8c7f915491e5" data-elfsight-app-lazy></div>
    </footer>
  );
}