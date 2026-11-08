"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const DEFAULT_AUTHOR = "Mr. Rabindra Sharma";
const PAGE_SIZES = [5, 10, 25, 50];

const blogses = [
  {
    _id: "65e9f1a2b8c1d23456789011",
    title: "Smart IoT Buildings",
    description: "How IoT sensors and AI are transforming modern building management systems.",
    image: "/images/IoT-smart.png",
    author: DEFAULT_AUTHOR,
    category: "IoT",
    readTime: "5 min read",
    slug: "smart-iot-buildings",
    content: `Smart buildings use IoT sensors...`,
    suspended: false,
    createdAt: "2026-04-06T00:00:00.000Z",
  },
];

const emptyForm = {
  title: "",
  description: "",
  author: DEFAULT_AUTHOR,
  category: "",
  readTime: "",
  slug: "",
  content: "",
};

const SORT_OPTIONS = [
  { key: "createdAt", label: "Date" },
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
];

const labelCls =
  "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5";
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950";
const filterCls =
  "w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300";

// Build compact page list: 1 … 4 5 6 … 20
function getPageItems(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) items.push("ellipsis-left");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis-right");
  items.push(total);
  return items;
}

function getSortValue(blog, key) {
  switch (key) {
    case "createdAt":
      return blog.createdAt ? new Date(blog.createdAt).getTime() : Number.MAX_SAFE_INTEGER;
    case "status":
      return blog.suspended ? 1 : 0;
    default:
      return (blog[key] || "").toString().toLowerCase();
  }
}

