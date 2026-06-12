"use client";

import { useEffect, useState } from "react";

export default function AdminEnrollments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/enrollments", { cache: "no-store" });
    const data = await res.json();
    if (data.ok) setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    // load();
  }, []);

  return (
    <div className="p-5 bg-white border rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xl font-extrabold">Enrollments</div>
          <div className="text-sm text-gray-600">Latest 200 records</div>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 text-white rounded bg-slate-900"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-gray-600">Loading...</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-gray-600">No enrollments found.</div>
      ) : (
        <div className="mt-5 overflow-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm w-full border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left border">Date</th>
                <th className="px-3 py-2 text-left border">Name</th>
                <th className="px-3 py-2 text-left border">Phone</th>
                <th className="px-3 py-2 text-left border">Course</th>
                <th className="px-3 py-2 text-left border">Destination</th>
                <th className="px-3 py-2 text-left border">Message</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border whitespace-nowrap">
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-semibold border">{it.name}</td>
                  <td className="px-3 py-2 border">{it.phone}</td>
                  <td className="px-3 py-2 border">{it.course}</td>
                  <td className="px-3 py-2 border">{it.destination}</td>
                  <td className="border px-3 py-2 max-w-[420px]">
                    <div className="line-clamp-2">{it.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
