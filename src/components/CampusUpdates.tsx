import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Broadcast } from "../types";
import { getBroadcastAccent, timeAgo } from "../types";

export function CampusUpdates({ open, onClose, broadcasts }: { open: boolean; onClose: () => void; broadcasts: Broadcast[] }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const handleView = (id: string) => {
    onClose();
    navigate(`/post/${id}`);
  };

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        role="dialog"
        aria-label="Campus updates"
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 410,
          width: "min(360px, 88vw)",
          background: "oklch(0.16 0.018 250)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "30px 0 70px -30px rgba(0,0,0,0.7)",
          transform: open ? "translateX(0)" : "translateX(-104%)",
          transition: "transform 0.32s cubic-bezier(0.2,0.8,0.2,1)",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ padding: "1.5rem 1.25rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--emerald-bright)" }}>Live</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.35rem", color: "oklch(0.97 0.01 180)", marginTop: 4 }}>Campus Updates</h2>
          </div>
          <button onClick={onClose} aria-label="Close updates" style={{ width: 34, height: 34, borderRadius: "50%", background: "oklch(0.24 0.022 250)", border: "none", color: "oklch(0.9 0.01 180)", fontSize: "1rem", cursor: "pointer", flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem 2rem" }}>
          {broadcasts.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textAlign: "center", padding: "2.5rem 0" }}>No campus updates yet. Check back soon.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {broadcasts.map((b) => {
                const accent = getBroadcastAccent(b.audiences);
                return (
                  <div key={b.id} style={{ borderRadius: 16, overflow: "hidden", background: accent.bg, border: `1px solid color-mix(in oklab, ${accent.border} 35%, transparent)` }}>
                    {b.image && (
                      <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                        <img src={b.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: "1rem" }}>{accent.icon}</span>
                        <span style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", fontWeight: 600 }}>{timeAgo(b.createdAt)}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", margin: "0 0 6px", lineHeight: 1.35 }}>{b.title}</h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.message}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 12 }}>
                        <button onClick={() => handleView(b.id)} style={{ flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, padding: "6px 14px", borderRadius: 999, border: "none", background: "oklch(0.72 0.21 152)", color: "oklch(0.12 0.02 160)", cursor: "pointer" }}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
