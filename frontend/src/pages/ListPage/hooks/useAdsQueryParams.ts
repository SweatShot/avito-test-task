import { useFilters } from "./useFilters";


export function useAdsQueryParams(filters: ReturnType<typeof useFilters>, page: number) {
  return {
    page,
    limit: 10,
    search: filters.search || undefined,
    status: filters.statusFilter.length ? (filters.statusFilter as any) : undefined,
    categoryId: undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}