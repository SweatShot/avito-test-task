import "./ModerationButtons.css";

interface ModerationButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
}

export default function ModerationButtons({ onApprove, onReject, onRequestChanges }: ModerationButtonsProps) {
  return (
    <div className="moderation-buttons">
      <button className="approve" onClick={onApprove}>Одобрить</button>
      <button className="reject" onClick={onReject}>Отклонить</button>
      <button className="changes" onClick={onRequestChanges}>Вернуть на доработку</button>
    </div>
  );
}
