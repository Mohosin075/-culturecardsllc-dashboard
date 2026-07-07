"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-zinc-100">Failed to load data</h3>
        <p className="text-sm text-zinc-500 max-w-sm">
          {message || "Could not connect to the server. Please check your connection and try again."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-[#155DFC] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
