import { useState } from "react";
import { ReasonType } from "../hooks/useModerationActions";

export function useModerationDialogs() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);

  const [reason, setReason] = useState<ReasonType>("Запрещенный товар");
  const [comment, setComment] = useState("");

  const openReject = () => setShowRejectModal(true);
  const openChanges = () => setShowChangesModal(true);

  const closeAll = () => {
    setShowRejectModal(false);
    setShowChangesModal(false);
  };

  return {
    // состояния
    showRejectModal,
    showChangesModal,
    reason,
    comment,

    // методы
    openReject,
    openChanges,
    closeAll,
    setReason,
    setComment,
  };
}
