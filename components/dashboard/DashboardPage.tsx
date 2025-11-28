"use client";

import { useMemo } from "react";
import type { KeywordMention, Keyword, AnalyzedData, HealthStatus } from "@/types/stock";
import MetricCard from "../cards/MetricCard";
import KeywordRankingChart from "../charts/KeywordRankingChart";
import KeywordPieChart from "../charts/KeywordPieChart";
import KeywordWordCloud from "../charts/KeywordWordCloud";
import ArticlesPanel from "./ArticlesPanel";
import AllKeywordsGrid from "./AllKeywordsGrid";
import HealthIndicator from "./HealthIndicator";

type Props = {
  keywords: KeywordMention[];
  allKeywords?: Keyword[];
  articles?: AnalyzedData[];
  health?: HealthStatus;
  healthError?: boolean;
};

export default function DashboardPage({
  keywords,
  allKeywords,
  articles,
  health,
  healthError
}: Props) {
  const keywordMetrics = useMemo(() => {
    if (!keywords?.length) {
      return {
        totalMentions: 0,
        topKeyword: "--",
        topMentions: "--",
        uniqueKeywords: 0
      };
    }

    const totalMentions = keywords.reduce(
      (sum, item) => sum + item.mention_count,
      0
    );
    const top = keywords[0];

    return {
      totalMentions,
      topKeyword: top.name,
      topMentions: `${top.mention_count.toLocaleString()}회`,
      uniqueKeywords: keywords.length
    };
  }, [keywords]);

  const articleMetrics = useMemo(() => {
    return {
      totalArticles: articles?.length || 0,
      totalKeywordsInDb: allKeywords?.length || 0,
    };
  }, [articles, allKeywords]);

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400/80">HexaCore</p>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            AI 주식 분석 대시보드
          </h1>
          <p className="text-white/50 text-sm">
            주식 게시글에서 추출된 키워드와 AI 분석 결과를 확인합니다.
          </p>
        </div>
        <HealthIndicator data={health} loading={!health && !healthError} error={healthError} />
      </header>

      {/* Metrics Section */}
      <section className="grid-auto-fit">
        <MetricCard
          title="총 언급량"
          value={`${keywordMetrics.totalMentions.toLocaleString()}회`}
        />
        <MetricCard title="1위 키워드" value={keywordMetrics.topKeyword} />
        <MetricCard
          title="분석된 게시글"
          value={`${articleMetrics.totalArticles}개`}
        />
        <MetricCard
          title="등록된 키워드"
          value={`${articleMetrics.totalKeywordsInDb}개`}
        />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordRankingChart data={keywords} loading={false} />
        <KeywordPieChart data={keywords} loading={false} />
      </section>

      {/* Word Cloud */}
      <section>
        <KeywordWordCloud data={keywords} loading={false} />
      </section>

      {/* All Keywords Grid */}
      <section>
        <AllKeywordsGrid data={allKeywords} loading={!allKeywords} />
      </section>

      {/* Articles Section */}
      <section>
        <ArticlesPanel data={articles} loading={!articles} />
      </section>
    </main>
  );
}

