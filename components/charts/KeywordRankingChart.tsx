"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { KeywordMention } from "@/types/stock";

type Props = {
  data?: KeywordMention[];
  loading?: boolean;
};

const COLORS = [
  "#f43f5e", "#fb923c", "#facc15", "#4ade80", "#22d3ee",
  "#818cf8", "#e879f9", "#f472b6", "#94a3b8", "#64748b"
];

export default function KeywordRankingChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-panel h-96 animate-pulse flex items-center justify-center text-white/40">
        키워드 랭킹을 불러오는 중...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="glass-panel h-96 flex items-center justify-center text-white/60">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  const chartData = data.slice(0, 5).map((item, idx) => ({
    name: item.name,
    mentions: item.mention_count,
    rank: idx + 1
  }));

  return (
    <div className="glass-panel p-5 h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold tracking-tight">🏆 Top 키워드 랭킹</h3>
        <span className="text-xs text-white/40">언급량 기준 상위 5개</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <XAxis type="number" stroke="#64748b" fontSize={11} />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            width={80}
            tickFormatter={(v) => v.length > 8 ? `${v.slice(0, 8)}..` : v}
          />
          <Tooltip
            contentStyle={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155" }}
            formatter={(value: number) => [`${value.toLocaleString()}회`, "언급량"]}
            labelFormatter={(label) => `키워드: ${label}`}
          />
          <Bar dataKey="mentions" radius={[0, 6, 6, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

