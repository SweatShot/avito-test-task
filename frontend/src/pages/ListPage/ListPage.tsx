import { JSX, useMemo, useState } from "react";
import { useGetAdsQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";
import { GetAdsQuery, Advertisement } from "../../types/apiTypes";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import AdCard from "./components/AdsCard";
import Loader from "../../components/Loader/Loader";
import FilterPanel from "./components/FilterPanel";
import Pagination from "./components/Pagination";

export default function ListPage(): JSX.Element {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<GetAdsQuery["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<GetAdsQuery["sortOrder"]>("desc");
  const [page, setPage] = useState(1);

  const queryParams: GetAdsQuery = {
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter.length ? (statusFilter as any) : undefined,
    categoryId: undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useGetAdsQuery(queryParams);
  const { data: allIds } = useGetAllIdsQuery();
  const ads = data?.ads ?? [];
  const allAdsIds = allIds ?? [];

  const categories: string[] = useMemo(() => {
    return Array.from(new Set(ads.map((ad) => ad.category))).filter(Boolean);
  }, [ads]);

  const filteredAds: Advertisement[] = useMemo(() => {
    return ads.filter((ad) => {
      const matchStatus = statusFilter.length ? statusFilter.includes(ad.status) : true;
      const matchCategory = categoryFilter ? ad.category === categoryFilter : true;
      const matchSearch = search ? ad.title.toLowerCase().includes(search.toLowerCase()) : true;
      return matchStatus && matchCategory && matchSearch;
    });
  }, [ads, statusFilter, categoryFilter, search]);

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter([]);
    setCategoryFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  useKeyboardShortcuts({
    approve: () => {},
    reject: () => {},
    next: () => {
      if (data?.pagination && page < data.pagination.totalPages) setPage((p) => p + 1);
    },
    prev: () => {
      if (page > 1) setPage((p) => p - 1);
    },
    focusSearch: () => {
      const searchInput = document.querySelector<HTMLInputElement>(
        'input[placeholder*="Поиск"]'
      );
      searchInput?.focus();
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Список объявлений</h1>

      <FilterPanel
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        toggleStatus={toggleStatus}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />

      {isLoading && <Loader />}
      {isError && <p style={{ textAlign: "center" }}>Ошибка при загрузке объявлений.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 15,
        }}
      >
        {filteredAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} allIds={allAdsIds} />
        ))}
      </div>

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
