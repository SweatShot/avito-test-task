import { FC } from "react";
import { useToast } from "../../context/ToastContext";

export const ToastContainer: FC = () => {
  const { toasts } = useToast();

  const getToastStyle = (type?: string) => {
    switch (type) {
      case "success":
        return { backgroundColor: "#4CAF50", color: "#fff" };
      case "error":
        return { backgroundColor: "#F44336", color: "#fff" };
      case "info":
        return { backgroundColor: "#FFC107", color: "#000" };
      default:
        return { backgroundColor: "#333", color: "#fff" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 10000,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontWeight: 500,
            transition: "background-color 0.3s, color 0.3s",
            ...getToastStyle(toast.type),
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
