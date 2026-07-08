"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, X, ArrowLeftRight, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchTrades, declineTrade, Trade } from "@/app/store/slices/tradesSlice";
import { useAlert } from "@/app/context/AlertContext";
import ErrorState from "@/app/components/ErrorState";

export default function TradesPage() {
  const dispatch = useAppDispatch();
  const { items: trades, loading } = useAppSelector((state) => state.trades);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    dispatch(fetchTrades());
  }, [dispatch]);

  const handleDeclineTrade = (id: string) => {
    showConfirm(
      "Are you sure you want to decline this trade transaction? This action cannot be undone.",
      () => {
        dispatch(declineTrade(id));
        showAlert("Trade declined successfully.", "success");
      },
      "Decline Trade"
    );
  };

  const filteredTrades = trades.filter(
    (trade: Trade) =>
      trade.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.receiver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.senderProduct?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.receiverProduct?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { error } = useAppSelector((state) => state.trades);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchTrades())} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Trades (BidSwap)</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search by trade ID, items, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-[#155DFC] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#111111] border border-white/5 px-4 py-2 rounded-xl text-zinc-300 hover:bg-white/5 transition-colors">
          <Filter size={18} />
          <span className="font-medium">Filter</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-sm">
                <th className="px-6 py-4 font-medium">Trade ID</th>
                <th className="px-6 py-4 font-medium">Sender</th>
                <th className="px-6 py-4 font-medium">Receiver</th>
                <th className="px-6 py-4 font-medium">Offered Items</th>
                <th className="px-6 py-4 font-medium text-center">Cash Supplement</th>
                <th className="px-6 py-4 font-medium">Verification</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-zinc-500">{trade.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {trade.sender?.charAt(0) || "S"}
                      </div>
                      <span className="font-medium truncate max-w-[100px]">{trade.sender}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {trade.receiver?.charAt(0) || "R"}
                      </div>
                      <span className="font-medium truncate max-w-[100px]">{trade.receiver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-200">{trade.senderProduct}</span>
                      <ArrowLeftRight size={12} className="text-zinc-500 shrink-0" />
                      <span className="text-zinc-200">{trade.receiverProduct}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-zinc-200">
                    {trade.supplement || "$0"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-green-500/10 text-green-500 border-green-500/20">
                      Escrow Verified
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        trade.status === "Completed" || trade.status === "Accepted"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : trade.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <button
                        onClick={() => setSelectedTrade(trade)}
                        className="hover:text-white transition-colors"
                        title="View Swap Info"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeclineTrade(trade.id)}
                        className="hover:text-red-500 transition-colors"
                        title="Cancel/Decline Trade"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade details Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedTrade(null)}
          />

          <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">BidSwap Details</h2>
                  <p className="text-zinc-500 text-sm mt-1">Direct item exchange statistics</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedTrade.status === "Completed" || selectedTrade.status === "Accepted"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : selectedTrade.status === "Pending"
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  {selectedTrade.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Trade ID</span>
                  <span className="text-sm font-mono text-zinc-300 block mt-1">{selectedTrade.id}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Supplement Cash</span>
                  <span className="text-sm font-medium text-green-500 block mt-1">{selectedTrade.supplement || "$0"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2">
                  <span className="text-xs text-blue-400 uppercase tracking-wider block font-bold">Sender Offer ({selectedTrade.sender})</span>
                  <span className="text-sm text-zinc-300 font-medium block">{selectedTrade.senderProduct}</span>
                </div>
                <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl space-y-2">
                  <span className="text-xs text-teal-400 uppercase tracking-wider block font-bold">Receiver Demand ({selectedTrade.receiver})</span>
                  <span className="text-sm text-zinc-300 font-medium block">{selectedTrade.receiverProduct}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                  Close Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
