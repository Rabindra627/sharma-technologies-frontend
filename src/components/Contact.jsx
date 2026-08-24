"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaPaperPlane, 
  FaSpinner, 
  FaShieldAlt, 
  FaClock, 
  FaCheckCircle 
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
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
        setForm({ name: "", email: "", subject: "", message: "" });
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
    <section 
      id="contact" 
      className="relative bg-slate-50 dark:bg-[#0B0F17] py-20 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 overflow-hidden font-sans"
    >
      {/* High-Resolution Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Animated Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-cyan-700 dark:text-cyan-300 text-xs font-extrabold uppercase tracking-widest bg-cyan-50 dark:bg-cyan-950/60 px-4 py-2 rounded-full border border-cyan-200/60 dark:border-cyan-800/50 shadow-sm mb-4"
          >
            <FaPaperPlane className="text-cyan-600 dark:text-cyan-400 animate-pulse" /> Let&apos;s Connect
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Start Your Next Project With{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Sharma Tech
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal"
          >
            Have a product vision, enterprise software query, or custom technical requirement? Get in touch and let&apos;s build scaled digital solutions.
          </motion.p>
        </div>

        {/* Multi-Grid Master Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Essential Branding Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden"
          >
            {/* Inner Card Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                Get In Touch Directly
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Connect with our core software architecture team for enterprise IoT, custom web systems, mobile builds, and digital transformation.
              </p>

              {/* Information Item Cards */}
              <div className="space-y-4">
                
                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="p-3.5 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Corporate Office</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      Bideha Municipality - 9, Itaharwa, Dhanusha (Nepal)
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="p-3.5 rounded-xl bg-cyan-600/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</p>
                    <a href="mailto:support@sharmatechnologies.com" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors mt-0.5 block">
                      support@sharmatechnologies.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="p-3.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110">
                    <FaPhoneAlt size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Phone Hotline</p>
                    <a href="tel:+9779705130627" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors mt-0.5 block">
                      +977-9705130627
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Micro Guarantees Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5"><FaShieldAlt className="text-blue-500" /> Secure SSL</span>
              <span className="flex items-center gap-1.5"><FaClock className="text-cyan-500" /> 24h Response</span>
              <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-500" /> Confidential</span>
            </div>
          </motion.div>

          {/* Right Column: High-Res Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 sm:px-5 py-3.5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                      errors.name
                        ? "border-red-500 ring-2 ring-red-500/20"
                        : focusedField === "name"
                        ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-500/10"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 sm:px-5 py-3.5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                      errors.email
                        ? "border-red-500 ring-2 ring-red-500/20"
                        : focusedField === "email"
                        ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-500/10"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">{errors.email}</p>}
                </div>
              </div>

              {/* Subject Input */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="Software Development Inquiry"
                  className={`w-full px-4 sm:px-5 py-3.5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 ${
                    errors.subject
                      ? "border-red-500 ring-2 ring-red-500/20"
                      : focusedField === "subject"
                      ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-500/10"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.subject && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">{errors.subject}</p>}
              </div>

              {/* Message Input */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Message Payload
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={form.message}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  onChange={handleChange}
                  placeholder="How can we help you accelerate your tech stack?"
                  className={`w-full px-4 sm:px-5 py-3.5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none transition-all duration-300 resize-none ${
                    errors.message
                      ? "border-red-500 ring-2 ring-red-500/20"
                      : focusedField === "message"
                      ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-500/10"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white py-4 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-blue-600/25 dark:shadow-none flex items-center justify-center gap-2.5 outline-none cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    <span>Dispatching Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <FaPaperPlane className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Full-Width Map Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 sm:mt-16 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 h-[380px] sm:h-[460px] w-full relative isolate"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5413.262870327888!2d86.00351397325387!3d26.664133302388183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec3f007e33644d%3A0xf0f660723c971185!2sSharma%20Technologies%20Pvt.%20Ltd.!5e1!3m2!1sen!2snp!4v1783338071951!5m2!1sen!2snp"
            width="100%"
            height="100%"
            className="border-0 filter dark:invert-[0.92] dark:hue-rotate-180 contrast-105"
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