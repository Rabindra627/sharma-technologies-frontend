"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setErr(data.error || "Login failed");

    router.push("/admin");
  }

  return (
    <div className="grid min-h-screen px-4 place-items-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm p-6 bg-white shadow rounded-xl"
      >
        <h1 className="text-2xl font-bold text-[#9E0F85]">Admin Login</h1>

        <div className="mt-5 space-y-3">
          <input
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Username"
            value={username}
            onChange={(e) => setU(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setP(e.target.value)}
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="w-full bg-[#9E0F85] text-white py-2 rounded-lg font-semibold">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
