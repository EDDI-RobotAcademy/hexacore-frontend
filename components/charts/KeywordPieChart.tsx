"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { KeywordMention } from "@/types/stock";

type Props = {
  data?: KeywordMention[];
  loading?: boolean;
};

const COLORS = ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#22d3ee", "#64748b"];

export default function KeywordPieChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-panel h-80 animate-pulse flex items-center justify-center text-white/40">
        점유율 차트를 불러오는 중...
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

  const top5 = data.slice(0, 5);
  const othersTotal = data.slice(5).reduce((sum, item) => sum + item.mention_count, 0);
  const totalMentions = data.reduce((sum, item) => sum + item.mention_count, 0);

  const chartData = [
    ...top5.map((item) => ({
      name: item.name,
      value: item.mention_count,
      percent: ((item.mention_count / totalMentions) * 100).toFixed(1)
    })),
    ...(othersTotal > 0
      ? [{ name: "기타", value: othersTotal, percent: ((othersTotal / totalMentions) * 100).toFixed(1) }]
      : [])
  ];

  return (
    <div className="glass-panel p-5 h-96">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold tracking-tight">📊 키워드 점유율</h3>
        <span className="text-xs text-white/40">Top 5 + 기타</span>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${percent}%`}
            labelLine={{ stroke: "#64748b" }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155" }}
            formatter={(value: number, name: string) => [`${value.toLocaleString()}회`, name]}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span className="text-white/80 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

