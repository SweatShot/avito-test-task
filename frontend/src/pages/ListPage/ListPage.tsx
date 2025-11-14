import { JSX, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdsQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";
import { GetAdsQuery, Advertisement } from "../../types/apiTypes";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { motion } from "framer-motion";

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
      if (data?.pagination && page < data.pagination.totalPages) setPage(p => p + 1);
    },
    prev: () => {
      if (page > 1) setPage(p => p - 1);
    },
    focusSearch: () => {
      const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Поиск"]');
      searchInput?.focus();
    }
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Список объявлений</h1>

      {/* Фильтры */}
      <div style={{ margin: "15px 0" }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <span style={{ marginRight: "10px" }}>Статус:</span>
        {["pending", "approved", "rejected", "draft"].map((s) => (
          <label key={s} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={statusFilter.includes(s)} onChange={() => toggleStatus(s)} /> {s}
          </label>
        ))}

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ marginRight: "10px", padding: "5px" }}>
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ marginRight: "10px", padding: "5px" }}>
          <option value="createdAt">Дата создания</option>
          <option value="price">Цена</option>
          <option value="priority">Приоритет</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} style={{ marginRight: "10px", padding: "5px" }}>
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </select>

        <button onClick={resetFilters} style={{ padding: "5px 10px" }}>Сбросить</button>

        <Link to="/stats" style={{ marginLeft: 12 }}>
          <button>Статистика модератора</button>
        </Link>
      </div>

      {isLoading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
      {isError && <p style={{ textAlign: "center" }}>Ошибка при загрузке объявлений.</p>}

      {/* Список карточек */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {filteredAds.map((ad) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/item/${ad.id}`}
              state={{ adsIds: allAdsIds }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{ border: "1px solid #ccc", borderRadius: 5, overflow: "hidden", position: "relative" }}>
                <img
                  src={ad.images[0] || "https://via.placeholder.com/200x150"}
                  alt={ad.title}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: ad.priority === "urgent" ? "red" : "green",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {ad.priority === "urgent" ? "Срочно" : "Обычный"}
                </div>

                <div style={{ padding: 10 }}>
                  <h3>{ad.title}</h3>
                  <p>Цена: {ad.price} ₽</p>
                  <p>Категория: {ad.category}</p>
                  <p>Дата создания: {new Date(ad.createdAt).toLocaleDateString()}</p>
                  <p>
                    Статус:{" "}
                    <strong>
                      {ad.status === "pending"
                        ? "На модерации"
                        : ad.status === "approved"
                        ? "Одобрено"
                        : ad.status === "rejected"
                        ? "Отклонено"
                        : "Черновик"}
                    </strong>
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Серверная пагинация */}
      {data?.pagination && (
        <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Назад</button>
          <span>
            Страница {data.pagination.currentPage} из {data.pagination.totalPages} (Всего: {data.pagination.totalItems})
          </span>
          <button disabled={page === data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Вперед</button>
        </div>
      )}
    </div>
  );
}
