"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import type { NotificationState } from "./types";

interface ToastProps {
  notification: NotificationState | null;
}

export default function Toast({ notification }: ToastProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-6 left-1/2 z-50"
        >
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              notification.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : "bg-red-500/20 border-red-500/50 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
