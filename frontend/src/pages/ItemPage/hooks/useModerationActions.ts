import { useToast } from "../../../context/ToastContext";
import {
  useApproveAdMutation,
  useRejectAdMutation,
  useRequestChangesMutation,
} from "../../../app/shared/api/adsApi";

export const reasons = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
] as const;

export type ReasonType = typeof reasons[number];

export const useModerationActions = (
  adId: number,
  reason: ReasonType,
  comment: string,
  onClose?: () => void 
) => {
  const toast = useToast();
  const [approveAd] = useApproveAdMutation();
  const [rejectAd] = useRejectAdMutation();
  const [requestChanges] = useRequestChangesMutation();

  const handleApprove = async () => {
    await approveAd(adId);
    toast.addToast("Объявление одобрено", "success");
    onClose?.();
  };

  const handleReject = async () => {
    await rejectAd({ id: adId, reason, comment });
    toast.addToast("Объявление отклонено", "error");
    onClose?.();
  };

  const handleRequestChanges = async () => {
    await requestChanges({ id: adId, reason, comment });
    toast.addToast("Запрос на доработку отправлен", "info");
    onClose?.();
  };

  return { handleApprove, handleReject, handleRequestChanges };
};
