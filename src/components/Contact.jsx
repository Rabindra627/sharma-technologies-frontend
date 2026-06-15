"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to deliver message.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-slate-50 dark:bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-black tracking-tight text-blue-400 dark:text-white"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Have a project idea or need technical consultations? Drop us a line and let&apos;s craft the future together.
          </motion.p>
        </div>

        {/* Master Multi-Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Essential Branding Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Get in Touch
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Feel free to contact us for premium software development, enterprise IoT systems, responsive web platforms, mobile applications, and high-performance digital transformation solutions.
              </p>

              {/* Dynamic Information Vectors */}
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="bg-blue-50 dark:bg-slate-700/60 p-3 rounded-xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Location</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Janakpur, Nepal</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-blue-50 dark:bg-slate-700/60 p-3 rounded-xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                    <FaEnvelope size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</p>
                    <a href="mailto:info@sharmatechnologies.com" className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      info@sharmatechnologies.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="bg-blue-50 dark:bg-slate-700/60 p-3 rounded-xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                    <FaPhoneAlt size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Phone Hotline</p>
                    <a href="tel:+9779705130627" className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +977-9705130627
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Floating Brand Line */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 hidden lg:block">
              <p className="text-xs text-slate-400 font-medium tracking-wide">Sharma Technologies — Engineering Beyond Boundaries.</p>
            </div>
          </motion.div>

          {/* Right Column: Secure Delivery Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full px-4 sm:px-5 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</p>}
              </div>

              {/* Email Address Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={`w-full px-4 sm:px-5 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
              </div>

              {/* Message Payload Area */}
              <div>
                <textarea
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you accelerate?"
                  className={`w-full px-4 sm:px-5 py-3 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.message}</p>}
              </div>

              {/* Dispatch Action Control Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-md shadow-blue-100 dark:shadow-none active:scale-[0.99] outline-none"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Full Width Integrated Map Base Layer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 sm:mt-12 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 h-[350px] sm:h-[450px] w-full isolate"
        >
          <iframe
            src="https://www.google.com/maps?q=Janakpur,Nepal&output=embed"
            width="100%"
            height="100%"
            className="border-0 filter grayscale dark:invert-[0.9] dark:hue-rotate-180"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            title="Sharma Technologies Corporate Office Location Grid"
          />
        </motion.div>

      </div>
    </section>
  );
}