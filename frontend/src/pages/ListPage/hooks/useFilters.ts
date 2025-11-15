import { useState } from "react";
import { GetAdsQuery } from "../../../types/apiTypes";

export function useFilters() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<GetAdsQuery["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<GetAdsQuery["sortOrder"]>("desc");

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
  };

  return {
    search, setSearch,
    statusFilter, toggleStatus,
    categoryFilter, setCategoryFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    resetFilters
  };
}
