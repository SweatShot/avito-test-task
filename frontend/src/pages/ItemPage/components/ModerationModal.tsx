import { FC } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (r: string) => void;
  comment: string;
  setComment: (c: string) => void;
  reasons: readonly string[];
  title: string;
}

export const ModerationModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  reason,
  setReason,
  comment,
  setComment,
  reasons,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ border: "1px solid black", padding: 10, marginTop: 10 }}>
      <h4>{title}</h4>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        {reasons.map((r) => (
          <option key={r} value={r}>{r}</option>
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
        <button onClick={onConfirm}>Подтвердить</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Отмена</button>
      </div>
    </div>
  );
};
