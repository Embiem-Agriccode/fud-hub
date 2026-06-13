import { useEffect, useMemo, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Business = {
  id: string;
  name: string;
  category: string;
  initials: string;
  description: string;
  tags: string[];
  whatsapp: string;
  accent: string;
  logo?: string;
  image?: string;
};
// ── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Uni Eats", "Campus Drip", "Fresh Cuts", "Tech Plug", "Handmade"] as const;
const BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Shaffy's Treats",
    category: "Uni Eats",
    initials: "ST",
    description: "Handmade cakes, glazed doughnuts and crispy small chops made fresh to order. Every bite tells the story.",
    tags: ["Cakes", "Doughnuts", "Small Chops"],
    whatsapp: "2348026498451",
    accent: "from-amber-300/30 to-emerald-400/20",
    logo: "/shaffyslogo.jpg",
    image: "/shaffys1.jpg",
  },
  {
    id: "2",
    name: "Timas Delight",
    category: "Uni Eats",
    initials: "TD",
    description: "Shawarma, mandi rice, milkshakes, mocktails and fresh small chops — campus comfort food done right.",
    tags: ["Shawarma", "Milkshakes", "Snacks"],
    whatsapp: "2348026498451",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/temaslogo.jpg",
    image: "/temas1.jpg",
  },
  {
    id: "3",
    name: "Shop with Lola",
    category: "Campus Drip",
    initials: "SL",
    description: "Soft, simple and affordable campus essentials — scrunchies, camisoles, sunglasses, hand cream and more.",
    tags: ["Accessories", "Camisoles", "Skincare"],
    whatsapp: "2347046998187",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/lolalogo.jpg",
    image: "/lola1.jpg",
  },
  {
    id: "4",
    name: "Everything Mata",
    category: "Campus Drip",
    initials: "EM",
    description: "Curated beauty and self-care products for elegant living. Skincare essentials delivered to your door.",
    tags: ["Skincare", "Self Care", "Beauty"],
    whatsapp: "2349139294346",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/matalogo.jpg",
    image: "/mata1.jpg",
  },
  {
    id: "5",
    name: "Anointed Accessories",
    category: "Tech Plug",
    initials: "AA",
    description: "Phones and accessories at student-friendly prices. Quality devices, fast delivery on campus.",
    tags: ["Phones", "Accessories", "Gadgets"],
    whatsapp: "2349129929484",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/aalogo.jpg",
    image: "/aa1.jpg",
  },
  {
    id: "6",
    name: "MBM Gadget",
    category: "Tech Plug",
    initials: "MG",
    description: "Trusted campus plug for laptops and phones. UK-used and brand new devices with verified specs.",
    tags: ["Laptops", "Phones", "UK-Used"],
    whatsapp: "2348084737552",
    accent: "from-emerald-400/30 to-cyan-400/10",
    logo: "/mbmlogo.jpg",
    image: "/mbm1.jpg",
  },
  {
    id: "7",
    name: "10 Digit Integrated Service",
    category: "Uni Eats",
    initials: "DIS",
    description: "Sells affordable, crispy small chops + snacks. Natural ingredients, 100% homemade.",
    tags: ["Zobo", "Samosa", "PuffPuff"],
    whatsapp: "2347031955575",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/10 logo.jpg",
    image: "/10 1.jpg",
  },
  {
    id: "8",
    name: "Dizzorh.inc",
    category: "Handmade",
    initials: "DI",
    description: "Handmade epoxy resin art - custom coasters, Home Decor.",
    tags: ["ResinArt", "Home Decor", "Vases"],
    whatsapp: "234709421820",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/dizzorhlogo.jpg",
    image: "/dizzorh2.jpg",
  },
];

