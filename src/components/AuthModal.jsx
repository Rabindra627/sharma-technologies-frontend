"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Input Change
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

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!isLogin && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    alert(
      isLogin
        ? "Login Successful"
        : "Signup Successful"
    );

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      
      {/* Open Button */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        Open Login / Signup
      </button> */}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-8 px-6">
                <h2 className="text-3xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="text-sm mt-2 text-cyan-100">
                  {isLogin
                    ? "Login to continue"
                    : "Sign up to get started"}
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  {!isLogin && (
                    <div>
                      <div className="flex items-center border rounded-2xl px-4 py-3 bg-gray-50">
                        <FaUser className="text-gray-400 mr-3" />

                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="w-full bg-transparent outline-none"
                        />
                      </div>

                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <div className="flex items-center border rounded-2xl px-4 py-3 bg-gray-50">
                      <FaEnvelope className="text-gray-400 mr-3" />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center border rounded-2xl px-4 py-3 bg-gray-50">
                      <FaLock className="text-gray-400 mr-3" />

                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full bg-transparent outline-none"
                      />
                    </div>

                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-400/40"
                  >
                    {isLogin ? "Login" : "Create Account"}
                  </button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-6 text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="ml-2 text-cyan-600 font-semibold hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}