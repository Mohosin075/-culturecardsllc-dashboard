"use client";

import React, { useState } from "react";
import { 
  Eye, 
  MessageSquare, 
  Check, 
  X, 
  AlertCircle, 
  FileImage, 
  FileText,
  Clock
} from "lucide-react";

const disputes = [
  {
    id: "DIS-001",
    status: "Open",
    priority: "Medium",
    date: "2026-04-22",
    users: [
      { name: "John Doe", color: "bg-blue-500", initial: "J" },
      { name: "SneakerKing", color: "bg-indigo-500", initial: "S" },
    ],
    targetId: "ORD-1234",
    issueType: "Item not as described",
    description: "Received sneakers have visible defects not shown in photos",
  },
  {
    id: "DIS-002",
    status: "Reviewing",
    priority: "High",
    date: "2026-04-21",
    users: [
      { name: "Emma Davis", color: "bg-purple-500", initial: "E" },
      { name: "CardCollector", color: "bg-blue-600", initial: "C" },
    ],
    targetId: "TRD-5678",
    issueType: "Wrong item received",
    description: "Trade partner sent different card than agreed upon",
  },
  {
    id: "DIS-003",
    status: "Open",
    priority: "High",
    date: "2026-04-23",
    users: [
      { name: "Mike Johnson", color: "bg-indigo-600", initial: "M" },
      { name: "WatchMaster", color: "bg-blue-700", initial: "W" },
    ],
    targetId: "ORD-1567",
    issueType: "Payment issue",
    description: "Payment processed but order not shipped after 5 days",
  },
];

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] | null>(null);

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-semibold text-white">Dispute Management</h1>

      <div className="space-y-6">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{dispute.id}</h2>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  dispute.status === 'Open' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }`}>
                  {dispute.status}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  dispute.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {dispute.priority}
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500 text-xs">
                <Clock size={12} />
                <span>Opened on {dispute.date}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Users Involved:</p>
                <div className="flex gap-4">
                  {dispute.users.map((user, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                        {user.initial}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 text-xs">Order/Trade ID:</span>
                  <span className="text-zinc-200 font-mono">{dispute.targetId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 text-xs">Issue Type:</span>
                  <span className="text-zinc-200 font-medium">{dispute.issueType}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description:</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{dispute.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedDispute(dispute)}
                  className="flex items-center gap-2 bg-[#155DFC] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  <Eye size={18} />
                  View Evidence
                </button>
                <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/5">
                  <MessageSquare size={18} />
                  Chat with Users
                </button>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-600/10">
                  <Check size={18} />
                  Resolve
                </button>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/10">
                  <X size={18} />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedDispute(null)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedDispute.id} - Evidence</h2>
                  <p className="text-sm text-zinc-500 mt-1">{selectedDispute.issueType}</p>
                </div>
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description:</p>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-sm text-zinc-300 leading-relaxed">
                    {selectedDispute.description}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Submitted Evidence:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl text-zinc-300 hover:border-white/10 transition-colors cursor-pointer group">
                      <FileImage size={20} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Photo evidence (3 images)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl text-zinc-300 hover:border-white/10 transition-colors cursor-pointer group">
                      <FileText size={20} className="text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium">Communication logs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
