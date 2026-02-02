"use client";

import { useEffect, useState, useRef } from "react";
import {
  Lock,
  Shield,
  AlertTriangle,
  Activity,
  Terminal,
  RefreshCw,
  XCircle,
  Search,
} from "lucide-react";
import * as motion from "motion/react-client";

interface SecurityLog {
  timestamp: number;
  type: "suspicious" | "blocked" | "warning";
  ip: string;
  reason: string;
  details?: any;
}

interface SecurityStats {
  total: number;
  suspicious: number;
  blocked: number;
  warning: number;
}

export default function SecurityMonitorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard State
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    total: 0,
    suspicious: 0,
    blocked: 0,
    warning: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("sec_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchSecurityLogs();
    const interval = setInterval(fetchSecurityLogs, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, filter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("sec_auth", "true");
      } else {
        setAuthError("ACCESS DENIED: Invalid Security Token");
        setTokenInput("");
      }
    } catch (err) {
      setAuthError("SYSTEM ERROR: Connection Failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchSecurityLogs = async () => {
    try {
      const url =
        filter === "all"
          ? "/api/security/monitor?limit=100"
          : `/api/security/monitor?limit=100&type=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setStats(data.stats);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const clearOldLogs = async () => {
    if (!confirm("EXECUTE PURGE COMMAND: Clear logs > 24h?")) return;
    try {
      await fetch("/api/security/monitor?hours=24", { method: "DELETE" });
      fetchSecurityLogs();
    } catch (e) {
      alert("PURGE FAILED");
    }
  };

  const formatTime = (ts: number) => {
    return (
      new Date(ts).toLocaleTimeString("id-ID", { hour12: false }) +
      "." +
      new Date(ts).getMilliseconds().toString().padStart(3, "0")
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="max-w-md w-full border border-green-800 bg-black/90 p-8 shadow-[0_0_20px_rgba(0,255,0,0.2)] relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-green-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 tracking-widest text-green-400">
            SECURE TERMINAL
          </h1>
          <p className="text-xs text-center text-green-700 mb-8">
            RESTRICTED ACCESS // DESA KARBIT ADMIN
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group bg-neutral-900 border border-neutral-700 flex items-center px-4 py-3 rounded-md transition-all focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
              <div className="flex items-center gap-2 mr-3 text-green-500 select-none">
                <Terminal className="w-5 h-5" />
              </div>

              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Access Token"
                className="flex-1 bg-transparent border-none outline-none text-green-100 placeholder-neutral-500 font-mono text-lg tracking-wider"
                autoFocus
                spellCheck={false}
              />
            </div>

            {authError && (
              <div className="text-red-500 text-sm font-bold border border-red-900 bg-red-900/10 p-2 flex items-center animate-shake">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-green-900/30 text-green-400 border border-green-600 py-3 hover:bg-green-500 hover:text-black transition-all font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isVerifying ? "AUTHENTICATING..." : "INITIATE SESSION >"}
            </button>
          </form>

          <div className="mt-6 text-[10px] text-green-800 text-center">
            SYSTEM ID: UNYUL-SEC-NODE-01 <br />
            IP LOGGING ENABLED
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-6 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900 via-black to-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-green-900/50 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-green-500 w-8 h-8" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              CYBER OVERWATCH
            </span>
          </h1>
          <p className="text-green-700 text-xs mt-1">
            STATUS:{" "}
            <span className="text-green-400 animate-pulse">
              ONLINE & MONITORING
            </span>{" "}
            | UPTIME: 99.9%
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="text-right hidden md:block">
            <div className="text-xs text-green-600">LAST SYNC</div>
            <div className="text-green-400 font-bold">
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("sec_auth");
            }}
            className="px-4 py-2 border border-red-800 text-red-500 hover:bg-red-900/20 rounded text-xs tracking-wider transition-all"
          >
            TERMINATE SESSION
          </button>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard
          label="TOTAL EVENTS"
          value={stats.total}
          icon={<Search className="w-5 h-5" />}
          color="border-blue-900 text-blue-400 bg-blue-900/10"
        />
        <StatCard
          label="THREATS BLOCKED"
          value={stats.blocked}
          icon={<XCircle className="w-5 h-5" />}
          color="border-red-900 text-red-500 bg-red-900/10 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
        />
        <StatCard
          label="SUSPICIOUS ACTIVITY"
          value={stats.suspicious}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="border-yellow-900 text-yellow-500 bg-yellow-900/10"
        />
        <StatCard
          label="SYSTEM WARNINGS"
          value={stats.warning}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="border-orange-900 text-orange-500 bg-orange-900/10"
        />
      </div>

      {/* MAIN CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 h-[calc(100vh-280px)]">
        {/* LOG FEED */}
        <div className="lg:col-span-3 border border-green-800 bg-black/80 flex flex-col shadow-[0_0_30px_rgba(0,20,0,0.5)] rounded-sm overflow-hidden backdrop-blur-sm">
          {/* Console Header */}
          <div className="bg-green-950/30 border-b border-green-900 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-500 tracking-wider">
                LIVE TRAFFIC STREAM
              </span>
            </div>

            <div className="flex gap-2">
              {["all", "blocked", "suspicious", "warning"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider border transition-all ${
                    filter === f
                      ? "bg-green-500 text-black border-green-500 font-bold"
                      : "bg-transparent text-green-700 border-green-900 hover:text-green-400"
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                onClick={clearOldLogs}
                className="px-3 py-1 text-[10px] uppercase tracking-wider border border-red-900 text-red-900 hover:bg-red-900 hover:text-white transition-all ml-4"
              >
                PURGE LOGS
              </button>
            </div>
          </div>

          {/* Console Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-1 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-green-900 opacity-50">
                <Shield className="w-20 h-20 mb-4 animate-pulse" />
                <p className="tracking-widest">NO THREATS DETECTED</p>
                <p className="text-xs mt-2">SYSTEM SECURE</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="group flex items-start hover:bg-green-900/10 p-1 border-l-2 border-transparent hover:border-green-500 transition-all"
                >
                  <span className="text-green-800 w-24 shrink-0 text-xs pt-0.5">
                    {formatTime(log.timestamp)}
                  </span>

                  <span
                    className={`w-24 shrink-0 text-xs font-bold px-2 py-0.5 rounded mr-3 text-center uppercase ${
                      log.type === "blocked"
                        ? "bg-red-900/30 text-red-500"
                        : log.type === "suspicious"
                          ? "bg-yellow-900/30 text-yellow-500"
                          : log.type === "warning"
                            ? "bg-orange-900/30 text-orange-500"
                            : "bg-blue-900/30 text-blue-400"
                    }`}
                  >
                    {log.type}
                  </span>

                  <span className="text-gray-400 w-32 shrink-0 font-bold">
                    {log.ip === "::1" ? "LOCALHOST" : log.ip}
                  </span>

                  <span className="text-green-400 flex-1 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:break-words">
                    {log.reason}
                  </span>

                  {log.details && (
                    <span className="hidden group-hover:inline-block text-xs text-gray-500 ml-2">
                      {JSON.stringify(log.details).slice(0, 50)}...
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="border border-green-800 bg-black/80 p-4 h-1/2 rounded-sm shadow-[0_0_20px_rgba(0,100,0,0.1)]">
            <h3 className="text-xs font-bold text-green-600 mb-4 tracking-widest border-b border-green-900 pb-2">
              SYSTEM INTEGRITY
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-green-500 mb-1">
                  <span>FIREWALL</span>
                  <span>ACTIVE</span>
                </div>
                <div className="h-1 bg-green-900/30 w-full">
                  <div className="h-full bg-green-500 w-[100%] shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-green-500 mb-1">
                  <span>RATE LIMITER</span>
                  <span>ACTIVE</span>
                </div>
                <div className="h-1 bg-green-900/30 w-full">
                  <div className="h-full bg-green-500 w-[94%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-green-500 mb-1">
                  <span>THREAT SCANNER</span>
                  <span>SCANNING</span>
                </div>
                <div className="h-1 bg-green-900/30 w-full">
                  <div className="h-full bg-green-500 w-[88%] animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3 bg-green-900/10 border border-green-900/30 rounded text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-xs text-green-400 font-bold">
                DESA KARBIT SECURE
              </div>
              <div className="text-[10px] text-green-800">
                ENCRYPTION LEVEL 5
              </div>
            </div>
          </div>

          <div className="border border-green-800 bg-black/80 p-4 h-1/2 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🌍</div>
              <div className="text-xs text-green-600 font-bold">
                GLOBAL MONITOR
              </div>
              <div className="text-[10px] text-green-800 mt-1">
                NO ACTIVE GEO THREATS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <div
      className={`p-4 border rounded-sm ${color} backdrop-blur-sm transition-all hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold tracking-widest opacity-70">
          {label}
        </span>
        {icon}
      </div>
      <div className="text-3xl font-bold font-mono tracking-tighter shadow-black drop-shadow-md">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
