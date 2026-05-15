"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/10">
            <CheckCircle2 size={40} />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Check your email</h1>
          <p className="text-zinc-500 text-sm px-4">
            We&apos;ve sent a password reset link to <span className="text-zinc-200 font-semibold">admin@culture.com</span>
          </p>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
           <Link
            href="/login"
            className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            Back to Login
          </Link>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="w-full text-zinc-500 text-sm font-medium mt-6 hover:text-white transition-colors"
          >
            Didn&apos;t receive the email? <span className="text-[#155DFC] font-bold">Click to resend</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password?</h1>
        <p className="text-zinc-500 text-sm">No worries, we&apos;ll send you reset instructions.</p>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#155DFC] transition-colors" size={20} />
              <input
                required
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-[#155DFC] transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#155DFC] hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            Reset Password
          </button>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-white text-sm font-semibold transition-colors pt-2"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
