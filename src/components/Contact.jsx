"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  // Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Submit
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      alert(data.message);

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-white to-slate-100 py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-14"
        >
          Contact Us
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h3>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Feel free to contact us for software development,
              IoT systems, websites, mobile apps, and digital solutions.
            </p>

            {/* Contact Info */}
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-cyan-600" />
                </div>

                <p className="text-gray-700">
                  Janakpur, Nepal
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-cyan-100 p-3 rounded-full">
                  <FaEnvelope className="text-cyan-600" />
                </div>

                <p className="text-gray-700">
                  info@sharmatechnologies.com
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-cyan-100 p-3 rounded-full">
                  <FaPhoneAlt className="text-cyan-600" />
                </div>

                <p className="text-gray-700">
                  +977-9705130627
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition ${
                    errors.name
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-cyan-400"
                  }`}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-cyan-400"
                  }`}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition resize-none ${
                    errors.message
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-cyan-400"
                  }`}
                />

                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-300/50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
          >
            <iframe
              src="https://www.google.com/maps?q=Janakpur,Nepal&output=embed"
              width="100%"
              height="100%"
              className="min-h-[600px] border-0"
              loading="lazy"
              allowFullScreen=""
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}