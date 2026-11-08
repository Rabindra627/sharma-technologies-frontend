"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const blogses = [
  {
    _id: "65e9f1a2b8c1d23456789011",
    title: "Smart IoT Buildings",
    description: "How IoT sensors and AI are transforming modern building management systems.",
    image: "/images/IoT-smart.png",
    author: "Rabindra Sharma",
    category: "IoT",
    readTime: "5 min read",
    slug: "smart-iot-buildings",
    content: `Smart buildings use IoT sensors...`,
    suspended: false,
    createdAt: "2026-04-06T00:00:00.000Z",
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(blogses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [actionBlogId, setActionBlogId] = useState(null);

  // References
  const menuRef = useRef(null);
  const imageInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "Mr. Rabindra Sharma",
    category: "",
    readTime: "",
    slug: "",
    content: "",
  });

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Close action popover menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionBlogId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Blogs feed refreshed");
    }, 850);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create / Update Blog Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.author) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!editingBlog && !imageInputRef.current?.files[0]) {
      toast.error("Please upload a banner image.");
      return;
    }

    setIsLoading(true);

    try {
      const frmData = new FormData();
      frmData.append("title", formData.title);
      frmData.append("description", formData.description);
      frmData.append("author", formData.author);
      frmData.append("category", formData.category);
      frmData.append("readTime", formData.readTime);
      frmData.append("slug", formData.slug);
      frmData.append("content", formData.content);

      if (imageInputRef.current?.files[0]) {
        frmData.append("image", imageInputRef.current.files[0]);
      }

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: frmData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to save the blog post.");
        return;
      }

      toast.success(
        data.message ||
          (editingBlog ? "Blog updated successfully!" : "New blog added successfully!")
      );

      const savedBlog = data.data || data;

      if (editingBlog) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === editingBlog._id ? savedBlog : blog
          )
        );
      } else {
        setBlogs((prevBlogs) => [savedBlog, ...prevBlogs]);
      }

      handleCloseModal();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      description: blog.description || "",
      author: blog.author || "Mr. Rabindra Sharma",
      category: blog.category || "",
      readTime: blog.readTime || "",
      slug: blog.slug || "",
      content: blog.content || "",
    });

    if (imageInputRef.current) imageInputRef.current.value = "";
    setActionBlogId(null);
    setIsModalOpen(true);
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      description: "",
      author: "Mr. Rabindra Sharma",
      category: "",
      readTime: "",
      slug: "",
      content: "",
    });

    if (imageInputRef.current) imageInputRef.current.value = "";
    setActionBlogId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData({
      title: "",
      description: "",
      author: "Mr. Rabindra Sharma",
      category: "",
      readTime: "",
      slug: "",
      content: "",
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSuspend = async (blog) => {
    const nextSuspended = !Boolean(blog.suspended);
    const confirmed = window.confirm(
      nextSuspended ? `Suspend "${blog.title}"?` : `Unsuspend "${blog.title}"?`
    );

    if (!confirmed) {
      setActionBlogId(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/blogs/${blog._id}/suspend`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suspended: nextSuspended }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to update blog status.");
        return;
      }

      setBlogs((prevBlogs) =>
        prevBlogs.map((item) =>
          item._id === blog._id
            ? data.data || { ...item, suspended: nextSuspended }
            : item
        )
      );

      setActionBlogId(null);
      toast.success(
        data.message ||
          (nextSuspended
            ? "Blog suspended successfully."
            : "Blog unsuspended successfully.")
      );
    } catch (error) {
      toast.error("Something went wrong while updating blog status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check logged-in admin session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.authenticated || data.user?.role !== "ADMIN") {
          setSession(null);
          return;
        }

        setSession(data.user);
      } catch (error) {
        setSession(null);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/blogs");
        const result = await response.json();

        let fetchedData = [];
        if (Array.isArray(result)) fetchedData = result;
        else if (Array.isArray(result.data)) fetchedData = result.data;
        else if (Array.isArray(result.blogs)) fetchedData = result.blogs;

        if (fetchedData.length > 0) {
          setBlogs(fetchedData);
        }
      } catch (err) {
        console.error("API Fetch failed, using static fallback data:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, [isRefreshing]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* Navigation / Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manage Blogs</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Create, update, and manage publication statuses
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 shrink-0"
              title="Refresh Feed"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>

            <button
              onClick={handleNewBlog}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              <span>New Blog</span>
            </button>
          </div>
        </div>

        {/* --- STANDARD DESKTOP TABLE --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto overflow-y-visible min-h-[320px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Content</th>
                  <th className="py-4 px-6">Date/Time</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6 h-12 bg-slate-100/50 dark:bg-slate-800/40" colSpan={8}></td>
                    </tr>
                  ))
                ) : blogs.length > 0 ? (
                    blogs.map((blog) => {
                    const rowKey = blog._id || blog.slug;
                    const isMenuOpen = actionBlogId === rowKey;

                    return (
                      <tr key={rowKey} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all duration-200 relative">
                        <td className="py-4 px-6 font-semibold">{blog.title}</td>
                        <td className="py-4 px-6 truncate max-w-[180px]">{blog.description}</td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{blog.author}</td>
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{blog.category}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${blog.suspended ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>
                            {blog.suspended ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-6 truncate max-w-[200px]">{blog.content}</td>
                        <td className="py-4 px-6 text-xs">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}</td>
                        <td className="py-4 px-6 text-right relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionBlogId(isMenuOpen ? null : rowKey);
                              }}
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
                              aria-label="Blog actions"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {isMenuOpen && (
                              <div 
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleEdit(blog)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  <span>✏️</span>
                                  Edit Blog
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSuspend(blog)}
                                  disabled={isLoading}
                                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer ${
                                    blog.suspended
                                      ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                      : "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  } disabled:opacity-50`}
                                >
                                  <span>{blog.suspended ? "▶️" : "⏸️"}</span>
                                  {blog.suspended ? "Unsuspend Blog" : "Suspend Blog"}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-slate-400 text-sm">
                      No blog publications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MOBILE CARDS VIEW --- */}
        <div className="block md:hidden space-y-3">
          {isLoading ? (
            <div className="text-center py-6 animate-pulse text-sm">Loading posts...</div>
          ) : blogs.length > 0 ? (
              blogs.map((blog) => {
              const rowKey = blog._id || blog.slug;
              const isMenuOpen = actionBlogId === rowKey;

              return (
                <div key={rowKey} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xs uppercase shrink-0">
                        {blog.title.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-100 block text-sm sm:text-base leading-tight truncate">{blog.title}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{blog.category} • {blog.readTime}</span>
                      </div>
                    </div>

                    <div className="relative shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionBlogId(isMenuOpen ? null : rowKey);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Blog actions"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {isMenuOpen && (
                        <div 
                          ref={menuRef}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                        >
                          <button
                            type="button"
                            onClick={() => handleEdit(blog)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <span>✏️</span>
                            Edit Blog
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSuspend(blog)}
                            disabled={isLoading}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer ${
                            blog.suspended
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-red-600 hover:bg-red-50"
                            } disabled:opacity-50`}
                          >
                            <span>{blog.suspended ? "▶️" : "⏸️"}</span>
                            {blog.suspended ? "Unsuspend Blog" : "Suspend Blog"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{blog.description}</p>
                  <div className="bg-slate-50/50 dark:bg-slate-950/40 p-2.5 rounded-xl flex flex-wrap gap-2 justify-between items-center text-xs text-slate-500">
                    <span>Author: <b>{blog.author}</b></span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full ${blog.suspended ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {blog.suspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No publications found.
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">{editingBlog ? "Edit Blog" : "New Blog"}</h3>
              <button onClick={handleCloseModal} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Smart Technology Advancements"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief summary..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Banner/Image*</label>
                <input
                  type="file"
                  name="image"
                  ref={imageInputRef}
                  accept="image/*"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:bg-slate-100 dark:file:bg-slate-800 cursor-pointer"
                  required={!editingBlog}
                />
                {editingBlog && (
                  <p className="mt-1 text-xs text-slate-400">
                    Leave empty to keep the existing image.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Technology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Read/Time *</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. unique-slug"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Saving..." : editingBlog ? "Update Blog" : "Save Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}