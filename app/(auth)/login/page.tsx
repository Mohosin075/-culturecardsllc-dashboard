"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    router.push("/overview");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p className="text-zinc-500 text-sm">Welcome back! Please enter your details.</p>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-blue-500/5">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#155DFC] transition-colors" size={20} />
              <input
                required
                type="email"
                placeholder="admin@culture.com"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-[#155DFC] transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
              <Link href="/forgot" className="text-xs font-bold text-[#155DFC] hover:text-blue-400 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#155DFC] transition-colors" size={20} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-[#155DFC] transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-white/10 bg-black text-[#155DFC] focus:ring-[#155DFC] focus:ring-offset-black"
            />
            <label htmlFor="remember" className="text-sm font-medium text-zinc-400 select-none">Remember for 30 days</label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#155DFC] hover:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            Sign In
            <ArrowRight size={20} />
          </button>
        </form>
      </div>

      <p className="text-center text-zinc-500 text-sm">
        Don&apos;t have access?{" "}
        <a href="#" className="text-[#155DFC] font-bold hover:underline">Contact System Admin</a>
      </p>
    </div>
  );
}
