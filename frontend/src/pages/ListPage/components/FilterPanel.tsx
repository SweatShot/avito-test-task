import { GetAdsQuery } from "../../../types/apiTypes"
import { Link } from "react-router-dom"
import "./FilterPanel.css"

interface FilterPanelProps {
  search: string
  setSearch: (val: string) => void
  statusFilter: string[]
  toggleStatus: (status: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  categories: string[]
  sortBy: GetAdsQuery["sortBy"]
  setSortBy: (val: GetAdsQuery["sortBy"]) => void
  sortOrder: GetAdsQuery["sortOrder"]
  setSortOrder: (val: GetAdsQuery["sortOrder"]) => void
  resetFilters: () => void
}

export default function FilterPanel({
  search,
  setSearch,
  statusFilter,
  toggleStatus,
  categoryFilter,
  setCategoryFilter,
  categories,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}: FilterPanelProps) {
  return (
    <div className="filter-panel">
      {/* Поиск */}
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="filter-input"
      />

      {/* Статус */}
      <span>Статус:</span>
      {["pending", "approved", "rejected", "draft"].map(s => (
        <label key={s} className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={statusFilter.includes(s)}
            onChange={() => toggleStatus(s)}
          />
          {s}
        </label>
      ))}

      {/* Категории */}
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">Все категории</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Сортировка */}
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value as GetAdsQuery["sortBy"])}
        className="filter-select"
      >
        <option value="createdAt">Дата создания</option>
        <option value="price">Цена</option>
        <option value="priority">Приоритет</option>
      </select>

      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value as GetAdsQuery["sortOrder"])}
        className="filter-select"
      >
        <option value="desc">По убыванию</option>
        <option value="asc">По возрастанию</option>
      </select>

      {/* Кнопки */}
      <button onClick={resetFilters} className="nav-btn">
        Сбросить
      </button>

      <Link to="/stats">
        <button className="nav-btn">Статистика модератора</button>
      </Link>
    </div>
  )
}
