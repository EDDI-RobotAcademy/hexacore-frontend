const isDev = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDev
  ? "http://localhost:8000"
  : "https://hexacore-ai-server-production.up.railway.app";