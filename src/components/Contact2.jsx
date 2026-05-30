"use client";

import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-100 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Contact Us
          </h2>

          <p className="text-gray-500 mb-8">
            Let’s discuss your project and build something amazing together.
          </p>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-300/50"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 space-y-4 text-gray-600">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-cyan-500" />
              <span>+977 98XXXXXXXX</span>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-cyan-500" />
              <span>info@sharmatechnologies.com</span>
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-cyan-500" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>
        </motion.div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden shadow-2xl h-[500px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625950959!2d85.29111366226633!3d27.70895594442956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1855c8c1b8fd%3A0x3c0f5c5fc5f2e8f6!2sKathmandu!5e0!3m2!1sen!2snp!4v1710000000000!5m2!1sen!2snp"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="border-0"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}