"use client";

import React, { useEffect } from "react";
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
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchOverview } from "@/app/store/slices/overviewSlice";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "total users": Users,
  "active sellers": ShoppingBag,
  "live streams now": Radio,
  "total trades today": Repeat,
  "total revenue": DollarSign,
  "pending disputes": AlertTriangle,
};

const getIconByName = (name: string) => {
  return iconMap[name.toLowerCase()] || Users;
};

const COLORS = ["#3b82f6", "#10b981"];

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.overview);

  useEffect(() => {
    dispatch(fetchOverview());
  }, [dispatch]);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }

  const {
    stats = [],
    revenueData = [],
    growthData = [],
    ratioData = [],
    recentOrders = [],
    recentTrades = [],
    flaggedActivities = [],
  } = data || {};

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-semibold text-white">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat: any) => {
          const Icon = getIconByName(stat.name);
          return (
            <div key={stat.name} className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
              <div className={`w-10 h-10 ${stat.color || 'bg-blue-600'} rounded-lg flex items-center justify-center text-white`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
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
                  {ratioData.map((entry: any, index: number) => (
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
            {recentOrders.map((order: any) => (
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
            {recentTrades.map((trade: any) => (
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
            {flaggedActivities.map((activity: any, i: number) => (
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
