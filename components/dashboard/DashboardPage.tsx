"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopKeywords } from "@/lib/api";
import MetricCard from "../cards/MetricCard";
import KeywordRankingChart from "../charts/KeywordRankingChart";
import KeywordPieChart from "../charts/KeywordPieChart";
import KeywordWordCloud from "../charts/KeywordWordCloud";

export default function DashboardPage() {
  const keywordQuery = useQuery({
    queryKey: ["topKeywords"],
    queryFn: () => fetchTopKeywords(1000)
  });

  const keywordMetrics = useMemo(() => {
    if (!keywordQuery.data?.length) {
      return {
        totalMentions: 0,
        topKeyword: "--",
        topMentions: "--",
        uniqueKeywords: 0
      };
    }

    const totalMentions = keywordQuery.data.reduce(
      (sum, item) => sum + item.mention_count,
      0
    );
    const top = keywordQuery.data[0];

    return {
      totalMentions,
      topKeyword: top.name,
      topMentions: `${top.mention_count.toLocaleString()}회`,
      uniqueKeywords: keywordQuery.data.length
    };
  }, [keywordQuery.data]);

  return (
    <main className="px-6 py-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400/80">HexaCore</p>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          키워드 분석 대시보드
        </h1>
        <p className="text-white/50 text-sm">
          주식 게시글에서 추출된 키워드의 언급량과 트렌드를 분석합니다.
        </p>
      </header>

      <section className="grid-auto-fit">
        <MetricCard
          title="총 언급량"
          value={`${keywordMetrics.totalMentions.toLocaleString()}회`}
        />
        <MetricCard title="1위 키워드" value={keywordMetrics.topKeyword} />
        <MetricCard
          title="1위 언급 횟수"
          value={keywordMetrics.topMentions}
        />
        <MetricCard
          title="분석 키워드 수"
          value={`${keywordMetrics.uniqueKeywords}개`}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordRankingChart data={keywordQuery.data} loading={keywordQuery.isLoading} />
        <KeywordPieChart data={keywordQuery.data} loading={keywordQuery.isLoading} />
      </section>

      <section>
        <KeywordWordCloud data={keywordQuery.data} loading={keywordQuery.isLoading} />
      </section>
    </main>
  );
}

