"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import SpaceBackground from "../components/bg/background";
import {
  NotifyHeader,
  Toast,
  StatusCard,
  ActionButtons,
  ResultCard,
} from "../components/notification";
import type {
  StatusData,
  CheckResult,
  NotificationState,
} from "../components/notification";

function NotifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("key");
  const isAuthenticated = token === process.env.NEXT_PUBLIC_NOTIFY_TOKEN;

  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/youtube-notify?status=true");
      const data = await res.json();
      setStatus(data);
    } catch {
      showNotification("error", "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus();
    }
  }, [fetchStatus, isAuthenticated]);

  const handleCheck = async () => {
    setCheckLoading(true);
    try {
      const res = await fetch("/api/youtube-notify");
      const data: CheckResult = await res.json();
      setLastResult(data);

      if (data.success) {
        if (data.liveNotified || data.videoNotified) {
          showNotification(
            "success",
            `Notifikasi terkirim! ${data.liveNotified ? "🔴 Live Stream" : ""} ${data.videoNotified ? "🎬 Video Baru" : ""}`,
          );
        } else {
          showNotification("success", "Check selesai - Tidak ada konten baru");
        }
      } else {
        showNotification("error", data.error || "Check gagal");
      }

      await fetchStatus();
    } catch {
      showNotification("error", "Gagal melakukan check");
    } finally {
      setCheckLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      const res = await fetch("/api/youtube-notify?force=true");
      const data = await res.json();

      if (data.success) {
        showNotification("success", "Test notification terkirim ke Discord!");
      } else {
        showNotification(
          "error",
          data.error || "Gagal mengirim test notification",
        );
      }
    } catch {
      showNotification("error", "Gagal mengirim test notification");
    } finally {
      setTestLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
        <SpaceBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 text-center space-y-8 max-w-md w-full p-10 rounded-[2rem] bg-black/30 backdrop-blur-2xl border border-white/5 shadow-2xl"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            <div className="relative w-full h-full bg-gradient-to-br from-red-500/20 to-transparent rounded-full flex items-center justify-center border border-red-500/30 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Akses Ditolak
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              Anda tidak memiliki izin untuk melihat dashboard notifikasi ini.
              Silakan masukkan token akses yang valid untuk melanjutkan.
            </p>
          </div>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-white group"
          >
            <span>Kembali ke Beranda</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Toast notification={notification} />

      <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-4xl space-y-8"
        >
          <motion.div variants={item}>
            <NotifyHeader />
          </motion.div>

          <motion.div variants={item}>
            <StatusCard
              status={status}
              loading={loading}
              onRefresh={fetchStatus}
            />
          </motion.div>

          <motion.div variants={item}>
            <ActionButtons
              checkLoading={checkLoading}
              testLoading={testLoading}
              onCheck={handleCheck}
              onTest={handleTestNotification}
            />
          </motion.div>

          {lastResult && (
            <motion.div variants={item}>
              <ResultCard result={lastResult} />
            </motion.div>
          )}
        </motion.div>
      </main>
      <SpaceBackground />
    </>
  );
}

export default function NotifyPage() {
  return (
    <Suspense fallback={null}>
      <NotifyContent />
    </Suspense>
  );
}
