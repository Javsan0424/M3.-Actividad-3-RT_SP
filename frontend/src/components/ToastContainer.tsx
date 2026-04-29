import { useEffect, CSSProperties } from "react"; 

const ICONS: Record<string, string> = {
  Gol: "⚽",
  "Tarjeta amarilla": "🟨",
  "Tarjeta roja": "🟥",
  Falta: "🚫",
  "Saque de esquina": "🚩",
};

export interface ToastData {
  toastId: number;
  eventType: string;
  minute: number | null;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div style={styles.wrapper}>
      {toasts.map((t) => (
        <Toast key={t.toastId} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.toastId), 3000);
    return () => clearTimeout(timer);
  }, [toast.toastId, onDismiss]);

  return (
    // CAMBIO: style en lugar de className y sin comillas
    <div style={styles.toast} onClick={() => onDismiss(toast.toastId)}>
      <span style={styles.icon}>{ICONS[toast.eventType] ?? "📌"}</span>
      <div>
        <div style={styles.type}>{toast.eventType}</div>
        {toast.minute != null && (
          <div style={styles.detail}>min. {toast.minute}</div>
        )}
      </div>
    </div>
  );
}

// CAMBIO CRÍTICO: Tipamos el objeto como un Record de CSSProperties
// Esto quita los errores de TypeScript en el objeto styles
const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    zIndex: 1000,
    pointerEvents: "none",
  },
  toast: {
    background: "#222",
    color: "white",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    minWidth: "210px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
    cursor: "pointer",
    pointerEvents: "all",
  },
  icon: { fontSize: "1.4rem" },
  type: { fontWeight: "bold", fontSize: "0.9rem" },
  detail: { fontSize: "0.75rem", color: "#aaa" },
};