import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import type { Broadcast } from "./types";
import { formatPostDate, estimateReadTime } from "./types";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Broadcast | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      setStatus("loading");
      const { data, error } = await supabase
        .from("broadcasts")
        .select("*, broadcast_audiences(audience)")
        .eq("id", id)
        .single();

      if (cancelled) return;
      if (error || !data) {
        setStatus(error ? "error" : "not-found");
        return;
      }
      setPost({
        id: data.id,
        title: data.title || data.message.slice(0, 60),
        message: data.message,
        audiences: (data.broadcast_audiences || []).map((a: any) => a.audience),
        createdAt: new Date(data.created_at).getTime(),
        image: data.image,
      });
      setStatus("ready");
    };
    if (id) fetchPost();
    return () => { cancelled = true; };
  }, [id]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(0.13 0.015 250)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Loading update…</div>
      </div>
    );
  }

  if (status === "not-found" || status === "error" || !post) {
    return (
      <div style={{ minHeight: "100vh", background: "oklch(0.13 0.015 250)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem" }}>🗞️</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "oklch(0.95 0.01 180)" }}>
          {status === "error" ? "Couldn't load this update." : "This update isn't available anymore."}
        </h1>
        <Link to="/" style={{ color: "var(--emerald-bright)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
          ← Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "oklch(0.13 0.015 250)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1.5rem 5rem" }}>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", marginBottom: "2rem" }}
        >
          ← Back to Hub
        </Link>

        {/* Verified header — high-authority masthead, no social clutter */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
            <img src="/embiem-logo.png" alt="FUD Hub" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.95 0.01 180)" }}>FUD Hub Official</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Verified">
            <path d="M12 2l2.4 1.9 3-.5 1.1 2.9 2.9 1.1-.5 3L23 12l-1.9 2.4.5 3-2.9 1.1-1.1 2.9-3-.5L12 23l-2.4-1.9-3 .5-1.1-2.9-2.9-1.1.5-3L1 12l1.9-2.4-.5-3 2.9-1.1L6.4 2.6l3 .5L12 2z" fill="#10b981" />
            <path d="M8.5 12.5l2.3 2.3 4.7-4.9" stroke="oklch(0.12 0.02 160)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.1rem)", lineHeight: 1.25, color: "oklch(0.98 0.01 180)", margin: "0 0 1.25rem" }}>
          {post.title}
        </h1>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", borderRadius: 16, display: "block", marginBottom: "1.25rem", objectFit: "cover" }}
          />
        )}

        <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginBottom: "2rem" }}>
          {formatPostDate(post.createdAt)} · Campus News · {estimateReadTime(post.message)}
        </div>

        <div style={{ fontFamily: "var(--font-sans)", fontSize: "1.1rem", lineHeight: 1.6, color: "oklch(0.9 0.01 180)", whiteSpace: "pre-wrap" }}>
          {post.message}
        </div>
      </div>
    </div>
  );
}
