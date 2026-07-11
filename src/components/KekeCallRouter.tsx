import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

// ── Types ─────────────────────────────────────────────────────────────────────
// Matches the real `keke_drivers` Supabase table: id, name, phone, status, driver_number, zone.
type KekeDriver = {
  id: number;
  name: string;
  phone: string;
  status: string;
  driver_number: string | null;
  zone: string;
};

// ── Floating Keke Call Router ────────────────────────────────────────────────
// Renders as a floating FAB + bottom-sheet modal, matching the dark glass-card
// style used by EmergencyPanel / VendorModal elsewhere in the app.
export function KekeCallRouter() {
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState<KekeDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoneFilter, setZoneFilter] = useState<string>("All");
  const [revealed, setRevealed] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    supabase
      .from("keke_drivers")
      .select("*")
      .eq("status", "available")
      .order("zone", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        setLoading(false);
        if (error) {
          console.error("Failed to fetch keke_drivers:", error);
          return;
        }
        setDrivers((data as KekeDriver[]) || []);
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setRevealed(null);
  }, [open]);

  const zones = useMemo(() => {
    const set = new Set(drivers.map((d) => d.zone).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [drivers]);

  const filtered = useMemo(
    () => (zoneFilter === "All" ? drivers : drivers.filter((d) => d.zone === zoneFilter)),
    [drivers, zoneFilter]
  );

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Call a Keke"
        style={{
          position: "fixed",
          right: 20,
          bottom: 24,
          zIndex: 140,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderRadius: 999,
          border: "1px solid color-mix(in oklab, var(--emerald-glow) 45%, transparent)",
          background: "oklch(0.78 0.19 155)",
          color: "oklch(0.12 0.02 160)",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: "pointer",
          boxShadow: "0 14px 40px -10px oklch(0.72 0.21 152 / 0.65)",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>🛺</span>
        Call a Keke
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 160,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            animation: "keke-fadeIn 0.2s ease",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              margin: "0 auto",
              background: "oklch(0.18 0.02 250)",
              borderRadius: "24px 24px 0 0",
              border: "1px solid color-mix(in oklab, oklch(0.72 0.21 152) 20%, transparent)",
              overflow: "hidden",
              animation: "keke-slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1)",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "1.25rem 1.25rem 1rem", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      background: "oklch(0.22 0.022 250)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    🛺
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "oklch(0.97 0.01 180)" }}>
                      Call a Keke
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 2 }}>
                      Available operators near you
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "oklch(0.26 0.025 250)",
                    border: "none",
                    color: "oklch(0.97 0.01 180)",
                    fontSize: "1rem",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Zone filter chips */}
            <div style={{ display: "flex", gap: 8, padding: "0 1.25rem 1rem", overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
              {zones.map((z) => {
                const isActive = z === zoneFilter;
                return (
                  <button
                    key={z}
                    onClick={() => setZoneFilter(z)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                      background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)",
                      color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)",
                    }}
                  >
                    {z}
                  </button>
                );
              })}
            </div>

            {/* Driver list */}
            <div style={{ padding: "0 1.25rem 1.25rem", overflowY: "auto", flex: 1, minHeight: 0 }}>
              {loading ? (
                <p style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: "0.85rem", padding: "2rem 0" }}>
                  Loading available drivers…
                </p>
              ) : filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: "0.85rem", padding: "2rem 0" }}>
                  No Keke operators available right now. Try again shortly.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.map((d) => {
                    const isRevealed = revealed === String(d.id);
                    return (
                      <div
                        key={d.id}
                        style={{
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "oklch(0.2 0.02 250)",
                          padding: "0.9rem 1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                color: "oklch(0.95 0.01 180)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {d.name}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: 2 }}>📍 {d.zone}</div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              color: "#34d399",
                              background: "rgba(16,185,129,0.12)",
                              border: "1px solid rgba(16,185,129,0.3)",
                              borderRadius: 999,
                              padding: "3px 8px",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            ● Available
                          </span>
                        </div>

                        {isRevealed ? (
                          <a
                            href={`tel:${d.phone}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              width: "100%",
                              marginTop: 10,
                              padding: "0.7rem",
                              borderRadius: 12,
                              background: "oklch(0.78 0.19 155)",
                              color: "oklch(0.15 0.02 250)",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              textDecoration: "none",
                            }}
                          >
                            📞 Call {d.phone}
                          </a>
                        ) : (
                          <button
                            onClick={() => setRevealed(String(d.id))}
                            style={{
                              width: "100%",
                              marginTop: 10,
                              padding: "0.7rem",
                              borderRadius: 12,
                              border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)",
                              background: "color-mix(in oklab, var(--emerald-glow) 10%, transparent)",
                              color: "var(--emerald-bright)",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              cursor: "pointer",
                            }}
                          >
                            Show number
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes keke-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes keke-slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  );
}

export default KekeCallRouter;
