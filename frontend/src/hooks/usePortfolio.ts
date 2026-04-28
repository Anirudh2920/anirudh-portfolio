import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { Portfolio } from "@/types/portfolio";

export function usePortfolio() {
  return useQuery<Portfolio>({
    queryKey: ["portfolio"],
    queryFn: () => api.get<Portfolio>("/api/portfolio"),
    staleTime: 60_000,
  });
}
