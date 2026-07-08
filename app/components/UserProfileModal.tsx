"use client";

import React from "react";
import { User } from "@/app/store/slices/usersSlice";

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${user.color || 'bg-blue-600'} flex items-center justify-center text-white text-2xl font-bold`}>
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-zinc-500 text-sm">{user.username}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                user.status === "Active"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {user.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">User ID</span>
              <span className="text-sm font-mono text-zinc-300 block mt-1">{user.userId}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Role</span>
              <span className="text-sm font-medium text-blue-400 block mt-1">{user.role}</span>
            </div>
            <div className="col-span-2 border-t border-white/5 pt-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Email Address</span>
              <span className="text-sm text-zinc-300 block mt-1">{user.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#155DFC]/5 border border-[#155DFC]/10 rounded-2xl text-center">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Transactions</span>
              <span className="text-2xl font-bold text-white block mt-1">{user.transactions}</span>
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl text-center">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Rating</span>
              <span className="text-2xl font-bold text-yellow-500 block mt-1">{user.rating} / 5.0</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
