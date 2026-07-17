// Shared between Home.tsx, PostDetail.tsx and components/CampusUpdates.tsx.
// Keeping these here avoids Home.tsx and PostDetail.tsx duplicating (and
// drifting on) the same Broadcast shape.
 
export type Audience = "Students" | "Vendors" | "Keke Operators" | "Senate";
 
export type Broadcast = {
  id: string;
  title: string;
  message: string;
  audiences: Audience[];
  createdAt: number;
  image?: string;
};
 
export const AUDIENCE_OPTIONS: { id: Audience; label: string; icon: string }[] = [
  { id: "Students", label: "Students", icon: "🎓" },
  { id: "Vendors", label: "Vendors", icon: "🛍️" },
  { id: "Keke Operators", label: "Keke Operators", icon: "🛺" },
  { id: "Senate", label: "Senate", icon: "🏛️" },
];
 
export function getBroadcastAccent(audiences: Audience[]) {
  if (audiences.includes("Senate")) {
    return { border: "#f59e0b", bg: "linear-gradient(135deg, rgba(245,158,11,0.16), rgba(239,68,68,0.09))", glow: "rgba(245,158,11,0.35)", icon: "🏛️" };
  }
  if (audiences.includes("Vendors")) {
    return { border: "#059669", bg: "linear-gradient(135deg, rgba(5,150,105,0.20), rgba(16,185,129,0.07))", glow: "rgba(5,150,105,0.35)", icon: "🛍️" };
  }
  if (audiences.includes("Keke Operators")) {
    return { border: "#06b6d4", bg: "linear-gradient(135deg, rgba(6,182,212,0.16), rgba(16,185,129,0.06))", glow: "rgba(6,182,212,0.3)", icon: "🛺" };
  }
  return { border: "#10b981", bg: "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(16,185,129,0.05))", glow: "rgba(16,185,129,0.3)", icon: "🎓" };
}
 
export function timeAgo(ts: number) {
  const diffMs = Date.now() - ts;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
 
export function formatPostDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}
 
export function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
 