function StatusBadge({ suspended }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold ${
        suspended
          ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      }`}
    >
      {suspended ? "Suspended" : "Active"}
    </span>
  );
}

function SortIcon({ active, dir }) {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M6 1.5l3 3.5H3z" className={active && dir === "asc" ? "opacity-100" : "opacity-30"} />
      <path d="M6 10.5L3 7h6z" className={active && dir === "desc" ? "opacity-100" : "opacity-30"} />
    </svg>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState(blogses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Fixed-position action menu: { id, top, right }
  const [actionMenu, setActionMenu] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [authorFilter, setAuthorFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Datatable state
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const imageInputRef = React.useRef(null);
  const [formData, setFormData] = useState(emptyForm);

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const getKey = (blog) => blog._id || blog.slug;

  /* ---------- action menu ---------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest?.("[data-action-menu]") ||
        event.target.closest?.("[data-action-trigger]")
      ) {
        return;
      }
      setActionMenu(null);
    };
    const close = () => setActionMenu(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, []);

  const toggleMenu = (e, blog) => {
    e.stopPropagation();
    const key = getKey(blog);
    if (actionMenu?.id === key) {
      setActionMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 96;
    const openUp = window.innerHeight - rect.bottom < menuHeight + 12;
    setActionMenu({
      id: key,
      top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  /* ---------- data actions ---------- */
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
      Object.entries(formData).forEach(([k, v]) => frmData.append(k, v));

      if (imageInputRef.current?.files[0]) {
        frmData.append("image", imageInputRef.current.files[0]);
      }

      const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const res = await fetch(url, { method, credentials: "include", body: frmData });
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
        setBlogs((prev) => prev.map((b) => (b._id === editingBlog._id ? savedBlog : b)));
      } else {
        setBlogs((prev) => [savedBlog, ...prev]);
      }

      setIsModalOpen(false);
      setEditingBlog(null);
      setFormData(emptyForm);
      if (imageInputRef.current) imageInputRef.current.value = "";
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
      author: blog.author || DEFAULT_AUTHOR,
      category: blog.category || "",
      readTime: blog.readTime || "",
      slug: blog.slug || "",
      content: blog.content || "",
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
    setActionMenu(null);
    setIsModalOpen(true);
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    setFormData(emptyForm);
    if (imageInputRef.current) imageInputRef.current.value = "";
    setActionMenu(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setIsModalOpen(false);
    setEditingBlog(null);
    setFormData(emptyForm);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSuspend = async (blog) => {
    const nextSuspended = !Boolean(blog.suspended);
    const confirmed = window.confirm(
      nextSuspended ? `Suspend "${blog.title}"?` : `Unsuspend "${blog.title}"?`
    );

    if (!confirmed) {
      setActionMenu(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/blogs/${blog._id}/suspend`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: nextSuspended }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to update blog status.");
        return;
      }

      setBlogs((prev) =>
        prev.map((item) =>
          item._id === blog._id ? data.data || { ...item, suspended: nextSuspended } : item
        )
      );

      setActionMenu(null);
      toast.success(
        data.message ||
          (nextSuspended ? "Blog suspended successfully." : "Blog unsuspended successfully.")
      );
    } catch (error) {
      toast.error("Something went wrong while updating blog status.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- session + fetch ---------- */
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

        if (fetchedData.length > 0) setBlogs(fetchedData);
      } catch (err) {
        console.error("API Fetch failed, using static fallback data:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, [isRefreshing]);

  /* ---------- filter -> sort -> paginate ---------- */
  const categoryOptions = useMemo(
    () => [...new Set(blogs.map((b) => b.category?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [blogs]
  );
  const authorOptions = useMemo(
    () => [...new Set(blogs.map((b) => b.author?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null;

    return blogs.filter((blog) => {
      const matchesSearch =
        !term ||
        blog.title?.toLowerCase().includes(term) ||
        blog.category?.toLowerCase().includes(term) ||
        blog.author?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "SUSPENDED"
          ? Boolean(blog.suspended)
          : !blog.suspended;

      const matchesCategory = categoryFilter === "ALL" || blog.category?.trim() === categoryFilter;
      const matchesAuthor = authorFilter === "ALL" || blog.author?.trim() === authorFilter;

      let matchesDate = true;
      if (from !== null || to !== null) {
        const created = blog.createdAt ? new Date(blog.createdAt).getTime() : null;
        if (created === null) matchesDate = false;
        else {
          if (from !== null && created < from) matchesDate = false;
          if (to !== null && created > to) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor && matchesDate;
    });
  }, [blogs, searchTerm, statusFilter, categoryFilter, authorFilter, dateFrom, dateTo]);

  const sortedBlogs = useMemo(() => {
    const { key, dir } = sortConfig;
    const mult = dir === "asc" ? 1 : -1;
    return [...filteredBlogs].sort((a, b) => {
      const av = getSortValue(a, key);
      const bv = getSortValue(b, key);
      if (av < bv) return -1 * mult;
      if (av > bv) return 1 * mult;
      return 0;
    });
  }, [filteredBlogs, sortConfig]);

  const totalItems = sortedBlogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedBlogs = sortedBlogs.slice(startIndex, startIndex + pageSize);

  // Back to page 1 whenever filters / page size change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, categoryFilter, authorFilter, dateFrom, dateTo, pageSize]);

  // Close the row menu when the visible rows change
  useEffect(() => {
    setActionMenu(null);
  }, [safePage, pageSize, sortConfig]);

  const activeFilterCount =
    (statusFilter !== "ALL" ? 1 : 0) +
    (categoryFilter !== "ALL" ? 1 : 0) +
    (authorFilter !== "ALL" ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0);

  const hasAnyFilter = activeFilterCount > 0 || searchTerm.trim() !== "";

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setAuthorFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "createdAt" ? "desc" : "asc" }
    );
  };

  const menuBlog = actionMenu ? blogs.find((b) => getKey(b) === actionMenu.id) : null;

  const DotsButton = ({ blog }) => (
    <button
      type="button"
      data-action-trigger
      onClick={(e) => toggleMenu(e, blog)}
      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
      aria-label="Blog actions"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>
  );

  const SortTh = ({ label, sortKey, className = "" }) => {
    const active = sortConfig.key === sortKey;
    return (
      <th
        className={`py-3.5 px-4 lg:px-5 ${className}`}
        aria-sort={active ? (sortConfig.dir === "asc" ? "ascending" : "descending") : "none"}
      >
        <button
          type="button"
          onClick={() => handleSort(sortKey)}
          className={`inline-flex items-center gap-1.5 uppercase tracking-wider font-bold hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
            active ? "text-slate-900 dark:text-white" : ""
          }`}
        >
          {label}
          <SortIcon active={active} dir={sortConfig.dir} />
        </button>
      </th>
    );
  };

  const pageBtn =
    "min-w-9 h-9 px-2.5 inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
  const pageBtnIdle =
    "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";
  const pageBtnActive = "border-blue-600 bg-blue-600 text-white";

  return (
    <div className="w-full min-w-0 p-3 sm:p-5 lg:p-8 text-slate-900 dark:text-slate-50 selection:bg-blue-500/10">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Manage Blogs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Create, update, and manage publication statuses securely.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 shrink-0 cursor-pointer"
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
              className="inline-flex items-center justify-center gap-2 bg-white shadow-sm hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/15 active:scale-[0.98] transition-all flex-1 sm:flex-none whitespace-nowrap cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>New Blog</span>
            </button>
          </div>
        </div>

        {/* ONE datatable card: toolbar + table/cards + pagination */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar: search + filters */}
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, category, or author..."
                className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/50"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6.5 12h11M10 19.5h4" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${filterCls} cursor-pointer`}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Category</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={`${filterCls} cursor-pointer`}>
                    <option value="ALL">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Author</label>
                  <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className={`${filterCls} cursor-pointer`}>
                    <option value="ALL">All Authors</option>
                    {authorOptions.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Sort by</label>
                  <div className="flex gap-2">
                    <select
                      value={sortConfig.key}
                      onChange={(e) =>
                        setSortConfig({ key: e.target.value, dir: e.target.value === "createdAt" ? "desc" : "asc" })
                      }
                      className={`${filterCls} cursor-pointer`}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.key} value={o.key}>{o.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setSortConfig((p) => ({ ...p, dir: p.dir === "asc" ? "desc" : "asc" }))}
                      className="shrink-0 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                      title={sortConfig.dir === "asc" ? "Ascending" : "Descending"}
                      aria-label="Toggle sort direction"
                    >
                      {sortConfig.dir === "asc" ? "↑ Asc" : "↓ Desc"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className={labelCls}>Created from</label>
                  <input type="date" value={dateFrom} max={dateTo || undefined} onChange={(e) => setDateFrom(e.target.value)} className={filterCls} />
                </div>
                <div>
                  <label className={labelCls}>Created to</label>
                  <input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className={filterCls} />
                </div>
                <div className="sm:col-span-2 flex sm:justify-end">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    disabled={!hasAnyFilter}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results summary */}
        {/* <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-y border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
          <span>
            {totalItems} {totalItems === 1 ? "blog" : "blogs"}
            {hasAnyFilter && totalItems !== blogs.length ? ` (filtered from ${blogs.length})` : ""}
          </span>
          {hasAnyFilter && (
            <button type="button" onClick={clearAllFilters} className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
              Clear filters
            </button>
          )}
        </div> */}

        {/* TABLE: tablet + desktop (md and up) */}
        <div className="hidden md:block">
          <table className="w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <SortTh label="Title" sortKey="title" />
                <th className="py-3.5 px-4 lg:px-5 w-56 hidden xl:table-cell font-bold uppercase tracking-wider">Description</th>
                <SortTh label="Author" sortKey="author" className="w-36 lg:w-40" />
                <SortTh label="Category" sortKey="category" className="w-36 hidden lg:table-cell" />
                <SortTh label="Status" sortKey="status" className="w-32" />
                <th className="py-3.5 px-4 lg:px-5 w-48 hidden 2xl:table-cell font-bold uppercase tracking-wider">Content</th>
                <SortTh label="Date" sortKey="createdAt" className="w-32" />
                <th className="py-3.5 px-3 w-14 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="h-14 bg-slate-100/40 dark:bg-slate-800/20" colSpan={8}></td>
                  </tr>
                ))
              ) : pagedBlogs.length > 0 ? (
                pagedBlogs.map((blog) => (
                  <tr key={getKey(blog)} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 lg:px-5">
                      <div className="font-semibold truncate" title={blog.title}>
                        {blog.title}
                      </div>
                      {blog.category && (
                        <div className="lg:hidden mt-1 text-xs text-slate-500 truncate">{blog.category}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 lg:px-5 text-slate-500 dark:text-slate-400 truncate hidden xl:table-cell" title={blog.description}>
                      {blog.description}
                    </td>
                    <td className="py-3.5 px-4 lg:px-5 text-slate-600 dark:text-slate-300 truncate" title={blog.author}>
                      {blog.author}
                    </td>
                    <td className="py-3.5 px-4 lg:px-5 hidden lg:table-cell">
                      <span className="inline-block max-w-full truncate align-middle px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 lg:px-5">
                      <StatusBadge suspended={blog.suspended} />
                    </td>
                    <td className="py-3.5 px-4 lg:px-5 text-slate-500 truncate hidden 2xl:table-cell">
                      {blog.content}
                    </td>
                    <td className="py-3.5 px-4 lg:px-5 text-xs text-slate-500 whitespace-nowrap">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <DotsButton blog={blog} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                    No blog publications found matching your filters.
                    {hasAnyFilter && (
                      <button type="button" onClick={clearAllFilters} className="block mx-auto mt-2 font-semibold text-blue-600 dark:text-blue-400 cursor-pointer">
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARDS: mobile (1 col) and large phones (2 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/30 md:hidden">
          {isLoading ? (
            <div className="col-span-full text-center py-6 animate-pulse text-sm text-slate-500">
              Loading posts...
            </div>
          ) : pagedBlogs.length > 0 ? (
            pagedBlogs.map((blog) => (
              <div
                key={getKey(blog)}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm min-w-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs uppercase shrink-0 shadow-sm shadow-blue-500/20">
                      {(blog.title || "").substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block text-sm truncate">
                        {blog.title}
                      </span>
                      <span className="text-xs text-slate-400 block truncate">
                        {[blog.category, blog.readTime].filter(Boolean).join(" • ")}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 -mr-1">
                    <DotsButton blog={blog} />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {blog.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl flex flex-wrap gap-x-3 gap-y-2 justify-between items-center text-xs text-slate-500">
                  <span className="min-w-0 truncate">
                    Author: <b>{blog.author}</b>
                  </span>
                  <StatusBadge suspended={blog.suspended} />
                  <span className="w-full text-[11px] text-slate-400">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Just Now"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              No publications match your filters.
              {hasAnyFilter && (
                <button type="button" onClick={clearAllFilters} className="block mx-auto mt-2 font-semibold text-blue-600 dark:text-blue-400 cursor-pointer">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination footer (shared by table + cards) */}
        {!isLoading && totalItems > 0 && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>
                Showing <b className="text-slate-700 dark:text-slate-200">{startIndex + 1}</b>–
                <b className="text-slate-700 dark:text-slate-200">{Math.min(startIndex + pageSize, totalItems)}</b> of{" "}
                <b className="text-slate-700 dark:text-slate-200">{totalItems}</b>
              </span>
              <label className="inline-flex items-center gap-2">
                Rows per page
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 text-sm rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <nav className="flex items-center gap-1.5 flex-wrap justify-center" aria-label="Pagination">
              <button type="button" onClick={() => setPage(1)} disabled={safePage === 1} className={`${pageBtn} ${pageBtnIdle} hidden sm:inline-flex`} aria-label="First page">
                «
              </button>
              <button type="button" onClick={() => setPage(safePage - 1)} disabled={safePage === 1} className={`${pageBtn} ${pageBtnIdle}`} aria-label="Previous page">
                ‹
              </button>

              {/* Compact indicator on phones, numbered buttons from sm up */}
              <span className="sm:hidden px-2 text-sm text-slate-500">
                Page {safePage} / {totalPages}
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                {getPageItems(safePage, totalPages).map((item) =>
                  typeof item === "string" ? (
                    <span key={item} className="px-1 text-slate-400">…</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      aria-current={item === safePage ? "page" : undefined}
                      className={`${pageBtn} ${item === safePage ? pageBtnActive : pageBtnIdle}`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <button type="button" onClick={() => setPage(safePage + 1)} disabled={safePage === totalPages} className={`${pageBtn} ${pageBtnIdle}`} aria-label="Next page">
                ›
              </button>
              <button type="button" onClick={() => setPage(totalPages)} disabled={safePage === totalPages} className={`${pageBtn} ${pageBtnIdle} hidden sm:inline-flex`} aria-label="Last page">
                »
              </button>
            </nav>
          </div>
        )}
        </div>
      </div>

      {/* Single fixed-position action menu */}
      {menuBlog && actionMenu && (
        <div
          data-action-menu
          style={{ position: "fixed", top: actionMenu.top, right: actionMenu.right }}
          className="z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <button
            type="button"
            onClick={() => handleEdit(menuBlog)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span>✏️</span>
            Edit Blog
          </button>
          <button
            type="button"
            onClick={() => handleSuspend(menuBlog)}
            disabled={isLoading}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer ${
              menuBlog.suspended
                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                : "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            } disabled:opacity-50`}
          >
            <span>{menuBlog.suspended ? "▶️" : "⏸️"}</span>
            {menuBlog.suspended ? "Unsuspend Blog" : "Suspend Blog"}
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                {editingBlog ? "Edit Blog Publication" : "Create New Blog"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col min-h-0">
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className={labelCls}>Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Smart Technology Advancements" className={inputCls} required />
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief summary..." rows={2} className={inputCls} required />
                </div>

                <div>
                  <label className={labelCls}>Banner Image{!editingBlog && "*"}</label>
                  <input
                    type="file"
                    name="image"
                    ref={imageInputRef}
                    accept="image/*"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:border-blue-500 dark:border-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 cursor-pointer"
                    required={!editingBlog}
                  />
                  {editingBlog && (
                    <p className="mt-1 text-xs text-slate-400">Leave empty to keep your existing banner image.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Technology" className={inputCls} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className={labelCls}>Read Time</label>
                    <input type="text" name="readTime" value={formData.readTime} onChange={handleInputChange} placeholder="e.g. 5 min read" className={inputCls} required />
                  </div>
                  <div>
                    <label className={labelCls}>Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="e.g. unique-slug" className={inputCls} required />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Content</label>
                  <textarea name="content" value={formData.content} onChange={handleInputChange} rows={4} placeholder="Write or paste your full markdown/text content here..." className={inputCls} required />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
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