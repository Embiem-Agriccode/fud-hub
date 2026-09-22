import { useState } from "react";
import type { MouseEvent } from "react";
import ComplaintModal from "./ComplaintModal";

export default function ReportIssueCTA() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6" style={{ marginBottom: "30px" }}>
      <button
        onClick={() => setOpen(true)}
        className="reveal group"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          width: "100%",
          padding: "1.15rem",
          borderRadius: 18,
          border: "1.5px solid rgba(245,158,11,0.5)",
          background: "transparent",
          color: "#fbbf24",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.95rem",
          letterSpacing: "0.01em",
          cursor: "pointer",
          transition: "background 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "rgba(245,158,11,0.08)";
          e.currentTarget.style.boxShadow = "0 0 40px -12px rgba(245,158,11,0.6)";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        📋 Report an Issue to SUG
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </button>
      <ComplaintModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
