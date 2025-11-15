import "./ModerationButtons.css";

interface ModerationButtonsProps {
  adId: number;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRequestChanges: (id: number) => void;
}

export default function ModerationButtons({ adId, onApprove, onReject, onRequestChanges }: ModerationButtonsProps) {
  return (
    <div className="moderation-buttons">
      <button className="approve" onClick={() => onApprove(adId)}>Одобрить</button>
      <button className="reject" onClick={() => onReject(adId)}>Отклонить</button>
      <button className="changes" onClick={() => onRequestChanges(adId)}>Вернуть на доработку</button>
    </div>
  );
}

