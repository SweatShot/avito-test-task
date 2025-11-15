import { useMemo } from "react";
import { Advertisement } from "../../../types/apiTypes";

export function useFilteredAds(
  ads: Advertisement[],
  search: string,
  statusFilter: string[],
  categoryFilter: string
) {
  return useMemo(() => {
    return ads.filter((ad) => {
      const matchStatus = statusFilter.length ? statusFilter.includes(ad.status) : true;
      const matchCategory = categoryFilter ? ad.category === categoryFilter : true;
      const matchSearch = search ? ad.title.toLowerCase().includes(search.toLowerCase()) : true;
      return matchStatus && matchCategory && matchSearch;
    });
  }, [ads, statusFilter, categoryFilter, search]);
}
