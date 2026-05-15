import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

const boostedListings = [
  {
    id: "BOOST-001",
    name: "Nike Air Jordan 1 Retro High OG",
    seller: "SneakerKing",
    level: "Premium",
    duration: "7 days",
    period: "2026-04-20 to 2026-04-27",
    impressions: "12,450",
    fee: "$25.00",
    status: "Active",
  },
  {
    id: "BOOST-002",
    name: "Adidas Yeezy 350 Boost V2",
    seller: "SneakerHub",
    level: "Premium",
    duration: "7 days",
    period: "2026-04-21 to 2026-04-28",
    impressions: "8,920",
    fee: "$25.00",
    status: "Active",
  },
  {
    id: "BOOST-003",
    name: "Rolex Datejust 41",
    seller: "WatchMaster",
    level: "Standard",
    duration: "3 days",
    period: "2026-04-22 to 2026-04-25",
    impressions: "3,450",
    fee: "$10.00",
    status: "Active",
  },
  {
    id: "BOOST-004",
    name: "Pokemon Card Charizard VMAX",
    seller: "CardCollector",
    level: "Premium",
    duration: "7 days",
    period: "2026-04-18 to 2026-04-25",
    impressions: "15,670",
    fee: "$25.00",
    status: "Expiring Soon",
  },
];

export default function BoostedListingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Boosted Listings</h1>
      </div>

      {/* Table Container */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Boost ID</th>
                <th className="px-6 py-4 font-medium">Listing Name</th>
                <th className="px-6 py-4 font-medium">Seller</th>
                <th className="px-6 py-4 font-medium">Boost Level</th>
                <th className="px-6 py-4 font-medium text-center">Duration</th>
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium text-right">Impressions</th>
                <th className="px-6 py-4 font-medium text-right">Fee Paid</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {boostedListings.map((item) => (
                <tr key={item.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-zinc-500">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                      <span className="font-medium text-zinc-200 truncate max-w-[200px]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-400 font-medium">{item.seller}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.level === 'Premium' 
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500 leading-relaxed">
                    {item.period.split(' to ').map((date, i) => (
                      <div key={i}>{date}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">
                    {item.impressions}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#10b981] text-lg">
                    {item.fee}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === "Active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-green-500 hover:text-green-400 transition-colors">
                      <CheckCircle2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
