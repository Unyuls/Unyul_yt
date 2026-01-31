"use client";

import { motion } from "motion/react";
import {
  Bell,
  Loader2,
  MessageCircle,
  Play,
  RefreshCw,
  Upload,
} from "lucide-react";

interface ActionButtonsProps {
  checkLoading: boolean;
  testLoading: boolean;
  onCheck: () => void;
  onTest: () => void;
}

export default function ActionButtons({
  checkLoading,
  testLoading,
  onCheck,
  onTest,
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
    >
      <button
        onClick={onCheck}
        disabled={checkLoading}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/20 to-red-700/20 backdrop-blur-xl border border-red-500/30 p-6 sm:p-8 text-left transition-all hover:scale-[1.02] hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
              {checkLoading ? (
                <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
              ) : (
                <RefreshCw className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Check YouTube
              </h3>
              <p className="text-white/50 text-sm">Cek video & stream baru</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Video Baru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              <span>Live Stream</span>
            </div>
          </div>
        </div>
      </button>

      <button
        onClick={onTest}
        disabled={testLoading}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-700/20 backdrop-blur-xl border border-indigo-500/30 p-6 sm:p-8 text-left transition-all hover:scale-[1.02] hover:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
              {testLoading ? (
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              ) : (
                <Bell className="w-6 h-6 text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Test Notification
              </h3>
              <p className="text-white/50 text-sm">Kirim test ke Discord</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span>Discord Embed</span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
