"use client";

import React, { useEffect } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchPayments, type Transaction } from "@/app/store/slices/paymentsSlice";
import ErrorState from "@/app/components/ErrorState";

const formatCurrency = (val: string | number) => {
  if (typeof val === "string") {
    if (val.startsWith("$")) return val;
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return val;
    val = parsed;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function PaymentsPage() {
  const dispatch = useAppDispatch();
  const { items: transactions, summary, loading } = useAppSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const stats = [
    { name: "Total Revenue", value: formatCurrency(summary?.totalRevenue ?? 0), icon: DollarSign, color: "bg-green-500" },
    { name: "Commission Earned", value: formatCurrency(summary?.commissionEarned ?? 0), icon: TrendingUp, color: "bg-blue-500" },
    { name: "Pending Payouts", value: formatCurrency(summary?.pendingPayouts ?? 0), icon: Clock, color: "bg-yellow-500" },
    { name: "Completed Payouts", value: formatCurrency(summary?.completedPayouts ?? 0), icon: CheckCircle, color: "bg-purple-500" },
  ];

  const { error } = useAppSelector((state) => state.payments);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchPayments())} />;
  }

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
                  <th className="px-6 py-4 font-medium">Gateway</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx: Transaction) => (
                  <tr key={tx.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-500">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {tx.user?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium">{tx.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          tx.type === 'Purchase' || tx.type === 'Escrow Charge'
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
                      {typeof tx.amount === "number" ? formatCurrency(tx.amount) : tx.amount}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-medium">
                      {tx.gateway || "Stripe"}
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
