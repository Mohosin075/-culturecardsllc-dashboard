"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface PromptState {
  isOpen: boolean;
  title: string;
  placeholder: string;
  defaultValue: string;
  onSubmit: (value: string) => void;
}

interface AlertContextProps {
  showAlert: (message: string, type?: ToastType) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string, onCancel?: () => void) => void;
  showPrompt: (title: string, placeholder: string, onSubmit: (value: string) => void, defaultValue?: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export default function AlertProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: "Confirm Action",
    message: "",
    onConfirm: () => {},
  });
  const [promptState, setPromptState] = useState<PromptState>({
    isOpen: false,
    title: "Input Required",
    placeholder: "",
    defaultValue: "",
    onSubmit: () => {},
  });
  const [inputValue, setInputValue] = useState("");

  const showAlert = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    title: string = "Are you sure?",
    onCancel?: () => void
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const showPrompt = (
    title: string,
    placeholder: string,
    onSubmit: (value: string) => void,
    defaultValue: string = ""
  ) => {
    setInputValue(defaultValue);
    setPromptState({
      isOpen: true,
      title,
      placeholder,
      defaultValue,
      onSubmit: (val) => {
        onSubmit(val);
        setPromptState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {/* Custom Toast System */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
        ))}
      </div>

      {/* Custom Confirm Dialog Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => confirmState.onCancel?.()}
          />
          <div className="relative w-full max-w-md bg-[#111111]/90 border border-white/10 rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#155DFC]/10 text-[#155DFC] rounded-2xl shrink-0">
                <Info size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{confirmState.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{confirmState.message}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  if (confirmState.onCancel) {
                    confirmState.onCancel();
                  } else {
                    setConfirmState((prev) => ({ ...prev, isOpen: false }));
                  }
                }}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-zinc-200 rounded-xl text-sm font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmState.onConfirm}
                className="px-5 py-2.5 bg-[#155DFC] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-[#155DFC]/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Prompt Input Dialog Modal */}
      {promptState.isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setPromptState((prev) => ({ ...prev, isOpen: false }))}
          />
          <div className="relative w-full max-w-md bg-[#111111]/90 border border-white/10 rounded-3xl shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">{promptState.title}</h3>
              <input
                type="text"
                placeholder={promptState.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-zinc-200 focus:outline-none focus:border-[#155DFC] transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    promptState.onSubmit(inputValue);
                  }
                }}
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPromptState((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-zinc-200 rounded-xl text-sm font-semibold transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => promptState.onSubmit(inputValue)}
                className="px-5 py-2.5 bg-[#155DFC] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-[#155DFC]/20"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-[#155DFC]" size={20} />,
  };

  const bgColors = {
    success: "bg-green-500/10 border-green-500/20",
    error: "bg-red-500/10 border-red-500/20",
    info: "bg-blue-500/10 border-[#155DFC]/20",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border ${bgColors[toast.type]} bg-[#111111]/90 shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-zinc-200">{toast.message}</div>
      <button onClick={() => onClose(toast.id)} className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}
