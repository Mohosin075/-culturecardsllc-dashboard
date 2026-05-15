import React from "react";
import { Check, X, MessageSquare, FileText } from "lucide-react";

const requests = [
  {
    id: "VER-001",
    name: "John Smith",
    email: "john@example.com",
    category: "Sneakers",
    submitted: "2026-04-20",
    status: "Pending",
    documents: ["ID Card", "Business License"],
  },
  {
    id: "VER-002",
    name: "Emily Chen",
    email: "emily@example.com",
    category: "Cards",
    submitted: "2026-04-21",
    status: "Pending",
    documents: ["ID Card", "Proof of Address"],
  },
  {
    id: "VER-003",
    name: "David Martinez",
    email: "david@example.com",
    category: "Watches",
    submitted: "2026-04-22",
    status: "Pending",
    documents: ["ID Card", "Business License", "Tax Certificate"],
  },
  {
    id: "VER-004",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    category: "Sneakers",
    submitted: "2026-04-23",
    status: "Pending",
    documents: ["ID Card", "Proof of Address"],
  },
];

export default function SellerVerificationPage() {
  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-semibold text-white">Seller Verification Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{request.name}</h2>
                <p className="text-sm text-zinc-500">{request.email}</p>
              </div>
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-500/20">
                {request.status}
              </span>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Request ID:</span>
                <span className="text-zinc-300 font-mono">{request.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Category:</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                  {request.category}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Submitted:</span>
                <span className="text-zinc-300">{request.submitted}</span>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Submitted Documents:</p>
              <div className="space-y-2">
                {request.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl text-zinc-300 hover:border-white/10 transition-colors cursor-pointer group">
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/10">
                <Check size={18} />
                Approve
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/10">
                <X size={18} />
                Reject
              </button>
              <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
