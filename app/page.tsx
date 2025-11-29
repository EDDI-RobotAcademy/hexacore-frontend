import DashboardPage from "@/components/dashboard/DashboardPage";
import {
  fetchTopKeywords,
  fetchAllKeywords,
  fetchAnalyzedData,
  fetchHealthStatus
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all data in parallel
  const [keywords, allKeywords, articles, healthResult] = await Promise.all([
    fetchTopKeywords(1000),
    fetchAllKeywords().catch(() => []),
    fetchAnalyzedData(500).catch(() => []),
    fetchHealthStatus()
      .then((data) => ({ data, error: false }))
      .catch(() => ({ data: undefined, error: true }))
  ]);

  return (
    <DashboardPage
      keywords={keywords}
      allKeywords={allKeywords}
      articles={articles}
      health={healthResult.data}
      healthError={healthResult.error}
    />
  );
}

