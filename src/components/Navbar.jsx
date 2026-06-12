"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

      // 1. Prepare the payload based on whether the action is Login or Register
      const payload = isLogin
        ? { email: form.email, password: form.password } // Login only needs email/password
        : { name: form.name, email: form.email, password: form.password }; // Register needs all

      // 2. Make the corrected fetch call

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();      
      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setForm({
          name: "",
          email: "",
          password: "",
        });

        setErrors({});
        setModalOpen(false);
        setMobileMenuOpen(false);
        if(isLogin){
          router.push("/dashboard");
        }        
      } else {
        if (res.error) {
          setErrors(res.error);
        } else {
          alert(`${isLogin ? data.error : data.error}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          <Link href="/" onClick={(e) => handleScrollClick(e, "#home")}>
            <div className="cursor-pointer">
              <Image
                src="/images/sharma-tech.png"
                alt="Logo"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`hover:text-blue-600 transition-colors duration-300 cursor-pointer ${
                scrolled ? "py-2" : "bg-transparent py-4 text-white"
              }`}
            >
              <Link
                href={item.href}
                onClick={(e) => handleScrollClick(e, item.href)}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={() => {
                setModalOpen(true);
                setIsLogin(true);
              }}
              className={`${
                scrolled
                  ? "text-black rounded-full shadow-md border-2 px-6 py-2 border-gray-400 hover:text-blue-600"
                  : "border-2 border-white text-white hover:bg-cyan-400 hover:text-white px-6 py-3 rounded-full shadow-md font-semibold transition-all duration-300 hover:shadow-cyan-400/40"
              }`}
            >
              Login / Signup
            </button>
          </li>
        </ul>

        <div
          className="md:hidden flex flex-col space-y-1 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
      </div>

      <div
        className={`md:hidden bg-white shadow-lg transition-all duration-500 overflow-hidden ${
          mobileMenuOpen ? "max-h-60 py-4" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col space-y-3 px-6 text-gray-700 font-medium">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              onClick={(e) => handleScrollClick(e, item.href)}
            >
              {item.name}
            </li>
          ))}

          <li>
            <button
              onClick={() => {
                setModalOpen(true);
                setIsLogin(true);
              }}
              className="text-black rounded-full shadow-md border-2 px-6 py-2 border-gray-400 hover:text-blue-600"
            >
              Login / Signup
            </button>
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>

              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-8 px-6">
                <h2 className="text-3xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="text-sm mt-2 text-cyan-100">
                  {isLogin ? "Login to continue" : "Sign up to get started"}
                </p>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
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

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-400/40"
                  >
                    {isLogin ? "Login" : "Create Account"}
                  </button>
                </form>

                <div className="text-center mt-6 text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setForm({
                        name: "",
                        email: "",
                        password: "",
                      });
                    }}
                    className="ml-2 text-cyan-600 font-semibold cursor-pointer"
                  >
                    {isLogin ? "Sign Up" : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
