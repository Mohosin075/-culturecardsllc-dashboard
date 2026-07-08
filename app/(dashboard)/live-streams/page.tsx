"use client";

import React, { useEffect, useState, useRef } from "react";
import { Radio, Users, Clock, Flag, Star, Calendar, Loader2, Info, Heart, MessageSquare, Send, ThumbsUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
  fetchLiveStreams,
  cancelScheduledStream,
  type LiveStream,
  type ScheduledStream,
} from "@/app/store/slices/liveStreamsSlice";
import ErrorState from "@/app/components/ErrorState";
import { useAlert } from "@/app/context/AlertContext";
import { io, Socket } from "socket.io-client";

export default function LiveStreamsPage() {
  const dispatch = useAppDispatch();
  const { live: liveStreams, scheduled: scheduledStreams, loading } = useAppSelector(
    (state) => state.liveStreams
  );
  const [selectedStream, setSelectedStream] = useState<ScheduledStream | null>(null);
  const [selectedLiveStream, setSelectedLiveStream] = useState<LiveStream | null>(null);
  const [favoritedStreams, setFavoritedStreams] = useState<string[]>([]);
  const [reportedStreams, setReportedStreams] = useState<string[]>([]);
  const { showAlert, showConfirm } = useAlert();
  const socketRef = useRef<Socket | null>(null);

  // Polling setup: fetch live streams every 8 seconds for real-time updates (paused when viewing a stream)
  useEffect(() => {
    dispatch(fetchLiveStreams());
    if (selectedLiveStream) return;

    const interval = setInterval(() => {
      dispatch(fetchLiveStreams());
    }, 8000);
    return () => clearInterval(interval);
  }, [dispatch, selectedLiveStream]);

  const handleCancelStream = (id: string) => {
    showConfirm(
      "Are you sure you want to cancel this scheduled stream?",
      () => {
        dispatch(cancelScheduledStream(id));
        showAlert("Scheduled stream cancelled successfully.", "success");
      },
      "Cancel Scheduled Stream"
    );
  };

  const handleToggleFavorite = (id: string) => {
    setFavoritedStreams((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showAlert("Removed from favorites", "info");
        return prev.filter((item) => item !== id);
      } else {
        showAlert("Added to favorites!", "success");
        return [...prev, id];
      }
    });
  };

  const handleReportStream = (id: string) => {
    if (reportedStreams.includes(id)) {
      showAlert("You have already reported this stream.", "info");
      return;
    }
    showConfirm(
      "Are you sure you want to flag and report this live stream for review?",
      () => {
        setReportedStreams((prev) => [...prev, id]);
        showAlert("Stream reported successfully. Admin will review.", "success");
      },
      "Report Stream"
    );
  };

  const [liveViewers, setLiveViewers] = useState(0);
  const [liveLikes, setLiveLikes] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string }[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Connect to real-time sockets on stream view
  useEffect(() => {
    if (!selectedLiveStream) return;

    setLiveViewers(selectedLiveStream.viewers || 0);
    setLiveLikes(selectedLiveStream.likes || 0);
    setChatMessages(selectedLiveStream.chatMessages || []);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
    let userId = "6a4d8b79a67e341aa6a4145a"; // Fallback admin/seller id
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload.userId || payload._id || userId;
      }
    } catch (e) {}

    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007/api/v1").replace("/api/v1", "");
    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: { token: token || undefined },
    });

    console.log("Connecting to socket server...", socketUrl);

    socket.on("connect", () => {
      console.log("Connected to socket room for stream:", selectedLiveStream.id);
      socket.emit("join-stream", { streamId: selectedLiveStream.id, userId });
    });

    // Receive viewer counts in real time
    socket.on("viewer-count-update", (data: { streamId: string; viewersCount: number }) => {
      if (data.streamId === selectedLiveStream.id) {
        setLiveViewers(data.viewersCount);
      }
    });

    // Receive new reactions / likes
    socket.on("new-reaction", (data: { streamId: string; likesCount: number }) => {
      if (String(data.streamId).toLowerCase() === String(selectedLiveStream.id).toLowerCase()) {
        setLiveLikes(data.likesCount);
        // Render a heart floating up on another user's reaction
        const id = Date.now() + Math.random();
        const style: React.CSSProperties = {
          left: `${Math.floor(Math.random() * 60) + 20}%`,
          animation: "floatUp 1.2s ease-out forwards",
        };
        setHearts((h) => [...h, { id, style }]);
        setTimeout(() => {
          setHearts((h) => h.filter((x) => x.id !== id));
        }, 1200);
      }
    });

    // Receive new chat messages
    socket.on("new-chat-message", (data: { streamId: string; user: any; message: string; timestamp: string }) => {
      if (String(data.streamId).toLowerCase() === String(selectedLiveStream.id).toLowerCase()) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            user: data.user?.fullName || data.user?.name || "User",
            text: data.message,
          },
        ]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.emit("leave-stream", selectedLiveStream.id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedLiveStream]);

  const handleLike = () => {
    if (!selectedLiveStream) return;
    
    // Optimistic UI Update: immediately increment like count and render heart locally
    setLiveLikes((prev) => prev + 1);
    const animId = Date.now() + Math.random();
    const style: React.CSSProperties = {
      left: `${Math.floor(Math.random() * 60) + 20}%`,
      animation: "floatUp 1.2s ease-out forwards",
    };
    setHearts((h) => [...h, { id: animId, style }]);
    setTimeout(() => {
      setHearts((h) => h.filter((x) => x.id !== animId));
    }, 1200);

    if (socketRef.current) {
      socketRef.current.emit("stream-reaction", {
        streamId: selectedLiveStream.id,
        reactionType: "like",
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedLiveStream) return;

    let userId = "6a4d8b79a67e341aa6a4145a";
    try {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload.userId || payload._id || userId;
      }
    } catch (e) {}

    if (socketRef.current) {
      socketRef.current.emit("stream-chat", {
        streamId: selectedLiveStream.id,
        userId,
        message: newMsg.trim(),
      });
    }

    setNewMsg("");
  };



  const { error } = useAppSelector((state) => state.liveStreams);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchLiveStreams())} />;
  }

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
        {liveStreams.map((stream: LiveStream) => (
          <div key={stream.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group">
            {/* Thumbnail Placeholder */}
            <div className={`aspect-video w-full relative ${stream.thumbnail ?? 'bg-gradient-to-br from-indigo-900 to-blue-900'} flex items-center justify-center`}>
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
                <button
                  onClick={() => setSelectedLiveStream(stream)}
                  className="flex-1 bg-[#155DFC] hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                >
                  View Stream
                </button>
                <button
                  onClick={() => handleReportStream(stream.id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    reportedStreams.includes(stream.id)
                      ? "bg-red-500/20 text-red-500 border border-red-500/30"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Report Live Stream"
                >
                  <Flag size={18} className={reportedStreams.includes(stream.id) ? "fill-red-500" : ""} />
                </button>
                <button
                  onClick={() => handleToggleFavorite(stream.id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    favoritedStreams.includes(stream.id)
                      ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Favorite Live Stream"
                >
                  <Star size={18} className={favoritedStreams.includes(stream.id) ? "fill-yellow-500" : ""} />
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
                {scheduledStreams.map((stream: ScheduledStream) => (
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
                        <button
                          onClick={() => setSelectedStream(stream)}
                          className="bg-[#155DFC]/10 hover:bg-[#155DFC] text-[#155DFC] hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-[#155DFC]/20"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCancelStream(stream.id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-500/20"
                        >
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

      {/* Stream Details Modal */}
      {selectedStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedStream(null)}
          />

          <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedStream.title}</h2>
                  <p className="text-zinc-500 text-sm mt-1">Scheduled Live Stream Details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Stream ID</span>
                  <span className="text-sm font-mono text-zinc-300 block mt-1">{selectedStream.id}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Category</span>
                  <span className="text-sm font-medium text-blue-400 block mt-1">
                    {selectedStream.category || "General"}
                  </span>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Host / Seller</span>
                  <span className="text-sm text-zinc-300 block mt-1">{selectedStream.seller}</span>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Scheduled Start Time</span>
                  <span className="text-sm text-zinc-300 font-semibold block mt-1">{selectedStream.time}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedStream(null)}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream View Modal (Real-time Simulation) */}
      {selectedLiveStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedLiveStream(null)}
          />

          <style>{`
            @keyframes floatUp {
              0% {
                transform: translateY(0) scale(0.8);
                opacity: 1;
              }
              100% {
                transform: translateY(-160px) scale(1.3);
                opacity: 0;
              }
            }
          `}</style>

          <div className="relative w-full max-w-4xl bg-[#0f0f10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row h-[85vh] md:h-[600px]">
            {/* Live Video Simulation Area */}
            <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
              {/* Pulsating antenna / stream signal simulator */}
              <div className="flex flex-col items-center justify-center space-y-4 text-center z-10 p-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#155DFC]/20 animate-ping w-24 h-24" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#155DFC] to-blue-500 flex items-center justify-center shadow-lg shadow-[#155DFC]/30">
                    <Radio size={32} className="text-white animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-lg">{selectedLiveStream.title}</h4>
                  <p className="text-zinc-500 text-xs">Host: {selectedLiveStream.seller}</p>
                </div>
              </div>

              {/* Status overlays */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-widest shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md">
                  <Users size={12} className="text-blue-400" />
                  {liveViewers} viewers
                </span>
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md">
                  <Heart size={12} className="text-red-500 fill-red-500" />
                  {liveLikes} likes
                </span>
              </div>

              {/* Floating Hearts Container */}
              <div className="absolute inset-0 pointer-events-none z-20">
                {hearts.map((h) => (
                  <div key={h.id} style={h.style} className="absolute bottom-16 text-red-500">
                    <Heart size={28} className="fill-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  </div>
                ))}
              </div>

              {/* Interaction Bar on Stream */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl z-10">
                <div className="flex gap-2">
                  <button
                    onClick={handleLike}
                    className="p-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold active:scale-95"
                  >
                    <Heart size={16} className="fill-current" />
                    Like
                  </button>
                  <button
                    onClick={() => handleToggleFavorite(selectedLiveStream.id)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      favoritedStreams.includes(selectedLiveStream.id)
                        ? "bg-yellow-500 text-white"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Star size={16} className={favoritedStreams.includes(selectedLiveStream.id) ? "fill-current" : ""} />
                  </button>
                </div>

                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">
                  {selectedLiveStream.category}
                </span>
              </div>
            </div>

            {/* Chat and Info Panel */}
            <div className="w-full md:w-[320px] bg-[#111112] border-t md:border-t-0 md:border-l border-white/5 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-bold text-white text-sm">Live Chat</h3>
                  <p className="text-zinc-500 text-[10px]">Real-time stream feed</p>
                </div>
                <button
                  onClick={() => setSelectedLiveStream(null)}
                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0 flex flex-col">
                <div className="text-[10px] text-zinc-500 bg-white/5 p-2 rounded-xl text-center mb-2">
                  Welcome to the Live Stream Chat room. Maintain respectful communication.
                </div>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs space-y-0.5">
                    <span className={`font-bold block ${msg.user.startsWith("Admin") ? "text-[#155DFC]" : "text-zinc-400"}`}>
                      {msg.user}
                    </span>
                    <span className="text-zinc-200 block bg-zinc-900/60 p-2 rounded-xl border border-white/[0.02]">
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-zinc-950/80 shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-zinc-200 focus:outline-none focus:border-[#155DFC]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#155DFC] hover:bg-blue-600 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
