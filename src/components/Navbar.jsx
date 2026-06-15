"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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
        if(isLogin){          
          toast.success(data.message);
          if (data.user?.token) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {          
          toast.success(data.message);          
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
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkLogin();
  }, [router]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-100" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          {/* Logo Element */}
          <Link href="/" onClick={(e) => handleScrollClick(e, "#home")} className="flex items-center">
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

          {/* Desktop Layout links */}
          <ul className="hidden md:flex items-center space-x-6 lg:space-x-8 font-medium">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  onClick={(e) => handleScrollClick(e, item.href)}
                  className={`text-sm tracking-wide transition-all duration-300 relative py-2 group ${
                    scrolled ? "text-slate-600 hover:text-blue-600" : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrolled ? "bg-blue-600" : "bg-white"
                  }`} />
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={() => {
                  setModalOpen(true);
                  setIsLogin(true);
                }}
                className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm outline-none active:scale-95 ${
                  scrolled
                    ? "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200"
                    : "bg-white text-slate-900 border border-transparent hover:bg-transparent hover:border-white hover:text-white"
                }`}
              >
                Login / Signup
              </button>
            </li>
          </ul>

          {/* Tablet/Mobile Layout Trigger Controls */}
          <button
            aria-label="Toggle navigation menu"
            className="md:hidden flex flex-col items-end justify-center w-8 h-8 space-y-1.5 z-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 transform origin-right ${
                mobileMenuOpen ? "w-6 -rotate-45 translate-x-px -translate-y-px" : "w-6"
              } ${scrolled || mobileMenuOpen ? "bg-slate-800" : "bg-white"}`}
            />
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "w-0 opacity-0" : "w-4"
              } ${scrolled ? "bg-slate-800" : "bg-white"}`}
            />
            <span
              className={`block h-0.5 rounded-full transition-all duration-300 transform origin-right ${
                mobileMenuOpen ? "w-6 rotate-45 translate-x-px translate-y-px" : "w-5"
              } ${scrolled || mobileMenuOpen ? "bg-slate-800" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* Slide-out Drawer Panel for Mobile Displays */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Layer overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Navigation Sheet Drawer content container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[280px] bg-white z-40 md:hidden pt-24 px-6 shadow-2xl flex flex-col"
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

                <motion.li
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                  className="pt-4 border-t border-slate-100"
                >
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setModalOpen(true);
                      setIsLogin(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base text-center py-3 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
                  >
                    Login / Signup
                  </button>
                </motion.li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Dialog for Authentication flow */}
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
                  {isLogin ? "Login to continue your session" : "Sign up to start building the future"}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                        <FaUser className="text-slate-400 mr-3 flex-shrink-0" size={14} />
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
                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                      <FaEnvelope className="text-slate-400 mr-3 flex-shrink-0" size={14} />
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
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center border border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 bg-slate-50 transition-colors">
                      <FaLock className="text-slate-400 mr-3 flex-shrink-0" size={14} />
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
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-md shadow-blue-100 hover:shadow-lg active:scale-[0.99] text-sm mt-2"
                  >
                    {isLogin ? "Login" : "Create Account"}
                  </button>
                </form>

                <div className="text-center mt-6 text-sm text-slate-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
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