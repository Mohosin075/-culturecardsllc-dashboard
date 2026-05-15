import React from "react";
import { ShoppingCart, Repeat, AlertTriangle, Bell, CheckCircle2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Order Placed",
    category: "Order Update",
    content: "John Doe placed an order for Nike Air Jordan 1 ($320)",
    time: "5 minutes ago",
    type: "order",
    icon: ShoppingCart,
    color: "bg-blue-600",
    isUnread: true,
  },
  {
    id: 2,
    title: "Trade Accepted",
    category: "Trade Update",
    content: "Emma Davis accepted the trade with Ryan Clark",
    time: "15 minutes ago",
    type: "trade",
    icon: Repeat,
    color: "bg-purple-600",
    isUnread: true,
  },
  {
    id: 3,
    title: "New Dispute Filed",
    category: "Dispute",
    content: "Mike Johnson filed a dispute for order ORD-1567",
    time: "1 hour ago",
    type: "dispute",
    icon: AlertTriangle,
    color: "bg-red-600",
    isUnread: true,
  },
  {
    id: 4,
    title: "High Traffic Detected",
    category: "System Alert",
    content: "Platform experiencing 2x normal traffic levels",
    time: "2 hours ago",
    type: "system",
    icon: Bell,
    color: "bg-yellow-600",
    isUnread: false,
  },
  {
    id: 5,
    title: "Order Delivered",
    category: "Order Update",
    content: "Order ORD-1003 has been delivered to customer",
    time: "3 hours ago",
    type: "order",
    icon: ShoppingCart,
    color: "bg-blue-600",
    isUnread: false,
  },
  {
    id: 6,
    title: "Trade Completed",
    category: "Trade Update",
    content: "Trade TRD-5680 between Tom Harris and Lisa White completed",
    time: "5 hours ago",
    type: "trade",
    icon: Repeat,
    color: "bg-purple-600",
    isUnread: false,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">System Notifications</h1>
          <p className="text-zinc-500 mt-1">{unreadCount} unread notifications</p>
        </div>
        <button className="bg-[#155DFC] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`group relative p-4 bg-[#111111] border rounded-2xl transition-all duration-200 ${
              notif.isUnread 
                ? "border-blue-500/30 shadow-lg shadow-blue-500/5" 
                : "border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 ${notif.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                <notif.icon size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">{notif.title}</h3>
                    {notif.isUnread && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">{notif.time}</span>
                </div>
                <p className="text-xs text-zinc-500 font-medium mt-0.5">{notif.category}</p>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                  {notif.content}
                </p>
              </div>

              {/* Hover Actions */}
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-zinc-300">
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
