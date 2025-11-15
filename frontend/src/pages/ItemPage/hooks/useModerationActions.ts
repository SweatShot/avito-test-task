import { useToast } from "../../../context/ToastContext"
import {
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
} from "../../../app/shared/api/adsApi"

export const reasons = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
] as const

export type ReasonType = typeof reasons[number]

export const useModerationActions = (
  adId: number,
  reason: ReasonType,
  comment: string,
  onClose?: () => void
) => {
  const toast = useToast()
  const [approveAd] = useApproveAdMutation()
  const [rejectAd] = useRejectAdMutation()
  const [requestChanges] = useRequestChangesMutation()

  const handleApprove = async (id?: number) => {
    await approveAd(id ?? adId)
    toast.addToast("Объявление одобрено", "success")
    onClose?.()
  }

  const handleReject = async (id?: number) => {
    await rejectAd({ id: id ?? adId, reason, comment })
    toast.addToast("Объявление отклонено", "error")
    onClose?.()
  }

  const handleRequestChanges = async (id?: number) => {
    await requestChanges({ id: id ?? adId, reason, comment })
    toast.addToast("Запрос на доработку отправлен", "info")
    onClose?.()
  }

  const handleBulkApprove = async (ids: number[]) => {
    await Promise.all(ids.map(id => handleApprove(id)))
    onClose?.()
  }

  const handleBulkReject = async (ids: number[]) => {
    await Promise.all(ids.map(id => handleReject(id)))
    onClose?.()
  }

  const handleBulkRequestChanges = async (ids: number[]) => {
    await Promise.all(ids.map(id => handleRequestChanges(id)))
    onClose?.()
  }

  return {
    handleApprove,
    handleReject,
    handleRequestChanges,
    handleBulkApprove,
    handleBulkReject,
    handleBulkRequestChanges,
  }
}
