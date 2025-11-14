import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  useGetAdByIdQuery,
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
  useGetAllIdsQuery,
} from "../../app/shared/api/adsApi";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useToast } from "../../context/ToastContext";
import Loader from "../../components/Loader/Loader";

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

  const toast = useToast(); // хук тоста

  const adsIdsFromList: number[] | undefined =
    (location.state as { adsIds?: number[] } | undefined)?.adsIds;

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
    toast.addToast("Объявление одобрено", "success");
  };

  const handleReject = async () => {
    await rejectAd({ id: adId, reason, comment });
    toast.addToast("Объявление отклонено", "error");
    setShowRejectModal(false);
  };

  const handleRequestChanges = async () => {
    await requestChanges({ id: adId, reason, comment });
    toast.addToast("Запрос на доработку отправлен", "info");
    setShowChangesModal(false);
  };

  useKeyboardShortcuts({
    approve: handleApprove,
    reject: () => setShowRejectModal(true),
    next: goNext,
    prev: goPrev,
    focusSearch: () => {
      navigate("/list");
      setTimeout(() => {
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Поиск"]'
        );
        searchInput?.focus();
      }, 50);
    },
  });

  if (isLoading) return <Loader />;
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* Навигация */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
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
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          style={{ backgroundColor: "green", color: "white" }}
          onClick={handleApprove}
        >
          Одобрить
        </button>
        <button
          style={{ backgroundColor: "red", color: "white" }}
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

      {/* Модалки */}
      {(showRejectModal || showChangesModal) && (
        <div style={{ border: "1px solid black", padding: 10, marginTop: 10 }}>
          <h4>
            {showRejectModal ? "Причина отклонения" : "Причина доработки"}
          </h4>

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
            <button
              onClick={showRejectModal ? handleReject : handleRequestChanges}
            >
              Подтвердить
            </button>
            <button
              onClick={() =>
                showRejectModal
                  ? setShowRejectModal(false)
                  : setShowChangesModal(false)
              }
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
