"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const blogses = [
  {
    title: "Smart IoT Buildings",
    description:
      "How IoT sensors and AI are transforming modern building management systems.",
    image: "/images/IoT-smart.png",
    date: "Apr 6, 2026",
    author: "Rabindra Sharma",
    category: "IoT",
    readTime: "5 min read",
    slug: "smart-iot-buildings",
    content: `Smart buildings use IoT sensors...`,
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(blogses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Create a reference for the file input element
  const imageInputRef = useRef(null);

  // New Client Form State (Removed image here because files are handled via ref)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "Mr. Rabindra Sharma",
    category: "",
    readTime: "",
    slug: "",
    content: "",
  });

  // Simulated Fluid Refresh Action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Re-trigger the initial fetch logic here if desired
    }, 850);
  };

  // Form Input Listener
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create Client Profile Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.author) return;

    // Check if an image file is actually uploaded
    if (!imageInputRef.current?.files[0]) {
      toast.error("Please upload a banner image.");
      return;
    }

    setIsLoading(true);

    const frmData = new FormData();
    frmData.append("title", formData.title);
    frmData.append("description", formData.description);
    frmData.append("author", formData.author);
    frmData.append("category", formData.category);
    frmData.append("readTime", formData.readTime);
    frmData.append("slug", formData.slug);
    frmData.append("content", formData.content);
    // Grab file stream directly from our input ref
    frmData.append("image", imageInputRef.current.files[0]);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        body: frmData, // Headers automatically generated with multipart/form-data boundary
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "New blog added successfully!");
        
        // Feed the fresh DB saved blog object back into state UI array instantly
        setBlogs((prevBlogs) => [data.data, ...prevBlogs]);

        // Reset text fields
        setFormData({
          title: "",
          description: "",
          author: "Mr. Rabindra Sharma",
          category: "",
          readTime: "",
          slug: "",
          content: "default text",
        });
        
        // Reset file input element explicitly
        if (imageInputRef.current) imageInputRef.current.value = "";
        
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to save the blog post.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/blogs");
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setBlogs(result.data);
        }
      } catch (err) {
        console.error("API Fetch failed, using static fallback data:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, [isRefreshing]); // Hooked to refresh trigger

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-10 dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-blue-500/10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation / Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Manage Blogs</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage blogs at create, update and de-activate
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50"
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
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md active:scale-[0.98] transition-all flex-1 sm:flex-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              <span>New Blog</span>
            </button>
          </div>
        </div>

        {/* --- DESKTOP STRUCTURED TABLE --- */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Content</th>
                  <th className="py-4 px-6">Date/Time</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6 h-12 bg-slate-100/50 dark:bg-slate-800/40" colSpan={7}></td>
                    </tr>
                  ))
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog._id || blog.slug} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all duration-200">
                      <td className="py-4 px-6 font-semibold">{blog.title}</td>
                      <td className="py-4 px-6 truncate max-w-[180px]">{blog.description}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{blog.author}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{blog.category}</td>
                      <td className="py-4 px-6 truncate max-w-[200px]">{blog.content}</td>
                      <td className="py-4 px-6 text-xs">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MOBILE CARDS FLUID GRID --- */}
        <div className="block md:hidden space-y-4">
          {isLoading ? (
            <div className="text-center py-6 animate-pulse text-sm">Loading posts...</div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id || blog.slug} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xs uppercase shrink-0">
                      {blog.title.substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block text-base leading-tight">{blog.title}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{blog.category} • {blog.readTime}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{blog.description}</p>
                <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl flex justify-between text-xs text-slate-500">
                  <span>Author: <b>{blog.author}</b></span>
                  <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MODAL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">New Blog</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">Banner/Image*</label>
                {/* Fixed Controlled Element issue & linked the required Ref */}
                <input
                  type="file"
                  name="image"
                  ref={imageInputRef} 
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="e.g. unique-blog-slug"
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
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-transparent text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}