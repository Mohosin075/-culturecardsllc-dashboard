import React from "react";
import { Radio, Users, Clock, Flag, Star, Calendar, Eye } from "lucide-react";

const liveStreams = [
  {
    id: "STR-001",
    title: "Rare Sneakers Auction - Jordan Collection",
    seller: "SneakerKing",
    category: "Sneakers",
    viewers: 234,
    duration: "45m",
    thumbnail: "bg-gradient-to-br from-indigo-900 to-blue-900",
  },
  {
    id: "STR-002",
    title: "Vintage Watch Showcase",
    seller: "WatchMaster",
    category: "Watches",
    viewers: 89,
    duration: "1h 20m",
    thumbnail: "bg-gradient-to-br from-purple-900 to-indigo-900",
  },
  {
    id: "STR-003",
    title: "Pokemon Cards Opening - Booster Box",
    seller: "CardCollector99",
    category: "Cards",
    viewers: 567,
    duration: "32m",
    thumbnail: "bg-gradient-to-br from-blue-900 to-purple-900",
  },
];

const scheduledStreams = [
  {
    id: "STR-004",
    title: "Limited Edition Yeezy Drop",
    seller: "SneakerHub",
    category: "Sneakers",
    time: "2026-04-24 18:00",
  },
  {
    id: "STR-005",
    title: "Luxury Watch Collection Tour",
    seller: "TimeKeeper",
    category: "Watches",
    time: "2026-04-24 20:00",
  },
  {
    id: "STR-006",
    title: "Trading Card Grading Session",
    seller: "CardExpert",
    category: "Cards",
    time: "2026-04-25 15:00",
  },
];

export default function LiveStreamsPage() {
  return (
    <div className="space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-semibold text-white">Live Auctions</h1>
        <div className="flex items-center gap-2 mt-4 text-red-500">
          <Radio size={20} className="animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-xs">Currently Live</span>
        </div>
      </div>

      {/* Currently Live Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveStreams.map((stream) => (
          <div key={stream.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group">
            {/* Thumbnail Placeholder */}
            <div className={`aspect-video w-full relative ${stream.thumbnail} flex items-center justify-center`}>
              <Radio size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                <Users size={12} />
                {stream.viewers}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-zinc-100 line-clamp-1 group-hover:text-[#155DFC] transition-colors">
                  {stream.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-zinc-500">
                  <Users size={14} />
                  <span className="text-xs">{stream.seller}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                  {stream.category}
                </span>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Clock size={12} />
                  <span className="text-[10px]">{stream.duration}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-[#155DFC] hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-bold transition-all active:scale-95">
                  View Stream
                </button>
                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all">
                  <Flag size={18} />
                </button>
                <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all">
                  <Star size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Streams */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-blue-500">
          <Calendar size={20} />
          <h2 className="text-xl font-bold uppercase tracking-widest text-xs">Scheduled Streams</h2>
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Stream ID</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Seller</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Scheduled Time</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scheduledStreams.map((stream) => (
                  <tr key={stream.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-zinc-500">{stream.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-200">{stream.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {stream.seller}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase">
                        {stream.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 font-medium">
                      {stream.time}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="bg-[#155DFC]/10 hover:bg-[#155DFC] text-[#155DFC] hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#155DFC]/20">
                          View Details
                        </button>
                        <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
