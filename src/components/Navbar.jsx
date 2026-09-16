"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!isLogin && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", email: "", password: "" });
        setErrors({});
        setModalOpen(false);
        setMobileMenuOpen(false);

        if (isLogin) {
          toast.success(data.message || "Logged in successfully");
          if (data.user?.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          setUser(data.user);
          if (data.user?.role === "ADMIN") {
            router.push("/dashboard");
          } else {
            router.push("/");
            toast.info("Please log in to access your account");
          }
        } else {
          toast.success(data.message || "Account created successfully");
          setIsLogin(true);
        }
      } else {
        toast.error(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const menuItems = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Blog", href: "#blog" },
    { name: "Career", href: "#career" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      setUser(null);
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            if (data.user.role === "ADMIN") {
              router.push("/dashboard");
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    }
    checkLogin();
  }, [router]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-slate-100"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          {/* Logo Element */}
          <Link
            href="/"
            onClick={(e) => handleScrollClick(e, "#home")}
            className="flex items-center"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 hover:scale-105">
              <Image
                src="/images/sharma-tech.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links & Action Buttons */}
          <ul className="hidden md:flex items-center space-x-6 lg:space-x-8 font-medium">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  onClick={(e) => handleScrollClick(e, item.href)}
                  className={`text-sm tracking-wide transition-all duration-300 relative py-2 group ${
                    scrolled
                      ? "text-slate-700 hover:text-blue-600"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      scrolled ? "bg-blue-600" : "bg-white"
                    }`}
                  />
                </Link>
              </li>
            ))}

            <li>
              {!user ? (
                /* Login / Signup Button (Gray-White theme when scrolled) */
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setIsLogin(true);
                  }}
                  className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 border outline-none active:scale-95 ${
                    scrolled
                      ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-blue-600"
                      : "bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white hover:text-slate-800"
                  }`}
                >
                  Login / Signup
                </button>
              ) : (
                /* Logged-In User Button (Matching Gray-White theme when scrolled) */
                user.role === "USER" && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 outline-none active:scale-95 border ${
                        scrolled
                          ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-blue-600"
                          : "bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30"
                      }`}
                    >
                      <span>Welcome, {user.name || user.email}</span>
                      <svg
                        className={`w-3.5 h-3.5 transform transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-2xl shadow-xl ring-1 ring-slate-900/5 py-1 z-50 overflow-hidden border border-slate-100"
                        >
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              )}
            </li>
          </ul>

          {/* Mobile Drawer Toggle */}
          <button
            aria-label="Toggle navigation menu"
            className="md:hidden flex flex-col items-end justify-center w-8 h-8 space-y-1.5 z-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 transform origin-right ${
                mobileMenuOpen
                  ? "w-6 -rotate-45 translate-x-px -translate-y-px"
                  : "w-6"
              } ${scrolled || mobileMenuOpen ? "bg-slate-800" : "bg-white"}`}
            />
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "w-0 opacity-0" : "w-4"
              } ${scrolled || mobileMenuOpen ? "bg-slate-800" : "bg-white"}`}
            />
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 transform origin-right ${
                mobileMenuOpen
                  ? "w-6 rotate-45 translate-x-px translate-y-px"
                  : "w-5"
              } ${scrolled || mobileMenuOpen ? "bg-slate-800" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[280px] bg-white z-40 md:hidden pt-24 px-6 shadow-2xl flex flex-col justify-between pb-8"
            >
              <ul className="flex flex-col space-y-5 text-slate-700 font-medium text-lg">
                {menuItems.map((item, index) => (
                  <motion.li
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleScrollClick(e, item.href)}
                      className="block py-2 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-100">
                {!user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen(true);
                      setIsLogin(true);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-base text-center py-3 rounded-full font-semibold transition-all active:scale-[0.98]"
                  >
                    Login / Signup
                  </button>
                ) : (
                  user.role === "USER" && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-600 px-1">
                        Signed in as{" "}
                        <span className="font-semibold text-slate-900 block truncate">
                          {user.name || user.email}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-700 text-sm text-center py-2.5 rounded-full font-semibold transition"
                      >
                        Logout
                      </button>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Authentication Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 z-10 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-full"
              >
                <FaTimes size={18} />
              </button>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center py-8 px-6">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm mt-2 text-indigo-100/90">
                  {isLogin
                    ? "Login to continue your session"
                    : "Sign up to start building the future"}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                        <FaUser
                          className="text-slate-400 mr-3 flex-shrink-0"
                          size={14}
                        />
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className="w-full bg-transparent outline-none text-slate-800 text-sm"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                      <FaEnvelope
                        className="text-slate-400 mr-3 flex-shrink-0"
                        size={14}
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-transparent outline-none text-slate-800 text-sm"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                      <FaLock
                        className="text-slate-400 mr-3 flex-shrink-0"
                        size={14}
                      />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full bg-transparent outline-none text-slate-800 text-sm"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md active:scale-[0.99] text-sm mt-2"
                  >
                    {isLogin ? "Login" : "Create Account"}
                  </button>
                </form>

                <div className="text-center mt-6 text-sm text-slate-500">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setForm({ name: "", email: "", password: "" });
                    }}
                    className="ml-1.5 text-blue-600 font-semibold hover:underline outline-none"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}