"use client";

import { useState, useMemo } from "react";
import type { Keyword } from "@/types/stock";

type Props = {
  data?: Keyword[];
  loading?: boolean;
};

const GRADIENT_CLASSES = [
  "from-rose-500 to-orange-500",
  "from-orange-500 to-amber-500",
  "from-amber-500 to-yellow-500",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
  "from-cyan-500 to-blue-500",
  "from-blue-500 to-indigo-500",
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-pink-500 to-rose-500",
];

export default function AllKeywordsGrid({ data, loading }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    return data.filter((k) =>
      k.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            전체 키워드
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-white/5 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            전체 키워드
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-white/40">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-sm">등록된 키워드가 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          전체 키워드
        </h3>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm
                         placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07]
                         transition-all duration-200"
            />
          </div>
          <span className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full whitespace-nowrap">
            {filteredData.length} / {data.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredData.map((keyword, idx) => {
          const gradientClass = GRADIENT_CLASSES[idx % GRADIENT_CLASSES.length];
          const isHovered = hoveredId === keyword.id;

          return (
            <div
              key={keyword.id}
              onMouseEnter={() => setHoveredId(keyword.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative group cursor-default
                          bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                          border border-white/10 rounded-xl px-4 py-3
                          hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.04]
                          transition-all duration-300
                          ${isHovered ? "scale-105 shadow-lg" : ""}`}
            >
              {/* Gradient Accent Line */}
              <div
                className={`absolute top-0 left-3 right-3 h-0.5 bg-gradient-to-r ${gradientClass}
                           rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Keyword Name */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientClass}
                             opacity-60 group-hover:opacity-100 transition-opacity`}
                />
                <span className="text-sm text-white/80 group-hover:text-white truncate transition-colors">
                  {keyword.name}
                </span>
              </div>

              {/* ID Badge (shown on hover) */}
              <div
                className={`absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br ${gradientClass}
                           rounded-md flex items-center justify-center text-[10px] font-bold
                           opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100
                           shadow-lg`}
              >
                {keyword.id}
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && searchTerm && (
        <div className="flex flex-col items-center justify-center py-12 text-white/40">
          <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">&quot;{searchTerm}&quot; 검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}