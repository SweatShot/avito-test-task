import { useParams } from "react-router-dom";
import { useGetAdByIdQuery, useGetAllIdsQuery } from "../../app/shared/api/adsApi";

import Loader from "../../components/Loader/Loader";
import InfoSection from "../../components/InfoSection/InfoSection";
import ModerationModal from "./components/ModerationModal";
import ModerationButtons from "./components/ModerationButtons";

import { useItemNavigation } from "./hooks/useItemNavigation";
import { useModerationActions } from "./hooks/useModerationActions";

import { useModerationDialogs } from "./hooks/useModerationDialogs";
import { useModerationHotkeys } from "./hooks/useModerationHotkeys";

import AdHeader from "./components/AdHeader";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const adId = Number(id);

  const { data: allIds } = useGetAllIdsQuery();
  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId);

  const {
    showRejectModal,
    showChangesModal,
    openReject,
    openChanges,
    closeAll,
    reason,
    comment,
    setReason,
    setComment,
  } = useModerationDialogs();

  const { goPrev, goNext, goList, currentIndex } = useItemNavigation(adId, allIds);

  const { handleApprove, handleReject, handleRequestChanges } =
    useModerationActions(adId, reason, comment, closeAll);

  useModerationHotkeys({
    onApprove: handleApprove,
    onReject: openReject,
    onNext: goNext,
    onPrev: goPrev,
    onList: goList,
  });

  if (isLoading) return <Loader />;
  if (isError || !ad) return <p>Ошибка загрузки</p>;

  const characteristicsRows = Object.entries(ad.characteristics).map(([k, v]) => [k, v]);
  const sellerRows = [
    ["Имя", ad.seller.name],
    ["Рейтинг", ad.seller.rating],
    ["Количество объявлений", ad.seller.totalAds],
    ["Дата регистрации", new Date(ad.seller.registeredAt).toLocaleDateString()],
  ];
  const moderationRows = ad.moderationHistory.map(h => [
    h.moderatorName,
    new Date(h.timestamp).toLocaleString(),
    h.action,
    h.comment || "-",
  ]);

  return (
    <div style={{ padding: 20 }}>
      <AdHeader
        ad={ad}
        navigation={{
          goPrev,
          goNext,
          goList,
          currentIndex,
          total: allIds?.length ?? 0,
        }}
      />

      <InfoSection title="Характеристики" headers={["Название", "Значение"]} rows={characteristicsRows} />
      <InfoSection title="Продавец" headers={["Поле", "Значение"]} rows={sellerRows} />
      <InfoSection
        title="История модерации"
        headers={["Модератор", "Дата", "Действие", "Комментарий"]}
        rows={moderationRows}
      />

      <ModerationButtons
        onApprove={handleApprove}
        onReject={openReject}
        onRequestChanges={openChanges}
      />

      <ModerationModal
        show={showRejectModal}
        type="reject"
        reason={reason}
        comment={comment}
        onReasonChange={setReason}
        onCommentChange={setComment}
        onConfirm={handleReject}
        onCancel={closeAll}
      />

      <ModerationModal
        show={showChangesModal}
        type="changes"
        reason={reason}
        comment={comment}
        onReasonChange={setReason}
        onCommentChange={setComment}
        onConfirm={handleRequestChanges}
        onCancel={closeAll}
      />
    </div>
  );
}
