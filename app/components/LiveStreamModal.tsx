"use client";

import React, { useEffect, useState, useRef } from "react";
import { Radio, Users, Heart, Star, Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { LiveStream } from "@/app/store/slices/liveStreamsSlice";

interface LiveStreamModalProps {
  stream: LiveStream | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function LiveStreamModal({
  stream,
  onClose,
  isFavorited,
  onToggleFavorite,
}: LiveStreamModalProps) {
  const [liveViewers, setLiveViewers] = useState(stream?.viewers || 0);
  const [liveLikes, setLiveLikes] = useState(stream?.likes || 0);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string }[]>(stream?.chatMessages || []);
  const [newMsg, setNewMsg] = useState("");
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!stream) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
    let userId = "6a4d8b79a67e341aa6a4145a"; // Fallback admin/seller id
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload.userId || payload._id || userId;
      }
    } catch {
      // Ignored
    }

    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007/api/v1").replace("/api/v1", "");
    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: { token: token || undefined },
    });

    console.log("Connecting to socket server...", socketUrl);

    socket.on("connect", () => {
      console.log("Connected to socket room for stream:", stream.id);
      socket.emit("join-stream", { streamId: stream.id, userId });
    });

    // Receive viewer counts in real time
    socket.on("viewer-count-update", (data: { streamId: string; viewersCount: number }) => {
      if (data.streamId === stream.id) {
        setLiveViewers(data.viewersCount);
      }
    });

    // Receive new reactions / likes
    socket.on("new-reaction", (data: { streamId: string; likesCount: number }) => {
      if (String(data.streamId).toLowerCase() === String(stream.id).toLowerCase()) {
        setLiveLikes(data.likesCount);
        
        // Render a heart floating up on another user's reaction
        const animId = Date.now() + Math.random();
        const style: React.CSSProperties = {
          left: `${Math.floor(Math.random() * 60) + 20}%`,
          animation: "floatUp 1.2s ease-out forwards",
        };
        setHearts((h) => [...h, { id: animId, style }]);
        setTimeout(() => {
          setHearts((h) => h.filter((x) => x.id !== animId));
        }, 1200);
      }
    });

    // Receive new chat messages
    socket.on("new-chat-message", (data: { streamId: string; user: { fullName?: string; name?: string } | null; message: string; timestamp: string }) => {
      if (String(data.streamId).toLowerCase() === String(stream.id).toLowerCase()) {
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
      socket.emit("leave-stream", stream.id);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [stream]);

  const handleLike = () => {
    if (!stream) return;
    
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
        streamId: stream.id,
        reactionType: "like",
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !stream) return;

    let userId = "6a4d8b79a67e341aa6a4145a";
    try {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id || payload.userId || payload._id || userId;
      }
    } catch {
      // Ignored
    }

    if (socketRef.current) {
      socketRef.current.emit("stream-chat", {
        streamId: stream.id,
        userId,
        message: newMsg.trim(),
      });
    }

    setNewMsg("");
  };

  if (!stream) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
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
              <h4 className="text-white font-bold text-lg">{stream.title}</h4>
              <p className="text-zinc-500 text-xs">Host: {stream.seller}</p>
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
                onClick={() => onToggleFavorite(stream.id)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isFavorited
                    ? "bg-yellow-500 text-white"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                <Star size={16} className={isFavorited ? "fill-current" : ""} />
              </button>
            </div>

            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">
              {stream.category}
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
              onClick={onClose}
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
  );
}
