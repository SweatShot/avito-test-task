import { useState } from "react";
import { useGetAdsQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";

import { useFilters } from "./hooks/useFilters";
import { useCategories } from "./hooks/useCategories";
import { useFilteredAds } from "./hooks/useFilteredAds";

import FilterPanel from "./components/FilterPanel";
import AdsGrid from "./components/AdsGrid";
import Pagination from "./components/Pagination";
import Loader from "../../components/Loader/Loader";

export default function ListPage() {
  const [page, setPage] = useState(1);

  const filters = useFilters();
  const queryParams = {
    page,
    limit: 10,
    search: filters.search || undefined,
    status: filters.statusFilter.length ? (filters.statusFilter as any) : undefined,
    categoryId: undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  const { data, isLoading, isError } = useGetAdsQuery(queryParams);
  const { data: allIds } = useGetAllIdsQuery();
  const ads = data?.ads ?? [];
  const allAdsIds = allIds ?? [];

  const categories = useCategories(ads);
  const filteredAds = useFilteredAds(ads, filters.search, filters.statusFilter, filters.categoryFilter);

  return (
    <div style={{ padding: 20 }}>
      <h1>Список объявлений</h1>

      <FilterPanel {...filters} categories={categories} />

      {isLoading && <Loader />}
      {isError && <p style={{ textAlign: "center" }}>Ошибка при загрузке объявлений.</p>}

      <AdsGrid ads={filteredAds} allIds={allAdsIds} />

      {data?.pagination && (
        <Pagination
          page={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          totalItems={data.pagination.totalItems}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </div>
  );
}
