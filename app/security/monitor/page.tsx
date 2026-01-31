"use client";

import { useEffect, useState } from "react";

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
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    total: 0,
    suspicious: 0,
    blocked: 0,
    warning: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchSecurityLogs();
    // Auto-refresh setiap 10 detik
    const interval = setInterval(fetchSecurityLogs, 10000);
    return () => clearInterval(interval);
  }, [filter]);

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
      }
    } catch (error) {
      console.error("Failed to fetch security logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearOldLogs = async () => {
    if (!confirm("Clear logs older than 24 hours?")) return;

    try {
      const response = await fetch("/api/security/monitor?hours=24", {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        alert("Old logs cleared successfully");
        fetchSecurityLogs();
      }
    } catch (error) {
      console.error("Failed to clear logs:", error);
      alert("Failed to clear logs");
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blocked":
        return "bg-red-500";
      case "suspicious":
        return "bg-yellow-500";
      case "warning":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "blocked":
        return "🚫";
      case "suspicious":
        return "🤔";
      case "warning":
        return "⚠️";
      default:
        return "📝";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading security dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">🛡️ Security Monitor</h1>
            <p className="text-gray-400">
              Real-time security threat monitoring
            </p>
          </div>
          <button
            onClick={clearOldLogs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            🗑️ Clear Old Logs
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Total Events</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>

          <div className="bg-gray-900 border border-red-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">🚫 Blocked</div>
            <div className="text-3xl font-bold text-red-500">
              {stats.blocked}
            </div>
          </div>

          <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">🤔 Suspicious</div>
            <div className="text-3xl font-bold text-yellow-500">
              {stats.suspicious}
            </div>
          </div>

          <div className="bg-gray-900 border border-orange-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">⚠️ Warnings</div>
            <div className="text-3xl font-bold text-orange-500">
              {stats.warning}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {["all", "blocked", "suspicious", "warning"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Security Logs Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No security events logged yet. System is secure! ✅
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-850 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                            log.type,
                          )}`}
                        >
                          {getTypeEmoji(log.type)} {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{log.ip}</td>
                      <td className="px-6 py-4 text-sm">{log.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {log.details ? (
                          <details className="cursor-pointer">
                            <summary className="hover:text-white">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-4 text-center text-sm text-gray-500">
          🔄 Auto-refreshing every 10 seconds
        </div>
      </div>
    </div>
  );
}
