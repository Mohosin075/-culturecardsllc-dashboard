"use client";

import React, { useEffect } from "react";
import { Check, X, MessageSquare, FileText, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import {
   fetchSellerVerifications,
   approveVerification,
   rejectVerification,
   SellerVerificationRequest
} from "@/app/store/slices/sellerVerificationSlice";
import { useAlert } from "@/app/context/AlertContext";
import ErrorState from "@/app/components/ErrorState";

export default function SellerVerificationPage() {
  const dispatch = useAppDispatch();
  const { items: requests, loading } = useAppSelector((state) => state.sellerVerification);
  const { showAlert, showConfirm } = useAlert();

  useEffect(() => {
    dispatch(fetchSellerVerifications());
  }, [dispatch]);

  const handleApprove = async (id: string) => {
    showConfirm(
      "Are you sure you want to approve this seller verification request?",
      () => {
        dispatch(approveVerification(id));
        showAlert("Verification request approved successfully.", "success");
      },
      "Approve Seller"
    );
  };

  const handleReject = async (id: string) => {
    showConfirm(
      "Are you sure you want to reject this seller verification request?",
      () => {
        dispatch(rejectVerification(id));
        showAlert("Verification request rejected.", "info");
      },
      "Reject Seller"
    );
  };

  const { error } = useAppSelector((state) => state.sellerVerification);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#155DFC]" size={40} />
      </div>
    );
  }
  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchSellerVerifications())} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-semibold text-white">Seller Verification Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request: SellerVerificationRequest) => (
          <div key={request.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{request.name}</h2>
                <p className="text-sm text-zinc-500">{request.email}</p>
              </div>
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-500/20">
                {request.status}
              </span>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Request ID:</span>
                <span className="text-zinc-300 font-mono">{request.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Category:</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                  {request.category}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Submitted:</span>
                <span className="text-zinc-300">{request.submitted}</span>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Submitted Documents:</p>
              <div className="space-y-2">
                {request.documents?.map((doc: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl text-zinc-300 hover:border-white/10 transition-colors cursor-pointer group">
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => handleApprove(request.id)}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/10"
              >
                <Check size={18} />
                Approve
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/10"
              >
                <X size={18} />
                Reject
              </button>
              <button
                onClick={() => showAlert(`Opening verification discussion channel with ${request.name} (${request.email})`, "info")}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
