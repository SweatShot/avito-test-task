import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts({
  approve,
  reject,
  next,
  prev,
  focusSearch,
}: {
  approve: () => void;
  reject: () => void;
  next: () => void;
  prev: () => void;
  focusSearch?: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case "a": 
        case "ф":
          approve();
          break;
        case "d": 
        case "в": 
          reject();
          break;
        case "arrowright":
          next();
          break;
        case "arrowleft":
          prev();
          break;
        case "/":
          e.preventDefault();
          focusSearch?.();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [approve, reject, next, prev, focusSearch, navigate]);
}
