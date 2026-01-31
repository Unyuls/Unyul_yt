"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate, type CheckResult } from "./types";

interface ResultCardProps {
  result: CheckResult | null;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <div
            className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border p-6 ${
              result.success
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  result.success ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-2 ${
                    result.success ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {result.success ? "Check Berhasil" : "Check Gagal"}
                </h3>
                <div className="space-y-1 text-sm text-white/70">
                  {result.message && <p>{result.message}</p>}
                  {result.checkedAt && (
                    <p>Waktu: {formatDate(result.checkedAt)}</p>
                  )}
                  {result.liveNotified && (
                    <p className="text-red-400">
                      🔴 Live stream notification sent!
                    </p>
                  )}
                  {result.videoNotified && (
                    <p className="text-blue-400">
                      🎬 New video notification sent: {result.videoTitle}
                    </p>
                  )}
                  {result.error && (
                    <p className="text-red-400">Error: {result.error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
