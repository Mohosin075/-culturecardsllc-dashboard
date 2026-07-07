"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, UserMinus, ShieldCheck, Star, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchUsers, updateUserStatus, deleteUser, type User } from "@/app/store/slices/usersSlice";
import { useAlert } from "@/app/context/AlertContext";
import ErrorState from "@/app/components/ErrorState";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { items: users, loading } = useAppSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    showConfirm(
      `Are you sure you want to ${nextStatus === "Suspended" ? "suspend" : "activate"} this user?`,
      () => {
        dispatch(updateUserStatus({ userId, status: nextStatus }));
        showAlert(`User status updated to ${nextStatus}.`, "success");
      },
      "Toggle User Status"
    );
  };

  const handleDeleteUser = async (userId: string) => {
    showConfirm(
      "Are you sure you want to delete this user account? All associated data will be deleted.",
      () => {
        dispatch(deleteUser(userId));
        showAlert("User deleted successfully.", "success");
      },
      "Delete User"
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { error } = useAppSelector((state) => state.users);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchUsers())} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Users Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, username, or email..."
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
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-sm">
                <th className="px-6 py-4 font-medium">User ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Transactions</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user: User) => (
                <tr key={user.userId} className="text-zinc-300 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm">{user.userId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold`}>
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <span className="font-medium text-lg">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{user.username}</td>
                  <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#155DFC]/10 text-[#155DFC] px-3 py-1 rounded-full text-xs font-medium border border-[#155DFC]/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{user.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{user.transactions}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="hover:text-white transition-colors"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.userId, user.status)}
                        className={`transition-colors ${user.status === "Active" ? "hover:text-red-500" : "hover:text-green-500"}`}
                        title={user.status === "Active" ? "Suspend User" : "Activate User"}
                      >
                        <UserMinus size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <ShieldCheck size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold`}>
                    {selectedUser.name ? selectedUser.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                    <p className="text-zinc-500 text-sm">{selectedUser.username}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedUser.status === "Active"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl">
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">User ID</span>
                  <span className="text-sm font-mono text-zinc-300 block mt-1">{selectedUser.userId}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Role</span>
                  <span className="text-sm font-medium text-blue-400 block mt-1">{selectedUser.role}</span>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-3">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm text-zinc-300 block mt-1">{selectedUser.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#155DFC]/5 border border-[#155DFC]/10 rounded-2xl text-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Transactions</span>
                  <span className="text-2xl font-bold text-white block mt-1">{selectedUser.transactions}</span>
                </div>
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl text-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider block">Rating</span>
                  <span className="text-2xl font-bold text-yellow-500 block mt-1">{selectedUser.rating} / 5.0</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
