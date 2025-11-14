import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAdByIdQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";
import Loader from "../../components/Loader/Loader";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { ReasonType, useModerationActions } from "./hooks/useModerationActions";
import { useItemNavigation } from "./hooks/useItemNavigation";

import ModerationModal from "./components/ModerationModal";
import ModerationButtons from "./components/ModerationButtons";
import InfoTable from "../../components/InfoTable/InfoTable";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const adId = Number(id);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [reason, setReason] = useState<ReasonType>("Запрещенный товар");
  const [comment, setComment] = useState("");

  const { data: allIds } = useGetAllIdsQuery();
  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId);

  const { handleApprove, handleReject, handleRequestChanges } = useModerationActions(
    adId,
    reason,
    comment,
    () => {
      setShowRejectModal(false);
      setShowChangesModal(false);
    }
  );

  const { goPrev, goNext, goList, currentIndex } = useItemNavigation(adId, allIds);

  useKeyboardShortcuts({
    approve: handleApprove,
    reject: () => setShowRejectModal(true),
    next: goNext,
    prev: goPrev,
    focusSearch: goList,
  });

  if (isLoading) return <Loader />;
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>;

  // Формируем данные для таблиц
  const characteristicsRows = Object.entries(ad.characteristics).map(([key, value]) => [key, value]);
  const sellerRows = [
    ["Имя", ad.seller.name],
    ["Рейтинг", ad.seller.rating],
    ["Количество объявлений", ad.seller.totalAds],
    ["Дата регистрации", new Date(ad.seller.registeredAt).toLocaleDateString()],
  ];
  const moderationRows = ad.moderationHistory.map((h) => [
    h.moderatorName,
    new Date(h.timestamp).toLocaleString(),
    h.action,
    h.comment || "-",
  ]);

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
      <InfoTable headers={["Название", "Значение"]} rows={characteristicsRows} />

      {/* Продавец */}
      <h3>Информация о продавце</h3>
      <InfoTable headers={["Поле", "Значение"]} rows={sellerRows} />

      {/* История модерации */}
      <h3>История модерации</h3>
      <InfoTable
        headers={["Модератор", "Дата и время", "Действие", "Комментарий"]}
        rows={moderationRows}
      />

      {/* Панель действий */}
      <ModerationButtons
        onApprove={handleApprove}
        onReject={() => setShowRejectModal(true)}
        onRequestChanges={() => setShowChangesModal(true)}
      />

      {/* Модалки */}
      <ModerationModal
        show={showRejectModal}
        type="reject"
        reason={reason}
        comment={comment}
        onReasonChange={setReason}
        onCommentChange={setComment}
        onConfirm={handleReject}
        onCancel={() => setShowRejectModal(false)}
      />
      <ModerationModal
        show={showChangesModal}
        type="changes"
        reason={reason}
        comment={comment}
        onReasonChange={setReason}
        onCommentChange={setComment}
        onConfirm={handleRequestChanges}
        onCancel={() => setShowChangesModal(false)}
      />
    </div>
  );
}
