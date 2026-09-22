import { useEffect } from "react";
import SUGComplaintForm from "./SUGComplaintForm";

interface ComplaintModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ComplaintModal({ open, onClose }: ComplaintModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          animation: "slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "oklch(0.26 0.025 250)",
            border: "none",
            color: "oklch(0.97 0.01 180)",
            fontSize: "1rem",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          ✕
        </button>
        <SUGComplaintForm onSubmitted={onClose} />
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}
