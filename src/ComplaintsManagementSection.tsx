import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

interface Complaint {
  id: string;
  created_at: string;
  category: string;
  location: string | null;
  description: string;
  student_name: string;
  reg_number: string;
  image_url: string | null;
  status: "new" | "in_review" | "resolved";
}

const STATUSES: Complaint["status"][] = ["new", "in_review", "resolved"];

const statusColors: Record<Complaint["status"], { bg: string; text: string; border: string }> = {
  new: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.4)" },
  in_review: { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", border: "rgba(245,158,11,0.4)" },
  resolved: { bg: "rgba(16,185,129,0.12)", text: "#34d399", border: "rgba(16,185,129,0.4)" },
};

export default function ComplaintsManagementSection() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Complaint["status"]>("all");

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sug_complaints")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setComplaints(data as Complaint[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: string, status: Complaint["status"]) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await supabase.from("sug_complaints").update({ status }).eq("id", id);
  };

  const visible = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);
  const newCount = complaints.filter((c) => c.status === "new").length;

  return (
    <div className="reveal glass-card rounded-2xl p-6 sm:p-8" style={{ marginTop: "2.5rem" }}>
      <h3 className="text-lg font-display font-semibold" style={{ marginBottom: "1.25rem" }}>
        📋 SUG Complaints{newCount > 0 && ` (${newCount} new)`}
      </h3>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem", overflowX: "auto" }}>
        {(["all", "new", "in_review", "resolved"] as const).map((f) => {
          const isActive = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)",
                color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)",
                whiteSpace: "nowrap",
              }}
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading complaints...</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No complaints in this view.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visible.map((c) => {
            const colors = statusColors[c.status];
            return (
              <div
                key={c.id}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  padding: "1rem 1.1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "oklch(0.85 0.02 180)" }}>
                      {c.category}
                    </span>
                    {c.location && (
                      <div style={{ fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", marginTop: 2 }}>📍 {c.location}</div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "oklch(0.55 0.02 250)" }}>
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "oklch(0.85 0.02 180)", marginTop: 8, lineHeight: 1.55 }}>{c.description}</p>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", marginTop: 6 }}>
                  {c.student_name} — {c.reg_number}
                </p>
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt="Evidence"
                    style={{ maxHeight: 220, width: "auto", objectFit: "cover", borderRadius: 10, marginTop: 10, border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(c.id, s)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        border: c.status === s ? `1px solid ${colors.border}` : "1px solid rgba(255,255,255,0.1)",
                        background: c.status === s ? colors.bg : "rgba(255,255,255,0.03)",
                        color: c.status === s ? colors.text : "oklch(0.65 0.02 250)",
                      }}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
