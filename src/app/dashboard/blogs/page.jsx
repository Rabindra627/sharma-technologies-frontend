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
  const [editingBlog, setEditingBlog] = useState(null);
  const [actionBlog, setActionBlog] = useState(null);

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
  // Added on 09/20/2026 for check sessions
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

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

      if (editingBlog) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === editingBlog._id ? data.data : blog
          )
        );
      } else {
        setBlogs((prevBlogs) => [data.data, ...prevBlogs]);
      }

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

      setEditingBlog(null);
      setActionBlog(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Save blog error:", error);
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

    setActionBlog(null);
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

    setActionBlog(null);
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
      setActionBlog(null);
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

      setActionBlog(null);

      toast.success(
        data.message ||
          (nextSuspended
            ? "Blog suspended successfully."
            : "Blog unsuspended successfully.")
      );
    } catch (error) {
      console.error("Suspend blog error:", error);
      toast.error("Something went wrong while updating blog status.");
    } finally {
      setIsLoading(false);
    }
  };

// Check logged-in admin
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
        console.error("Session check failed:", error);
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
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog._id || blog.slug} className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-all duration-200">
                      <td className="py-4 px-6 font-semibold">{blog.title}</td>
                      <td className="py-4 px-6 truncate max-w-[180px]">{blog.description}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{blog.author}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{blog.category}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{blog.suspended ? "Suspended" : "Active"}</td>
                      <td className="py-4 px-6 truncate max-w-[200px]">{blog.content}</td>
                      <td className="py-4 px-6 text-xs">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setActionBlog(
                                actionBlog?._id === blog._id ? null : blog
                              )
                            }
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
                            aria-label="Blog actions"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {actionBlog?._id === blog._id && (
                            <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                              <button
                                type="button"
                                onClick={() => handleEdit(blog)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                              >
                                <span>✏️</span>
                                Edit Blog
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSuspend(blog)}
                                disabled={isLoading}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xs uppercase shrink-0">
                      {blog.title.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block text-base leading-tight truncate">{blog.title}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{blog.category} • {blog.readTime}</span>
                    </div>
                  </div>

                  <div className="relative shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActionBlog(
                          actionBlog?._id === blog._id ? null : blog
                        )
                      }
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Blog actions"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {actionBlog?._id === blog._id && (
                      <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        <button
                          type="button"
                          onClick={() => handleEdit(blog)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <span>✏️</span>
                          Edit Blog
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSuspend(blog)}
                          disabled={isLoading}
                          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
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
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{blog.description}</p>
                <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl flex flex-wrap gap-2 justify-between text-xs text-slate-500">
                  <span>Author: <b>{blog.author}</b></span>
                  <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}</span>
                  <span className={`font-semibold ${blog.suspended ? "text-red-600" : "text-emerald-600"}`}>
                    {blog.suspended ? "Suspended" : "Active"}
                  </span>
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{editingBlog ? "Edit Blog" : "New Blog"}</h3>
              <button onClick={handleCloseModal} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
                  accept="image/*"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800"
                  required={!editingBlog}
                />
                {editingBlog && (
                  <p className="mt-1 text-xs text-slate-400">
                    Leave empty to keep the existing image.
                  </p>
                )}
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
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-50"
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