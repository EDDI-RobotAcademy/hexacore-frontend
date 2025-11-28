import DashboardPage from "@/components/dashboard/DashboardPage";
import { fetchTopKeywords } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const keywords = await fetchTopKeywords(1000);
  return <DashboardPage keywords={keywords} />;
}

