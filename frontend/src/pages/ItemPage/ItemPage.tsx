import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetAdByIdQuery,
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
  useGetAllIdsQuery,
} from "../../app/shared/api/adsApi";

const reasons = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
] as const;

type ReasonType = typeof reasons[number];

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const adId = Number(id);

  // прием ID массива (если был передан из списка)
  const adsIdsFromList: number[] | undefined =
    (location.state as { adsIds?: number[] } | undefined)?.adsIds;

  // если не передан — загружаем все ID
  const { data: allIds } = useGetAllIdsQuery(undefined, {
    skip: Boolean(adsIdsFromList),
  });

  const adsIds: number[] | undefined = adsIdsFromList || allIds;

  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId);

  const [approveAd] = useApproveAdMutation();
  const [rejectAd] = useRejectAdMutation();
  const [requestChanges] = useRequestChangesMutation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);

  const [reason, setReason] = useState<ReasonType>("Запрещенный товар");
  const [comment, setComment] = useState("");

  if (isLoading) return <p>Загрузка...</p>;
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>;

  const currentIndex = adsIds?.findIndex((i) => i === adId) ?? -1;

  const goPrev = () => {
    if (!adsIds || currentIndex <= 0) return;
    navigate(`/item/${adsIds[currentIndex - 1]}`, { state: { adsIds } });
  };

  const goNext = () => {
    if (!adsIds || currentIndex === -1 || currentIndex >= adsIds.length - 1)
      return;
    navigate(`/item/${adsIds[currentIndex + 1]}`, { state: { adsIds } });
  };

  const handleApprove = async () => {
    await approveAd(adId);
    alert("Объявление одобрено");
  };

  const handleReject = async () => {
    await rejectAd({ id: adId, reason, comment });
    alert("Объявление отклонено");
    setShowRejectModal(false);
  };

  const handleRequestChanges = async () => {
    await requestChanges({ id: adId, reason, comment });
    alert("Запрос на доработку отправлен");
    setShowChangesModal(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Навигационные кнопки */}
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <button onClick={() => navigate("/list")}>Назад к списку</button>

        <button onClick={goPrev} disabled={!adsIds || currentIndex <= 0}>
          ← Предыдущее
        </button>

        <button
          onClick={goNext}
          disabled={!adsIds || currentIndex >= adsIds.length - 1}
        >
          Следующее →
        </button>
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
              <td>
                <strong>{key}</strong>
              </td>
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
      <p>
        Дата регистрации:{" "}
        {new Date(ad.seller.registeredAt).toLocaleDateString()}
      </p>

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
      <div style={{ marginTop: 20 }}>
        <button
          style={{ backgroundColor: "green", color: "white", marginRight: 10 }}
          onClick={handleApprove}
        >
          Одобрить
        </button>

        <button
          style={{ backgroundColor: "red", color: "white", marginRight: 10 }}
          onClick={() => setShowRejectModal(true)}
        >
          Отклонить
        </button>

        <button
          style={{ backgroundColor: "yellow", color: "black" }}
          onClick={() => setShowChangesModal(true)}
        >
          Вернуть на доработку
        </button>
      </div>

      {/* Модалка отклонения */}
      {showRejectModal && (
        <div
          style={{
            border: "1px solid black",
            padding: 10,
            marginTop: 10,
          }}
        >
          <h4>Причина отклонения</h4>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReasonType)}
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {reason === "Другое" && (
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите причину"
            />
          )}

          <div style={{ marginTop: 8 }}>
            <button onClick={handleReject}>Подтвердить</button>
            <button
              onClick={() => setShowRejectModal(false)}
              style={{ marginLeft: 8 }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Модалка доработки */}
      {showChangesModal && (
        <div
          style={{
            border: "1px solid black",
            padding: 10,
            marginTop: 10,
          }}
        >
          <h4>Причина доработки</h4>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReasonType)}
          >
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
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
            <button onClick={handleRequestChanges}>Подтвердить</button>
            <button
              onClick={() => setShowChangesModal(false)}
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
