import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";

export function useModerationHotkeys({
  onApprove,
  onReject,
  onNext,
  onPrev,
  onList,
}: {
  onApprove: () => void;
  onReject: () => void;
  onNext: () => void;
  onPrev: () => void;
  onList: () => void;
}) {
  useKeyboardShortcuts({
    approve: onApprove,
    reject: onReject,
    next: onNext,
    prev: onPrev,
    focusSearch: onList,
  });
}

