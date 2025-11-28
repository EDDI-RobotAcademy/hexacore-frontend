import {API_BASE_URL} from "./env";
import type { KeywordMention, Keyword, AnalyzedData, HealthStatus } from "@/types/stock";

const API_BASE = API_BASE_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    next: { revalidate: 30 }
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패 (${response.status})`);
  }

  return response.json();
}

export async function fetchTopKeywords(limit: number = 20): Promise<KeywordMention[]> {
  return request(`/keywords/top?limit=${limit}`);
}

export async function fetchAllKeywords(): Promise<Keyword[]> {
  return request(`/keywords/`);
}

export async function fetchAnalyzedData(limit: number = 20): Promise<AnalyzedData[]> {
  return request(`/data/?limit=${limit}`);
}

export async function fetchHealthStatus(): Promise<HealthStatus> {
  return request(`/health`);
}

