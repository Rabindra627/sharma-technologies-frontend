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
  const handleScrollClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white overflow-hidden border-t border-slate-800/60">
      {/* Decorative Top Glow Bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => handleScrollClick(e, "#home")}>
              <div className="relative w-14 h-14 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/30 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/sharma-tech.png"
                  alt="Sharma Technologies Logo"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              We build scalable software, cloud platforms, robust IoT networks, mobile ecosystems, and modern digital automation solutions tailored for modern global enterprise performance.
            </p>

            {/* Social Connection Badges */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: FaFacebookF, label: "Facebook link", url: "#" },
                { Icon: FaLinkedinIn, label: "LinkedIn link", url: "#" },
                { Icon: FaGithub, label: "GitHub link", url: "#" },
                { Icon: FaTwitter, label: "Twitter link", url: "#" },
              ].map(({ Icon, label, url }, index) => (
                <a
                  key={index}
                  href={url}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/40 hover:border-cyan-500/50 text-slate-400 hover:text-white hover:bg-cyan-500 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Nav Maps */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-5 relative pl-3 border-l-2 border-cyan-500">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              {[
                ["Home", "#home"],
                ["Services", "#services"],
                ["Portfolio", "#portfolio"],
                ["Blog", "#blog"],
                ["Contact", "#contact"],
              ].map(([label, href], index) => (
                <li key={index}>
                  <a
                    href={href}
                    onClick={(e) => handleScrollClick(e, href)}
                    className="inline-flex items-center gap-0.5 hover:text-cyan-400 transition-colors duration-200 group"
                  >
                    <span className="opacity-0 w-0 group-hover:w-2 group-hover:opacity-100 transition-all duration-200 text-cyan-400 font-bold">&middot;</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Specialized Capabilities */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-5 relative pl-3 border-l-2 border-cyan-500">
              Services
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              {[
                "Web Application Development",
                "Mobile App Infrastructure",
                "Cloud Solutions & DevOps",
                "Enterprise IoT Systems",
                "AI & Predictive Systems",
                "Digital Transformation"
              ].map((service, index) => (
                <li key={index} className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Communication Endpoints */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-5 relative pl-3 border-l-2 border-cyan-500">
                Contact
              </h3>
              
              <div className="space-y-3.5 text-sm text-slate-400 font-medium">
                <a href="mailto:info@sharmatechnologies.com" className="flex items-center gap-3 group outline-none">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/40 border border-slate-700/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <FaEnvelope size={12} />
                  </div>
                  <span className="group-hover:text-cyan-400 transition-colors truncate">info@sharmatechnologies.com</span>
                </a>

                <a href="tel:+9779705130627" className="flex items-center gap-3 group outline-none">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/40 border border-slate-700/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <FaPhone size={12} />
                  </div>
                  <span className="group-hover:text-cyan-400 transition-colors tracking-wide">(+977) 9705130627</span>
                </a>

                <a href="tel:+918882930206" className="flex items-center gap-3 group outline-none">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/40 border border-slate-700/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <FaPhone size={12} />
                  </div>
                  <span className="group-hover:text-cyan-400 transition-colors tracking-wide">(+91) 8882930206</span>
                </a>
              </div>
            </div>

            {/* Float Return Navigation Triggers */}
            <div className="pt-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-cyan-950/50 hover:shadow-cyan-500/20 active:scale-95 group outline-none"
              >
                <FaArrowUp className="text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5" />
                Back to Top
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Panel Layout Section */}
        <div className="border-t border-slate-800/50 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p className="text-center sm:text-left">
            &copy; {currentYear} Sharma Technologies. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}