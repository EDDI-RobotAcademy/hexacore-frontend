"use client";

import { useState } from "react";
import type { HealthStatus } from "@/types/stock";

type Props = {
  data?: HealthStatus;
  loading?: boolean;
  error?: boolean;
};

type StatusType = "ok" | "error" | "unknown";

function getStatusColor(status: string | undefined): StatusType {
  if (!status) return "unknown";
  if (status.toLowerCase() === "ok" || status.toLowerCase() === "healthy") return "ok";
  return "error";
}

function StatusDot({ status }: { status: StatusType }) {
  const colorClasses = {
    ok: "bg-emerald-400 shadow-emerald-400/50",
    error: "bg-rose-400 shadow-rose-400/50",
    unknown: "bg-amber-400 shadow-amber-400/50",
  };

  return (
    <span className={`relative flex h-2 w-2`}>
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClasses[status]}`}
      />
      <span className={`relative inline-flex rounded-full h-2 w-2 shadow-lg ${colorClasses[status]}`} />
    </span>
  );
}

export default function HealthIndicator({ data, loading, error }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const overallStatus: StatusType = error
    ? "error"
    : loading
    ? "unknown"
    : data?.status?.toLowerCase() === "healthy"
    ? "ok"
    : "error";

  const statusLabels = {
    ok: "정상",
    error: "오류",
    unknown: "확인 중",
  };

  const dbStatus = getStatusColor(data?.database);

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full
                   bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
                   transition-all duration-200 text-sm group`}
      >
        <StatusDot status={overallStatus} />
        <span className="text-white/60 group-hover:text-white/80 transition-colors">
          서버 {statusLabels[overallStatus]}
        </span>
        <svg
          className={`w-3 h-3 text-white/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div
          className="absolute top-full right-0 mt-2 w-64 z-50
                     bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 rounded-xl
                     shadow-2xl shadow-black/50 overflow-hidden
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <span className="text-sm font-medium text-white/80">서버 상태</span>
            </div>
          </div>

          {/* Status Items */}
          <div className="p-3 space-y-2">
            {/* Server Status */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
                <span className="text-sm text-white/70">API 서버</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={overallStatus} />
                <span className={`text-xs font-medium ${overallStatus === "ok" ? "text-emerald-400" : overallStatus === "error" ? "text-rose-400" : "text-amber-400"}`}>
                  {loading ? "연결 중..." : error ? "연결 실패" : data?.status || "-"}
                </span>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <span className="text-sm text-white/70">데이터베이스</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={loading ? "unknown" : dbStatus} />
                <span className={`text-xs font-medium ${dbStatus === "ok" ? "text-emerald-400" : dbStatus === "error" ? "text-rose-400" : "text-amber-400"}`}>
                  {loading ? "..." : data?.database || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01]">
            <p className="text-[10px] text-white/30 text-center">
              실시간 상태 모니터링
            </p>
          </div>
        </div>
      )}
    </div>
  );
}