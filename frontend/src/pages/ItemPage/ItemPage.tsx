import { useState } from "react"
import { useParams } from "react-router-dom"
import {
  useGetAdByIdQuery,
  useGetAllIdsQuery,
} from "../../app/shared/api/adsApi"
import Loader from "../../components/Loader/Loader"
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts"
import { ReasonType, useModerationActions } from "./hooks/useModerationActions"
import { useItemNavigation } from "./hooks/useItemNavigation"

import ModerationModal from "./components/ModerationModal"
import ModerationButtons from "./components/ModerationButtons"
import NavigationButtons from "../../components/NavigationButtons/NavigationButtons"
import Gallery from "./components/Gallery"
import InfoSection from "../../components/InfoSection/InfoSection"
import { useAdTables } from "./hooks/useAdTables"

export default function ItemPage() {
  const { id } = useParams<{ id: string }>()
  const adId = Number(id)

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showChangesModal, setShowChangesModal] = useState(false)
  const [reason, setReason] = useState<ReasonType>("Запрещенный товар")
  const [comment, setComment] = useState("")

  const { data: allIds } = useGetAllIdsQuery()
  const { data: ad, isLoading, isError } = useGetAdByIdQuery(adId)

  const { handleApprove, handleReject, handleRequestChanges } =
    useModerationActions(adId, reason, comment, () => {
      setShowRejectModal(false)
      setShowChangesModal(false)
    })

  const { goPrev, goNext, goList, currentIndex } = useItemNavigation(
    adId,
    allIds,
  )

  useKeyboardShortcuts({
    approve: handleApprove,
    reject: () => setShowRejectModal(true),
    next: goNext,
    prev: goPrev,
    focusSearch: goList,
  })

  if (isLoading) return <Loader />
  if (isError || !ad) return <p>Ошибка загрузки объявления</p>

  const { characteristicsRows, sellerRows, moderationRows } = useAdTables(ad)

  return (
    <div style={{ padding: 20 }}>
      {/* Навигация */}
      <NavigationButtons
        onGoList={goList}
        onGoPrev={goPrev}
        onGoNext={goNext}
        disablePrev={currentIndex <= 0}
        disableNext={currentIndex >= (allIds?.length ?? 0) - 1}
      />

      <h1>{ad.title}</h1>

      {/* Галерея */}
      <Gallery images={ad.images} title={ad.title} />

      <p>{ad.description}</p>
    
      <InfoSection
        title="Характеристики"
        headers={["Название", "Значение"]}
        rows={characteristicsRows}
      />
      <InfoSection
        title="Информация о продавце"
        headers={["Поле", "Значение"]}
        rows={sellerRows}
      />
      <InfoSection
        title="История модерации"
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
  )
}
