"use client";

import { motion } from "motion/react";
import { Youtube } from "lucide-react";

export default function NotifyHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
          YouTube Notifier
        </h1>
      </div>
      <p className="text-white/60 text-lg">
        Kontrol notifikasi YouTube ke Discord
      </p>
    </motion.div>
  );
}
