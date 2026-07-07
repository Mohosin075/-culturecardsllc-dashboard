"use client";

import React, { useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchReports } from "@/app/store/slices/reportsSlice";
import ErrorState from "@/app/components/ErrorState";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "total sales": TrendingUp,
  "active users": Users,
  "avg transaction": DollarSign,
};

const getIconByName = (name: string) => {
  return iconMap[name.toLowerCase()] || TrendingUp;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const { error } = useAppSelector((state) => state.reports);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error || !data) {
    return <ErrorState message={error || undefined} onRetry={() => dispatch(fetchReports())} />;
  }

  // Support fallback arrays from original static component
  const stats = data?.stats || [
    { 
      name: "Total Sales", 
      value: "$180,000", 
      growth: "+12.5% from last month", 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      name: "Active Users", 
      value: "12,540", 
      growth: "+19.4% from last month", 
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    { 
      name: "Avg Transaction", 
      value: "$478", 
      growth: "+5.2% from last month", 
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
  ];

  const categoryData = data?.categoryData || [
    { name: "Sneakers", sales: 45000 },
    { name: "Watches", sales: 80000 },
    { name: "Cards", sales: 23000 },
    { name: "Tech", sales: 34000 },
  ];

  const sellerData = data?.sellerData || [
    { name: "SneakerKing", sales: 12000 },
    { name: "WatchMaster", sales: 18500 },
    { name: "CardCollector", sales: 9000 },
    { name: "TechDeals", sales: 11500 },
    { name: "LuxuryTime", sales: 24000 },
  ];

  const tradedItemsData = data?.tradedItemsData || [
    { name: "Sneakers", value: 38 },
    { name: "Cards", value: 27 },
    { name: "Watches", value: 15 },
    { name: "Tech", value: 21 },
  ];

  const engagementData = data?.engagementData || [
    { name: "Jan", active: 8500, new: 3000 },
    { name: "Feb", active: 9200, new: 3500 },
    { name: "Mar", active: 10500, new: 4200 },
    { name: "Apr", active: 12540, new: 5100 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat: any) => {
          const Icon = getIconByName(stat.name);
          return (
            <div key={stat.name} className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${stat.bg || 'bg-blue-500/10'} ${stat.color || 'text-blue-500'} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <p className="text-green-500 text-xs mt-1 font-medium">{stat.growth}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Sales by Category</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Top Sellers</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sellerData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Traded Items */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Most Traded Items</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tradedItemsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tradedItemsData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">User Engagement</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #27272a', borderRadius: '8px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="active" name="Active Users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" name="New Users" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
