import { useSearchParams } from "react-router-dom";
import { GetAdsQuery } from "../../../types/apiTypes";

interface Props {
  filters: {
    search: string;
    statusFilter: string[];
    categoryFilter: string;
    sortBy: GetAdsQuery["sortBy"];
    sortOrder: GetAdsQuery["sortOrder"];
    resetFilters: () => void;
    setSearch: (v: string) => void;
    toggleStatus: (v: string) => void;
    setCategoryFilter: (v: string) => void;
    setSortBy: (v: GetAdsQuery["sortBy"]) => void;
    setSortOrder: (v: GetAdsQuery["sortOrder"]) => void;
  };
}

export default function AdvancedFiltersPanel({ filters }: Props) {
  const [params, setParams] = useSearchParams();

  const syncToUrl = () => {
    const p: any = {};

    if (filters.search) p.search = filters.search;
    if (filters.categoryFilter) p.category = filters.categoryFilter;
    if (filters.statusFilter.length)
      p.status = filters.statusFilter.join(",");
    if (filters.sortBy) p.sortBy = filters.sortBy;
    if (filters.sortOrder) p.sortOrder = filters.sortOrder;

    setParams(p);
  };

  const loadFromUrl = () => {
    const s = params.get("search") ?? "";
    const cat = params.get("category") ?? "";
    const status = params.get("status")?.split(",") ?? [];
    const sortBy = (params.get("sortBy") as GetAdsQuery["sortBy"]) ?? "createdAt";
    const sortOrder = (params.get("sortOrder") as GetAdsQuery["sortOrder"]) ?? "desc";

    filters.setSearch(s);
    filters.setCategoryFilter(cat);
    filters.resetFilters();
    status.forEach(filters.toggleStatus);
    filters.setSortBy(sortBy);
    filters.setSortOrder(sortOrder);
  };

  const savePreset = () => {
    const presets = JSON.parse(localStorage.getItem("filters-presets") || "{}");

    const name = prompt("Название набора фильтров:");
    if (!name) return;

    presets[name] = {
      search: filters.search,
      statusFilter: filters.statusFilter,
      categoryFilter: filters.categoryFilter,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    localStorage.setItem("filters-presets", JSON.stringify(presets));
    alert("Сохранено!");
  };

  const loadPreset = () => {
    const presets = JSON.parse(localStorage.getItem("filters-presets") || "{}");
    const names = Object.keys(presets);

    if (!names.length) return alert("Нет сохранённых наборов фильтров");

    const name = prompt("Какой набор загрузить?\n" + names.join("\n"));
    if (!name || !presets[name]) return;

    const p = presets[name];

    filters.setSearch(p.search);
    filters.setCategoryFilter(p.categoryFilter);
    filters.resetFilters();
    p.statusFilter.forEach(filters.toggleStatus);
    filters.setSortBy(p.sortBy);
    filters.setSortOrder(p.sortOrder);
  };

  return (
    <div style={{ margin: "10px 0", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
      <b style={{ display: "block", marginBottom: 6 }}>Продвинутые фильтры</b>

      <button onClick={syncToUrl} className="nav-btn">Сохранить в URL</button>
      <button onClick={loadFromUrl} className="nav-btn">Загрузить из URL</button>

      <button onClick={savePreset} className="nav-btn">Сохранить набор</button>
      <button onClick={loadPreset} className="nav-btn">Загрузить набор</button>

      <button
        className="nav-btn"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        Скопировать ссылку
      </button>
    </div>
  );
}
