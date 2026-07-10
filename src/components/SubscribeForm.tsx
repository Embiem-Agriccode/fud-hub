import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// ── Subscribe Form ───────────────────────────────────────────────────────────
// Public opt-in. Writes to the `subscribers` table (audience hardcoded to
// "Students"). Requires an @fud.edu.ng email (to confirm FUD affiliation) in
// addition to a phone number (what SMS broadcasts actually use).
//
// NOTE: the `subscribers` table needs an `email` column added — this insert
// will fail until that column exists.

const LEVELS = ["100", "200", "300", "400", "500"];
const FUD_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@fud\.edu\.ng$/i;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  background: "oklch(0.2 0.02 250)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "oklch(0.95 0.01 180)",
  fontSize: "0.9rem",
  outline: "none",
  marginTop: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "oklch(0.62 0.02 250)",
  display: "block",
};

type FormErrors = { email?: string; phone?: string; level?: string };

// ── Shared form + success UI, used by both the inline section and the modal ─
function SubscribeFormCard({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const next: FormErrors = {};
    if (!FUD_EMAIL_RE.test(email.trim())) next.email = "Use your FUD school email (@fud.edu.ng)";
    if (!/^\d{11}$/.test(phone)) next.phone = "Enter an 11-digit phone number";
    if (!level) next.level = "Select your level";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setSubmitError("");
    setLoading(true);

    const { error } = await supabase.from("subscribers").insert([
      { name: name.trim() || null, email: email.trim().toLowerCase(), phone, level, audience: "Students" },
    ]);

    setLoading(false);

    if (error) {
      setSubmitError("Something went wrong. Please try again.");
      console.error(error);
      return;
    }
    setSuccess(true);
    onSuccess?.();
  };

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "1.5rem 0" }}>
        <div style={{ position: "relative", width: 64, height: 64, marginBottom: "1.25rem" }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(16,185,129,0.5)",
              animation: "sfRing 900ms ease-out 120ms both",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "sfPop 420ms cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 12.5L9.5 18L20 6" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-display font-semibold">You're in</h3>
        <p className="text-sm text-muted-foreground" style={{ marginTop: 6, maxWidth: "26ch" }}>
          We'll text you when new vendors and drops go live.
        </p>
        <style>{`
          @keyframes sfPop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes sfRing { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--emerald-bright)",
            background: "color-mix(in oklab, var(--emerald-glow) 12%, transparent)",
            border: "1px solid color-mix(in oklab, var(--emerald-glow) 35%, transparent)",
            borderRadius: 999,
            padding: "5px 12px",
          }}
        >
          Exclusive for FUD Students
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-center">
        Get early access
      </h2>
      <p className="text-sm text-muted-foreground text-center" style={{ marginTop: 6 }}>
        Join the list for vendor drops and campus updates.
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>
            Name <span style={{ opacity: 0.5, textTransform: "none" }}>(optional)</span>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aisha Bello" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>FUD school email *</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder="yourname@fud.edu.ng"
            type="email"
            style={{ ...inputStyle, border: errors.email ? "1px solid #f87171" : inputStyle.border }}
          />
          {errors.email && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: 5 }}>{errors.email}</p>}
        </div>

        <div>
          <label style={labelStyle}>Phone number *</label>
          <input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder="08012345678"
            inputMode="numeric"
            style={{ ...inputStyle, border: errors.phone ? "1px solid #f87171" : inputStyle.border }}
          />
          {errors.phone && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: 5 }}>{errors.phone}</p>}
        </div>

        <div>
          <label style={labelStyle}>Level *</label>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              if (errors.level) setErrors((p) => ({ ...p, level: undefined }));
            }}
            style={{
              ...inputStyle,
              border: errors.level ? "1px solid #f87171" : inputStyle.border,
              color: level ? "oklch(0.95 0.01 180)" : "oklch(0.5 0.01 180)",
            }}
          >
            <option value="" disabled>Select your level</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl} style={{ color: "#000" }}>{lvl} Level</option>
            ))}
          </select>
          {errors.level && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: 5 }}>{errors.level}</p>}
        </div>

        {submitError && (
          <p style={{ color: "#f87171", fontSize: "0.8rem", textAlign: "center" }}>{submitError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            width: "100%",
            padding: "0.9rem",
            borderRadius: 14,
            border: "none",
            background: "oklch(0.72 0.21 152)",
            color: "oklch(0.12 0.02 160)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid oklch(0.12 0.02 160 / 0.35)",
                  borderTopColor: "oklch(0.12 0.02 160)",
                  animation: "sfSpin 0.7s linear infinite",
                }}
              />
              Subscribing…
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      <style>{`@keyframes sfSpin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ── Inline section (default export) — unchanged usage: <SubscribeForm /> ────
export default function SubscribeForm() {
  return (
    <section id="subscribe" className="mx-auto max-w-7xl px-6 pb-24">
      <div className="reveal glass-card rounded-2xl p-6 sm:p-10 max-w-md mx-auto">
        <SubscribeFormCard />
      </div>
    </section>
  );
}

// ── Modal wrapper — <SubscribeModal open={bool} onClose={fn} /> ─────────────
export function SubscribeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
        zIndex: 400,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        animation: "sfFadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "sfModalIn 0.3s cubic-bezier(0.2,0.8,0.2,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-card rounded-2xl p-6 sm:p-10" style={{ background: "oklch(0.18 0.02 250)" }}>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
          <SubscribeFormCard onSuccess={() => setTimeout(onClose, 1800)} />
        </div>
      </div>
      <style>{`
        @keyframes sfFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sfModalIn { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
