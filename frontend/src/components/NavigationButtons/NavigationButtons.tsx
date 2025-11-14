import "./NavigationButtons.css";

interface NavigationButtonsProps {
  onGoList: () => void;
  onGoPrev: () => void;
  onGoNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export default function NavigationButtons({
  onGoList,
  onGoPrev,
  onGoNext,
  disablePrev,
  disableNext,
}: NavigationButtonsProps) {
  return (
    <div className="navigation-buttons">
      <button className="nav-btn" onClick={onGoList}>
        Назад к списку
      </button>
      <button className="nav-btn" onClick={onGoPrev} disabled={disablePrev}>
        ← Предыдущее
      </button>
      <button className="nav-btn" onClick={onGoNext} disabled={disableNext}>
        Следующее →
      </button>
    </div>
  );
}
