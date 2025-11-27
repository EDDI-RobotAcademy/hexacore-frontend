"use client";

import { useMemo, useState } from "react";
import type { KeywordMention } from "@/types/stock";

type Props = {
  data?: KeywordMention[];
  loading?: boolean;
};

// 네온 색상 팔레트
const NEON_COLORS = [
  { color: "#ff6b6b", glow: "rgba(255,107,107,0.6)" },
  { color: "#ffd93d", glow: "rgba(255,217,61,0.5)" },
  { color: "#6bcb77", glow: "rgba(107,203,119,0.5)" },
  { color: "#4d96ff", glow: "rgba(77,150,255,0.5)" },
  { color: "#9b59b6", glow: "rgba(155,89,182,0.5)" },
  { color: "#00d2d3", glow: "rgba(0,210,211,0.5)" },
  { color: "#ff9ff3", glow: "rgba(255,159,243,0.5)" },
  { color: "#54a0ff", glow: "rgba(84,160,255,0.5)" },
  { color: "#5f27cd", glow: "rgba(95,39,205,0.5)" },
  { color: "#01a3a4", glow: "rgba(1,163,164,0.5)" },
];

export default function KeywordWordCloud({ data, loading }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const words = useMemo(() => {
    if (!data?.length) return [];

    const maxCount = Math.max(...data.map((d) => d.mention_count));
    const minCount = Math.min(...data.map((d) => d.mention_count));
    const range = maxCount - minCount || 1;

    // 동일 언급량에 동일 순위 부여 (dense rank)
    const sortedCounts = [...new Set(data.map((d) => d.mention_count))].sort((a, b) => b - a);
    const countToRank = new Map(sortedCounts.map((count, idx) => [count, idx]));

    // 셔플하여 랜덤 배치
    const shuffled = [...data.slice(0, 30)].sort(() => Math.random() - 0.5);

    return shuffled.map((item, idx) => {
      const normalized = (item.mention_count - minCount) / range;
      const denseRank = countToRank.get(item.mention_count) ?? 0;
      const colorSet = NEON_COLORS[idx % NEON_COLORS.length];

      return {
        text: item.name,
        count: item.mention_count,
        rank: denseRank + 1,
        fontSize: 14 + normalized * 28, // 14px ~ 42px
        color: colorSet.color,
        glow: colorSet.glow,
        opacity: 0.7 + normalized * 0.3,
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="glass-panel h-80 animate-pulse flex items-center justify-center text-white/40">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
          <span className="text-sm">워드 클라우드를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="glass-panel h-80 flex items-center justify-center text-white/60">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 h-80 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">
            ☁️ 키워드 클라우드
          </h3>
          <span className="text-xs text-white/40">크기 = 언급량</span>
        </div>

        <div className="flex-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 content-center overflow-hidden">
          {words.map((word, idx) => (
            <span
              key={idx}
              className="cursor-pointer transition-all duration-200 ease-out hover:scale-110"
              style={{
                fontSize: `${word.fontSize}px`,
                fontWeight: word.fontSize > 28 ? 700 : 500,
                color: word.color,
                opacity: hoveredIdx === null || hoveredIdx === idx ? word.opacity : 0.3,
                textShadow: hoveredIdx === idx 
                  ? `0 0 20px ${word.glow}, 0 0 40px ${word.glow}` 
                  : `0 0 8px ${word.glow}`,
                transform: hoveredIdx === idx ? "scale(1.15)" : "scale(1)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              title={`${word.rank}위 · ${word.count.toLocaleString()}회`}
            >
              {word.text}
            </span>
          ))}
        </div>

        {/* 호버 시 하단 정보 표시 */}
        <div className="h-8 flex items-center justify-center">
          {hoveredIdx !== null && words[hoveredIdx] && (
            <div className="text-sm text-white/70 animate-fade-in">
              <span className="font-semibold" style={{ color: words[hoveredIdx].color }}>
                {words[hoveredIdx].text}
              </span>
              <span className="mx-2 text-white/30">|</span>
              <span>{words[hoveredIdx].rank}위</span>
              <span className="mx-2 text-white/30">|</span>
              <span>{words[hoveredIdx].count.toLocaleString()}회 언급</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
