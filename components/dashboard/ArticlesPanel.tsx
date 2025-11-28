"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import type { AnalyzedData } from "@/types/stock";

dayjs.extend(relativeTime);
dayjs.locale("ko");

type Props = {
  data?: AnalyzedData[];
  loading?: boolean;
};

const KEYWORD_COLORS = [
  "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-300",
  "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300",
  "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-300",
  "from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-300",
];

export default function ArticlesPanel({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            분석된 게시글
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-white/5 rounded-xl" />
            </div>
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
            분석된 게시글
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-white/40">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">분석된 게시글이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          분석된 게시글
        </h3>
        <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
          {data.length}개의 게시글
        </span>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {data.map((article, idx) => (
          <article
            key={article.id}
            className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02]
                       border border-white/10 rounded-xl p-5
                       hover:from-white/[0.1] hover:to-white/[0.04] hover:border-white/20
                       transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5"
          >
            {/* Article Number Badge */}
            <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-600
                            rounded-lg flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-500/30">
              {idx + 1}
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-semibold text-white/90 leading-snug group-hover:text-white transition-colors line-clamp-2">
                {article.title}
              </h4>
              {article.published_at && (
                <time className="text-xs text-white/40 whitespace-nowrap flex-shrink-0">
                  {dayjs(article.published_at).fromNow()}
                </time>
              )}
            </div>

            {/* Content Preview */}
            <p className="text-sm text-white/50 leading-relaxed line-clamp-3 mb-4">
              {article.content}
            </p>

            {/* Keywords */}
            {article.keywords?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.keywords.slice(0, 6).map((keyword, keyIdx) => (
                  <span
                    key={keyword}
                    className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r border
                               transition-transform hover:scale-105
                               ${KEYWORD_COLORS[keyIdx % KEYWORD_COLORS.length]}`}
                  >
                    {keyword}
                  </span>
                ))}
                {article.keywords.length > 6 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                    +{article.keywords.length - 6}
                  </span>
                )}
              </div>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/0 via-brand-500/5 to-accent/0
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </article>
        ))}
      </div>
    </div>
  );
}