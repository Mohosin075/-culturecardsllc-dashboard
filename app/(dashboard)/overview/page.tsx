"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Users, 
  ShoppingBag, 
  Radio, 
  Repeat, 
  DollarSign, 
  AlertTriangle 
} from "lucide-react";

const stats = [
  { name: "Total Users", value: "12,540", icon: Users, color: "bg-blue-600" },
  { name: "Active Sellers", value: "3,210", icon: ShoppingBag, color: "bg-green-600" },
  { name: "Live Streams Now", value: "28", icon: Radio, color: "bg-red-600" },
  { name: "Total Trades Today", value: "184", icon: Repeat, color: "bg-purple-600" },
  { name: "Total Revenue", value: "$24,580", icon: DollarSign, color: "bg-yellow-600" },
  { name: "Pending Disputes", value: "12", icon: AlertTriangle, color: "bg-orange-600" },
];

const revenueData = [
  { day: "Mon", revenue: 3200 },
  { day: "Tue", revenue: 4100 },
  { day: "Wed", revenue: 3800 },
  { day: "Thu", revenue: 4500 },
  { day: "Fri", revenue: 3900 },
  { day: "Sat", revenue: 5300 },
  { day: "Sun", revenue: 4800 },
];

const growthData = [
  { month: "Jan", users: 8500 },
  { month: "Feb", users: 9200 },
  { month: "Mar", users: 10100 },
  { month: "Apr", users: 12540 },
];

const ratioData = [
  { name: "Trades", value: 45 },
  { name: "Purchases", value: 55 },
];

const COLORS = ["#3b82f6", "#10b981"];

const recentOrders = [
  { id: "ORD-1234", item: "Nike Air Jordan 1", user: "John Doe", price: "$320", status: "Shipped", statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { id: "ORD-1235", item: "Rolex Submariner", user: "Jane Smith", price: "$8,500", status: "Pending", statusColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { id: "ORD-1236", item: "Pokemon Card Charizard", user: "Mike Johnson", price: "$450", status: "Delivered", statusColor: "text-green-500 bg-green-500/10 border-green-500/20" },
  { id: "ORD-1237", item: "Adidas Yeezy 350", user: "Sarah Wilson", price: "$280", status: "Shipped", statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
];

const recentTrades = [
  { id: "TRD-5678", items: "Sneakers ↔ Watch", users: "Alex Brown ↔ Chris Lee", status: "Pending", statusColor: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { id: "TRD-5679", items: "Cards ↔ Sneakers", users: "Emma Davis ↔ Ryan Clark", status: "Accepted", statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { id: "TRD-5680", items: "Watch ↔ Tech", users: "Tom Harris ↔ Lisa White", status: "Completed", statusColor: "text-green-500 bg-green-500/10 border-green-500/20" },
];

const flaggedActivities = [
  { user: "suspect_user_99", reason: "Multiple failed payment attempts", level: "High", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  { user: "trader_xyz", reason: "Unusual trade pattern detected", level: "Medium", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  { user: "seller_abc", reason: "Reported by 3 buyers", level: "High", color: "text-red-500 bg-red-500/10 border-red-500/20" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-semibold text-white">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Revenue (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{fill: '#3b82f6', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">User Growth</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trade Ratio Chart */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Trade vs Purchase Ratio</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-zinc-500">{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${order.statusColor}`}>{order.status}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{order.item}</p>
                    <p className="text-[10px] text-zinc-500">{order.user}</p>
                  </div>
                  <span className="text-sm font-bold text-[#10b981]">{order.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Recent Trades</h2>
          <div className="space-y-3">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-zinc-500">{trade.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${trade.statusColor}`}>{trade.status}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{trade.items}</p>
                  <p className="text-[10px] text-zinc-500">{trade.users}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Activities */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Flagged Activities</h2>
          <div className="space-y-3">
            {flaggedActivities.map((activity, i) => (
              <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-zinc-200">@{activity.user}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${activity.color}`}>{activity.level}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">{activity.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
