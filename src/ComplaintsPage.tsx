import SUGComplaintForm from "./SUGComplaintForm";

export default function ComplaintsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center gap-3">
          <a href="/" className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
            <img src="/embiem-logo.png" alt="EMBIEM" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </a>
          <span className="font-display font-semibold tracking-tight text-base">FUD Hub</span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6" style={{ paddingTop: "2.5rem", paddingBottom: "3rem", flex: 1, width: "100%" }}>
        <SUGComplaintForm />
      </div>
    </div>
  );
}
