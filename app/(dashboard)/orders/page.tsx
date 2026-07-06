"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, RefreshCcw, DollarSign, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchOrders, refundOrder, OrderItem } from "@/app/store/slices/ordersSlice";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items: orders, loading } = useAppSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleRefund = (id: string) => {
    if (confirm(`Are you sure you want to refund order ${id}?`)) {
      alert(`Refund initiated for order ${id}.`);
      dispatch(refundOrder(id));
    }
  };

  const filteredOrders = orders.filter(
    (order: OrderItem) =>
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.item?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Orders & Purchases</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search orders by ID, buyer, seller, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-300 focus:outline-none focus:border-[#155DFC] transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#111111] border border-white/5 px-4 py-2 rounded-xl text-zinc-300 hover:bg-white/5 transition-colors">
          <Filter size={18} />
          <span className="font-medium">Filter</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-sm">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Buyer</th>
                <th className="px-6 py-4 font-medium">Seller</th>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Total Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-center">Delivery Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-zinc-500">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {order.buyer?.charAt(0) || "B"}
                      </div>
                      <span className="font-medium truncate max-w-[120px]">{order.buyer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-400 text-sm">{order.seller}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-200 text-sm font-medium">{order.item}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#10b981] text-lg">
                    {order.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        order.status === "Delivered"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : order.status === "Shipped"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : order.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-zinc-500 text-sm">{order.deliveryDate || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <button className="hover:text-white transition-colors" title="View Order">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleRefund(order.id)}
                        className="hover:text-blue-400 transition-colors"
                        title="Refund/Return"
                      >
                        <RefreshCcw size={18} />
                      </button>
                      <button className="hover:text-yellow-500 transition-colors" title="Payout">
                        <DollarSign size={18} />
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
  );
}
