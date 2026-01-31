"use client";

import { motion } from "motion/react";
import { Clock, Loader2, Play, Radio, RefreshCw, Video } from "lucide-react";
import { formatDate, type StatusData } from "./types";

interface StatusCardProps {
  status: StatusData | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function StatusCard({
  status,
  loading,
  onRefresh,
}: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Status Sistem
            </h2>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 text-white ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {status ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                  <Radio className="w-4 h-4" />
                  Status Bot
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status.success
                        ? "bg-emerald-400 animate-pulse"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="text-white font-medium">
                    {status.success ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  Last Check
                </div>
                <span className="text-white font-medium">
                  {status.lastChecked?.lastCheckedAt
                    ? formatDate(status.lastChecked.lastCheckedAt)
                    : "Never"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                  <Video className="w-4 h-4" />
                  Last Video ID
                </div>
                <span className="text-white/80 font-mono text-sm">
                  {status.lastChecked?.lastVideoId || "N/A"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                  <Play className="w-4 h-4" />
                  Live Status
                </div>
                <span
                  className={`font-medium ${
                    status.lastChecked?.lastLiveStatus === "live"
                      ? "text-red-400"
                      : status.lastChecked?.lastLiveStatus === "upcoming"
                        ? "text-orange-400"
                        : "text-white/80"
                  }`}
                >
                  {status.lastChecked?.lastLiveStatus === "live"
                    ? "🔴 LIVE"
                    : status.lastChecked?.lastLiveStatus === "upcoming"
                      ? "📅 Upcoming"
                      : "Tidak ada"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
