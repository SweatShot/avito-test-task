import React from "react";
import { reasons, ReasonType } from "../hooks/useModerationActions";

interface ModerationModalProps {
  show: boolean;
  type: "reject" | "changes";
  reason: ReasonType;
  comment: string;
  onReasonChange: (reason: ReasonType) => void;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModerationModal: React.FC<ModerationModalProps> = ({
  show,
  type,
  reason,
  comment,
  onReasonChange,
  onCommentChange,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        minWidth: 320,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      }}>
        <h4>{type === "reject" ? "Причина отклонения" : "Причина доработки"}</h4>

        <select
          value={reason}
          onChange={(e) => onReasonChange(e.target.value as ReasonType)}
          style={{ width: "100%", marginTop: 8, padding: 6 }}
        >
          {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        {reason === "Другое" && (
          <input
            type="text"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Введите комментарий"
            style={{ width: "100%", marginTop: 8, padding: 6 }}
          />
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 8 }}>
          <button onClick={onConfirm} style={{ backgroundColor: "blue", color: "white", padding: "6px 12px" }}>
            Подтвердить
          </button>
          <button onClick={onCancel} style={{ padding: "6px 12px" }}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ModerationModal;
