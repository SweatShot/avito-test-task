import { useState } from "react"
import { useGetAdsQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi"

import { useFilters } from "./hooks/useFilters"
import { useCategories } from "./hooks/useCategories"
import { useFilteredAds } from "./hooks/useFilteredAds"
import { useAdsQueryParams } from "./hooks/useAdsQueryParams"

import FilterPanel from "./components/FilterPanel"
import AdsGrid from "./components/AdsGrid"
import Pagination from "./components/Pagination"
import Loader from "../../components/Loader/Loader"

export default function ListPage() {
  const [page, setPage] = useState(1)

  const filters = useFilters()
  const queryParams = useAdsQueryParams(filters, page)

  const { data, isLoading, isError } = useGetAdsQuery(queryParams)
  const { data: allIds } = useGetAllIdsQuery()
  const ads = data?.ads ?? []
  const allAdsIds = allIds ?? []

  const categories = useCategories(ads)
  const filteredAds = useFilteredAds(
    ads,
    filters.search,
    filters.statusFilter,
    filters.categoryFilter,
  )

  return (
    <div style={{ padding: 20 }}>
      <h1>Список объявлений</h1>

      <FilterPanel {...filters} categories={categories} />

      {isLoading && <Loader />}
      {isError && (
        <p style={{ textAlign: "center" }}>Ошибка при загрузке объявлений.</p>
      )}

      <AdsGrid ads={filteredAds} allIds={allAdsIds} />

      {data?.pagination && (
        <Pagination
          page={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          totalItems={data.pagination.totalItems}
          onPrev={() => setPage(p => Math.max(p - 1, 1))}
          onNext={() =>
            setPage(p => Math.min(p + 1, data.pagination.totalPages))
          }
          setPage={setPage} 
        />
      )}
    </div>
  )
}
