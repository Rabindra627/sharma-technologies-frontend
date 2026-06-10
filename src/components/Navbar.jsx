"use client"; // ❗ Must be at the top for client-side hooks
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";



export default function Navbar ()  {  
  
  const [scrolled, setScrolled] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

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

    if (!modalOpen && !form.name.trim()) {
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
  const  handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if(Object.keys(validationErrors).length !=0){
      const res =  fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data =  res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);

      // Redirect to Dashboard
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
    }

    // alert(
    //   modalOpen
    //     ? handleLogin(form)
    //     : "Signup Successful"
    // );

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setMobileMenuOpen(false);
  };
  

  // Navigation items array
  const menuItems = [
    // { name: "Home", href: "#home" },
    // { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll for internal links
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
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          <Link href="/" onClick={(e) => handleScrollClick(e, "#home")}>
             <div className="cursor-pointer">
            <Image
              src="/images/sharma-tech.png" // ✅ Place your logo in the /public folder
              alt="Logo"
              width={70} // Adjust width
              height={70} // Adjust height
              className="object-contain"
            />
          </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`hover:text-blue-600 transition-colors duration-300 cursor-pointer ${
                scrolled ? "py-2" : "bg-transparent py-4 text-white"
               }`}
               >                
              <Link href={item.href} onClick={(e) => handleScrollClick(e, item.href)}>
                {item.name}
              </Link>
            </li>
          ))}
          <li>
          <button
              onClick={() => setModalOpen(true)}
              className={` 
              ${scrolled ? 'text-black rounded-full shadow-md border-2 px-6 py-2 border-gray-400 hover:text-blue-600' : 'border-2 border-white text-white hover:bg-cyan-400 hover:text-white px-6 py-3  rounded-full shadow-md  font-semibold transition-all duration-300  hover:shadow-cyan-400/40'}
          `}
          >
            Login / Signup
          </button>
          </li>
        </ul>

        {/* Mobile Hamburger */}
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

      {/* Mobile Menu */}
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
              onClick={() => setModalOpen(true)}
              className={` 
              ${scrolled ? 'text-black rounded-full shadow-md border-2 px-6 py-2 border-gray-400 hover:text-blue-600' : 'border-2 border-white text-white hover:bg-cyan-400 hover:text-white px-6 py-3  rounded-full shadow-md  font-semibold transition-all duration-300  hover:shadow-cyan-400/40'}
          `}
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
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-red-500 transition"
              >
                <FaTimes size={20} />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-8 px-6">
                <h2 className="text-3xl font-bold">
                  {modalOpen ? "Welcome Back" : "Create Account"}
                </h2>

                <p className="text-sm mt-2 text-cyan-100">
                  {modalOpen
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
                  {!modalOpen && (
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
                    {modalOpen ? "Login" : "Create Account"}
                  </button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-6 text-gray-600">
                  {modalOpen
                    ? "Don't have an account?"
                    : "Already have an account?"}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(!modalOpen);
                      setErrors({});
                    }}
                    className="ml-2 text-cyan-600 font-semibold hover:underline"
                  >
                    {modalOpen ? "Sign Up" : "Login"}
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

