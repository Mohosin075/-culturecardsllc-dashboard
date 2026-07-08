"use client";

import React from "react";
import { ScheduledStream } from "@/app/store/slices/liveStreamsSlice";

interface ScheduledStreamModalProps {
  stream: ScheduledStream | null;
  onClose: () => void;
}

export default function ScheduledStreamModal({ stream, onClose }: ScheduledStreamModalProps) {
  if (!stream) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{stream.title}</h2>
              <p className="text-zinc-500 text-sm mt-1">Scheduled Live Stream Details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Stream ID</span>
              <span className="text-sm font-mono text-zinc-300 block mt-1">{stream.id}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Category</span>
              <span className="text-sm font-medium text-blue-400 block mt-1">
                {stream.category || "General"}
              </span>
            </div>
            <div className="col-span-2 border-t border-white/5 pt-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Host / Seller</span>
              <span className="text-sm text-zinc-300 block mt-1">{stream.seller}</span>
            </div>
            <div className="col-span-2 border-t border-white/5 pt-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Scheduled Start Time</span>
              <span className="text-sm text-zinc-300 font-semibold block mt-1">{stream.time}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