const STATS = [
  { k: "200+", v: "Verified vendors" },
  { k: "12", v: "Categories" },
  { k: "4.9★", v: "Avg. campus rating" },
  { k: "< 30m", v: "Median response" },
];

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const observe = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible), .reveal-slide:not(.is-visible)").forEach((el) => io.observe(el));
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); document.documentElement.classList.remove("reveal-ready"); };
  }, []);
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
          <img 
            src="/embiem-logo.png" 
            alt="EMBIEM" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">FUD Hub</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#directory" className="hover:text-foreground transition-colors">Directory</a>
          <a href="#stats" className="hover:text-foreground transition-colors">Numbers</a>
          <a href="#embiem" className="hover:text-foreground transition-colors">For Founders</a>
        </nav>
        <a href="#directory" className="text-xs sm:text-sm font-medium px-4 py-2 rounded-full glow-border bg-surface hover:bg-surface-elevated transition-colors">
          Explore
        </a>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 sm:pt-24">
      <div className="reveal max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1.5 text-xs text-foreground mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-bright animate-pulse" />
          Live · 200+ student vendors on campus
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.02] tracking-tight">
          The Blueprint of <br />
          <span className="text-gradient-emerald">Campus Excellence.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          A curated directory of student-led businesses redefining campus culture — from architectural pastry to bespoke tech. One tap, ordered via WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#directory"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)] transition-shadow"
          >
            Browse the Hub
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#embiem"
            className="inline-flex items-center gap-2 rounded-full glow-border bg-surface px-5 py-3 text-sm font-medium hover:bg-surface-elevated transition-colors"
          >
            List your business
          </a>
        </div>
      </div>

      {/* EMBIEM card */}
      <div id="embiem" className="reveal-slide mt-18 relative overflow-hidden rounded-2xl border border-emerald-glow/30 bg-gradient-to-br from-surface-elevated to-surface p-6 sm:p-8 shadow-[0_0_40px_-12px_rgba(0,0,0,0.5)]" style={{ marginTop: "4.5rem" }}>
        <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-bright mb-2">
            Built by EMBIEM
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold leading-snug tracking-tight">
            Your Campus. Your Vendors <span className="text-gradient-emerald">Engineered by EMBIEM.</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Built for FUD students, by FUD students. EMBIEM is the student-led agency powering FUD Hub — from design and development to vendor onboarding and support. Interested in listing your business or collaborating with us? Reach out via WhatsApp and let's elevate campus culture together.
          </p>
          <a
            href={`https://wa.me/2347044389234?text=${encodeURIComponent("Hi EMBIEM! I'd like to list my luxury site for my business.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)] transition-shadow"
          >
            Order food, shop drip, grab tech
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>

      {/* Floating orb */}
      <div aria-hidden className="pointer-events-none absolute -right-10 top-10 hidden lg:block">
        <div className="h-72 w-72 rounded-full bg-emerald-glow/20 blur-3xl" />
      </div>
    </section>
  );
}

// ── Controls ──────────────────────────────────────────────────────────────────
function Controls({ active, onActive, query, onQuery }: {
  active: (typeof CATEGORIES)[number];
  onActive: (c: (typeof CATEGORIES)[number]) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  return (
    <section id="directory" className="mx-auto max-w-7xl px-6">
      <div className="reveal glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search pastries, tailors, tech repair..."
            className="w-full bg-surface/60 border border-border rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-emerald-glow focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--emerald-glow),20%,transparent)] transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => onActive(c)}
                className={
                  "text-xs sm:text-sm px-4 py-2.5 rounded-full transition-all duration-300 border " +
                  (isActive
                    ? "bg-primary text-primary-foreground border-transparent shadow-[0_0_24px_-6px_var(--emerald-glow)]"
                    : "bg-surface/60 text-muted-foreground border-border hover:text-foreground hover:border-emerald-glow/60")
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ business, index }: { business: Business; index: number }) {
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;
  return (
    <article
      className="reveal group relative glass-card rounded-2xl p-6 flex flex-col hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--emerald-glow),55%,transparent)] hover:border-emerald-glow/60"
      style={{ transitionDelay: `${(index % 9) * 40}ms` }}
    >
      {/* Accent gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${business.accent} pointer-events-none`} />

      {/* Top row */}
        <div className="h-14 w-14 glow-border bg-surface place-items-center grid rounded-xl shrink-0 overflow-hidden">
          {business.logo ? (
            <img src={business.logo} alt={business.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span className="text-gradient-emerald font-display text-lg font-bold tracking-tight">
              {business.initials}
            </span>
          )}
        </div>

      {/* Body */}
      <div className="relative mt-4 flex-1">
        <h3 className="text-xl font-display font-semibold leading-snug tracking-tight">{business.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {business.tags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 text-muted-foreground bg-surface/60">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Image area */}
      <div
        className="reveal-slide relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-surface-elevated to-surface"
        style={{ transitionDelay: `${(index % 9) * 60 + 120}ms` }}
      >
        {business.image ? (
          <img
            src={business.image}
            alt={`${business.name} product`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(45deg, color-mix(in oklab, var(--emerald-glow) 8%, transparent) 0 1px, transparent 1px 14px)" }} />
            <div className="relative flex flex-col items-center gap-2 text-center p-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-bright/70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="11" r="2" />
                <path d="m21 17-5-5-8 8" />
              </svg>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Upload Product Photo
              </span>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp CTA */}
      <div className="relative mt-5 pt-5 border-t border-border/70">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-400 shadow-[0_0_24px_-6px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)]"        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order via WhatsApp
        </a>
      </div>
    </article>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
function Grid({ items }: { items: Business[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">
          No vendors match that search. Try another category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((b, i) => (
            <Card key={b.id} business={b} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 pb-24">
      <div className="reveal glass-card p-8 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {STATS.map((s) => (
          <div key={s.v}>
            <div className="text-3xl sm:text-4xl font-display font-bold text-gradient-emerald">{s.k}</div>
            <div className="mt-1 text-xs sm:text-sm text-muted-foreground tracking-wide">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESSES.filter((b) => {
      const matchCat = active === "All" || b.category === active;
      const matchQ = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Controls active={active} onActive={setActive} query={query} onQuery={setQuery} />
      <Grid items={filtered} />
      <Stats />
    </div>
  );
}
