import React from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

const stats = [
  { name: "Total Revenue", value: "$124,580", icon: DollarSign, color: "bg-green-500" },
  { name: "Commission Earned", value: "$6,229", icon: TrendingUp, color: "bg-blue-500" },
  { name: "Pending Payouts", value: "$3,450", icon: Clock, color: "bg-yellow-500" },
  { name: "Completed Payouts", value: "$98,200", icon: CheckCircle, color: "bg-purple-500" },
];

const transactions = [
  {
    id: "TXN-7001",
    user: { name: "SneakerKing", color: "bg-indigo-500", initial: "S" },
    type: "Purchase",
    amount: "$320.00",
    commission: "$16.00",
    date: "2026-04-24",
    status: "Completed",
  },
  {
    id: "TXN-7002",
    user: { name: "WatchMaster", color: "bg-blue-500", initial: "W" },
    type: "Purchase",
    amount: "$8,500.00",
    commission: "$425.00",
    date: "2026-04-24",
    status: "Completed",
  },
  {
    id: "TXN-7003",
    user: { name: "CardCollector", color: "bg-purple-600", initial: "C" },
    type: "Trade",
    amount: "$450.00",
    commission: "$11.25",
    date: "2026-04-23",
    status: "Completed",
  },
  {
    id: "TXN-7004",
    user: { name: "SneakerHub", color: "bg-blue-600", initial: "S" },
    type: "Boost",
    amount: "$25.00",
    commission: "$25.00",
    date: "2026-04-24",
    status: "Completed",
  },
  {
    id: "TXN-7005",
    user: { name: "TechDeals", color: "bg-blue-600", initial: "T" },
    type: "Purchase",
    amount: "$3,200.00",
    commission: "$160.00",
    date: "2026-04-23",
    status: "Pending",
  },
  {
    id: "TXN-7006",
    user: { name: "LuxuryTime", color: "bg-blue-700", initial: "L" },
    type: "Purchase",
    amount: "$45,000.00",
    commission: "$2,250.00",
    date: "2026-04-22",
    status: "Completed",
  },
];

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Payments & Revenue</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Transactions Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold px-1">Recent Transactions</h2>
        <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Commission</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-500">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${tx.user.color} flex items-center justify-center text-white text-xs font-bold`}>
                          {tx.user.initial}
                        </div>
                        <span className="font-medium">{tx.user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          tx.type === 'Purchase' 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                            : tx.type === 'Trade'
                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#10b981] text-lg">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-medium">
                      {tx.commission}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          tx.status === "Completed"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}
                      >
                        {tx.status}
                      </span>
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
