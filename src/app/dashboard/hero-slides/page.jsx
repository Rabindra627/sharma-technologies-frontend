"use client";
import { useEffect, useState } from "react";

const empty = { title: "", location: "", poster: "", order: 0 };

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([{ ...empty }]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/hero-slides");
    const data = await res.json();
    console.log(data);
    setSlides(data?.slides?.length ? data.slides : [{ ...empty }]);
    setLoading(false);
  }

  async function save() {
    const res = await fetch("/api/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slides }),
    });
    const data = await res.json();
    if (!data.ok) return alert(data.error || "Save failed");
    alert("Saved ✅");
    load();
  }

  useEffect(() => {
    // load();
  }, []);

  const update = (i, key, val) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)),
    );
  };

  const add = () => setSlides((p) => [...p, { ...empty, order: p.length }]);
  const remove = (i) => setSlides((p) => p.filter((_, idx) => idx !== i));

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hero Slides</h1>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="px-4 py-2 font-semibold border rounded-lg"
          >
            + Add
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-[#9E0F85] text-white font-semibold"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid gap-4 mt-6">
        {slides.map((s, i) => (
          <div key={i} className="grid gap-3 p-4 bg-white shadow rounded-xl">
            <div className="flex items-center justify-between">
              <div className="font-bold">Slide #{i + 1}</div>
              <button
                onClick={() => remove(i)}
                className="text-sm font-semibold text-red-600"
              >
                Remove
              </button>
            </div>

            <textarea
              className="px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Title (use \n for new line)"
              value={s.title}
              onChange={(e) => update(i, "title", e.target.value)}
            />
            <input
              className="px-3 py-2 border rounded-lg"
              placeholder="Location"
              value={s.location}
              onChange={(e) => update(i, "location", e.target.value)}
            />
            
            <input
              className="px-3 py-2 border rounded-lg"
              placeholder="Poster URL (/images/... or Cloudinary URL)"
              value={s.poster}
              onChange={(e) => update(i, "poster", e.target.value)}
            />
            <input
              type="number"
              className="px-3 py-2 border rounded-lg"
              placeholder="Order"
              value={s.order ?? i}
              onChange={(e) => update(i, "order", Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
