import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAdByIdQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";
import Loader from "../../components/Loader/Loader";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { reasons, ReasonType, useModerationActions } from "./hooks/useModerationActions";
import { useItemNavigation } from "./hooks/useItemNavigation";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const adId = Number(id);

  // Модалки и выбор причины
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [reason, setReason] = useState<ReasonType>("Запрещенный товар");
  const [comment, setComment] = useState("");

  // Получаем все ID, чтобы передать хук навигации
  const { data: allIds } = useGetAllIdsQuery();
  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId);

  // Хуки логики модерации
  const { handleApprove, handleReject, handleRequestChanges } = useModerationActions(
    adId,
    reason,
    comment,
    () => {
      setShowRejectModal(false);
      setShowChangesModal(false);
    }
  );

  // Хук навигации
  const { goPrev, goNext, goList, currentIndex } = useItemNavigation(adId, allIds);

  // Горячие клавиши
  useKeyboardShortcuts({
    approve: handleApprove,
    reject: () => setShowRejectModal(true),
    next: goNext,
    prev: goPrev,
    focusSearch: goList,
  });

  if (isLoading) return <Loader />;
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* Навигация */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button onClick={goList}>Назад к списку</button>
        <button onClick={goPrev} disabled={currentIndex <= 0}>← Предыдущее</button>
        <button onClick={goNext} disabled={currentIndex >= (allIds?.length ?? 0) - 1}>Следующее →</button>
      </div>

      <h1>{ad.title}</h1>

      {/* Галерея */}
      <div style={{ display: "flex", gap: 10, margin: "15px 0" }}>
        {ad.images.slice(0, 3).map((img, idx) => (
          <img
            key={idx}
            src={img || "https://via.placeholder.com/200x150"}
            alt={`${ad.title} ${idx}`}
            style={{ width: 200, height: 150, objectFit: "cover" }}
          />
        ))}
      </div>

      <p>{ad.description}</p>

      {/* Характеристики */}
      <h3>Характеристики</h3>
      <table border={1} cellPadding={5} style={{ marginBottom: 15 }}>
        <tbody>
          {Object.entries(ad.characteristics).map(([key, value]) => (
            <tr key={key}>
              <td><strong>{key}</strong></td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Продавец */}
      <h3>Информация о продавце</h3>
      <p>Имя: {ad.seller.name}</p>
      <p>Рейтинг: {ad.seller.rating}</p>
      <p>Количество объявлений: {ad.seller.totalAds}</p>
      <p>Дата регистрации: {new Date(ad.seller.registeredAt).toLocaleDateString()}</p>

      {/* История модерации */}
      <h3>История модерации</h3>
      <table border={1} cellPadding={5} style={{ marginBottom: 15 }}>
        <thead>
          <tr>
            <th>Модератор</th>
            <th>Дата и время</th>
            <th>Действие</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {ad.moderationHistory.map((h) => (
            <tr key={h.id}>
              <td>{h.moderatorName}</td>
              <td>{new Date(h.timestamp).toLocaleString()}</td>
              <td>{h.action}</td>
              <td>{h.comment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Панель действий */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button style={{ backgroundColor: "green", color: "white" }} onClick={handleApprove}>Одобрить</button>
        <button style={{ backgroundColor: "red", color: "white" }} onClick={() => setShowRejectModal(true)}>Отклонить</button>
        <button style={{ backgroundColor: "yellow", color: "black" }} onClick={() => setShowChangesModal(true)}>Вернуть на доработку</button>
      </div>

      {/* Модалки */}
      {(showRejectModal || showChangesModal) && (
        <div style={{ border: "1px solid black", padding: 10, marginTop: 10 }}>
          <h4>{showRejectModal ? "Причина отклонения" : "Причина доработки"}</h4>

          <select value={reason} onChange={(e) => setReason(e.target.value as ReasonType)}>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {reason === "Другое" && (
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий"
            />
          )}

          <div style={{ marginTop: 8 }}>
            <button onClick={showRejectModal ? handleReject : handleRequestChanges}>Подтвердить</button>
            <button
              onClick={() => {
                showRejectModal ? setShowRejectModal(false) : setShowChangesModal(false);
              }}
              style={{ marginLeft: 8 }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
