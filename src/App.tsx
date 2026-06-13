import { useState, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Vendor {
  id: number;
  name: string;
  category: string;
  initials: string;
  description: string;
  tags: string[];
  whatsapp: string;
  rating: number;
  status: "open" | "busy" | "closed";
}

// ── Data ─────────────────────────────────────────────────────────────────────
const VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Shaffy's Treats",
    category: "Uni Eats",
    initials: "ST",
    description:
      "Handmade cakes, glazed doughnuts and crispy small chops made fresh to order. Every bite tells the story.",
    tags: ["Cakes", "Doughnuts", "Small Chops"],
    whatsapp: "2348011111111",
    rating: 4.9,
    status: "open",
  },
  {
    id: 2,
    name: "Timas Delight",
    category: "Uni Eats",
    initials: "TD",
    description:
      "Shawarma, mandi rice, milkshakes, mocktails and fresh small chops — campus comfort food done right.",
    tags: ["Shawarma", "Milkshakes", "Snacks"],
    whatsapp: "2348022222222",
    rating: 4.8,
    status: "open",
  },
  {
    id: 3,
    name: "Shop with Lola",
    category: "Campus Drip",
    initials: "SL",
    description:
      "Soft, simple and affordable campus essentials — scrunchies, camisoles, sunglasses, hand cream and more.",
    tags: ["Accessories", "Camisoles", "Skincare"],
    whatsapp: "2348033333333",
    rating: 4.7,
    status: "open",
  },
  {
    id: 4,
    name: "FreshByte Gadgets",
    category: "Tech Plug",
    initials: "FB",
    description:
      "Fastest phone screen repairs on campus. Accessories, data cables, and power banks — sorted in minutes.",
    tags: ["Phone Repair", "Accessories", "Power Banks"],
    whatsapp: "2348044444444",
    rating: 4.8,
    status: "open",
  },
  {
    id: 5,
    name: "Afro Cuts Studio",
    category: "Fresh Cuts",
    initials: "AC",
    description:
      "Precision fades, beard shaping and scalp treatments for the campus king who takes his appearance seriously.",
    tags: ["Fade", "Beard", "Scalp Care"],
    whatsapp: "2348055555555",
    rating: 4.9,
    status: "busy",
  },
  {
    id: 6,
    name: "The Print Plug",
    category: "Print & Copy",
    initials: "PP",
    description:
      "Assignment printing, thesis binding and bulk photocopying. Fast, affordable, and right on campus.",
    tags: ["Printing", "Binding", "Photocopy"],
    whatsapp: "2348066666666",
    rating: 4.6,
    status: "open",
  },
];

const CATEGORIES = ["All", "Uni Eats", "Campus Drip", "Tech Plug", "Fresh Cuts", "Print & Copy"];

// ── Helpers ──────────────────────────────────────────────────────────────────
function openWhatsApp(number: string, vendorName: string) {
  const msg = encodeURIComponent(
    `Hi! I found you on FUD Hub (EMBIEM). I'd like to place an order from ${vendorName}.`
  );
  window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
}

// ── Vendor Card ───────────────────────────────────────────────────────────────
function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="vendor-card">
      <div className="card-top">
        <div className="card-avatar">{vendor.initials}</div>
        <span className="card-category">{vendor.category.toUpperCase()}</span>
      </div>
      <div className="card-body">
        <h3 className="card-name">{vendor.name}</h3>
        <p className="card-desc">{vendor.description}</p>
        <div className="card-tags">
          {vendor.tags.map((tag) => (
            <span key={tag} className="card-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="card-image-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <button
        className="card-whatsapp-btn"
        onClick={() => openWhatsApp(vendor.whatsapp, vendor.name)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Order on WhatsApp
      </button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    return VENDORS.filter((v) => {
      const matchesCat = activeCategory === "All" || v.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a1512;
          color: #e8ede8;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAV ── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: rgba(10,21,18,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          font-size: 1rem;
          color: #e8ede8;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
        }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }
        .nav-links a {
          color: rgba(232,237,232,0.65);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #e8ede8; }
        .nav-cta {
          padding: 0.5rem 1.25rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          color: #e8ede8;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-cta:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.35); }
        .nav-mobile-btn {
          display: none;
          background: none;
          border: none;
          color: #e8ede8;
          cursor: pointer;
          padding: 4px;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          padding: 5rem 2rem 5rem;
          overflow: hidden;
          background: radial-gradient(ellipse 70% 80% at 85% 40%, #0d3d2a 0%, transparent 60%),
                      radial-gradient(ellipse 50% 60% at 10% 80%, #071f14 0%, transparent 50%),
                      #0a1512;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          font-size: 0.8125rem;
          color: rgba(232,237,232,0.75);
          margin-bottom: 2rem;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          background: #22c55e;
          border-radius: 50%;
        }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #e8ede8;
          margin-bottom: 1.5rem;
          max-width: 700px;
        }
        .hero-title-accent {
          color: #22c55e;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: rgba(232,237,232,0.6);
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 2.5rem;
        }
        .hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: #22c55e;
          color: #071a0f;
          font-weight: 600;
          font-size: 0.9375rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .btn-primary:hover { background: #16a34a; transform: translateY(-1px); }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 1.75rem;
          background: transparent;
          color: #e8ede8;
          font-weight: 500;
          font-size: 0.9375rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.35); }

        /* ── EMBIEM CARD ── */
        .embiem-section {
          padding: 1.5rem 2rem 3rem;
        }
        .embiem-card {
          position: relative;
          background: #0f231a;
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 20px;
          padding: 2.5rem;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(34,197,94,0.08), inset 0 1px 0 rgba(34,197,94,0.15);
        }
        .embiem-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent);
        }
        .embiem-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #22c55e;
          margin-bottom: 0.875rem;
          text-transform: uppercase;
        }
        .embiem-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.5rem, 3.5vw, 2.25rem);
          font-weight: 700;
          color: #e8ede8;
          line-height: 1.25;
          margin-bottom: 1rem;
        }
        .embiem-title-gradient {
          background: linear-gradient(135deg, #22c55e, #86efac);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .embiem-body {
          font-size: 0.9375rem;
          color: rgba(232,237,232,0.6);
          line-height: 1.75;
          max-width: 540px;
          margin-bottom: 2rem;
        }

        /* ── DIRECTORY SECTION ── */
        .directory {
          padding: 0 2rem 4rem;
        }

        /* ── SEARCH + FILTER BAR ── */
        .search-bar-wrap {
          background: #111f18;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex: 1;
          min-width: 200px;
        }
        .search-icon { color: rgba(232,237,232,0.35); flex-shrink: 0; }
        .search-input {
          background: none;
          border: none;
          outline: none;
          color: #e8ede8;
          font-size: 0.9375rem;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }
        .search-input::placeholder { color: rgba(232,237,232,0.35); }
        .filter-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .filter-pill {
          padding: 0.375rem 1rem;
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background 0.18s, color 0.18s;
          background: transparent;
          color: rgba(232,237,232,0.55);
          font-family: 'Inter', sans-serif;
        }
        .filter-pill:hover { color: #e8ede8; }
        .filter-pill.active {
          background: #22c55e;
          color: #071a0f;
          font-weight: 600;
        }

        /* ── VENDOR GRID ── */
        .vendor-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        /* ── VENDOR CARD ── */
        .vendor-card {
          background: #0f1f18;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .vendor-card:hover {
          border-color: rgba(34,197,94,0.25);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        }
        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.25rem 0;
        }
        .card-avatar {
          width: 48px; height: 48px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          color: #22c55e;
          letter-spacing: 0.02em;
        }
        .card-category {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(232,237,232,0.4);
        }
        .card-body {
          padding: 1rem 1.25rem 1.25rem;
          flex: 1;
        }
        .card-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.3125rem;
          font-weight: 700;
          color: #e8ede8;
          line-height: 1.25;
          margin-bottom: 0.625rem;
        }
        .card-desc {
          font-size: 0.875rem;
          color: rgba(232,237,232,0.5);
          line-height: 1.65;
          margin-bottom: 1rem;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .card-tag {
          padding: 0.25rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          font-size: 0.75rem;
          color: rgba(232,237,232,0.55);
        }
        .card-image-placeholder {
          height: 100px;
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(232,237,232,0.15);
        }

        /* ── WHATSAPP BUTTON ── */
        .card-whatsapp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: calc(100% - 2.5rem);
          margin: 0 1.25rem 1.25rem;
          padding: 0.7rem 1rem;
          background: #22c55e;
          color: #071a0f;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .card-whatsapp-btn:hover { background: #16a34a; transform: translateY(-1px); }
        .card-whatsapp-btn:active { transform: scale(0.98); }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: 1/-1;
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(232,237,232,0.4);
        }
        .empty-state h3 { font-size: 1.125rem; color: #e8ede8; margin-bottom: 0.5rem; }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: gap;
          gap: 1rem;
        }
        .footer-left { font-size: 0.8125rem; color: rgba(232,237,232,0.35); }
        .footer-left span { color: #22c55e; font-weight: 600; }
        .footer-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .footer-chip {
          padding: 0.3rem 0.875rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 999px;
          font-size: 0.75rem;
          color: rgba(232,237,232,0.4);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .vendor-grid { grid-template-columns: repeat(2, 1fr); }
          .nav-links { display: none; }
          .nav-mobile-btn { display: block; }
        }
        @media (max-width: 580px) {
          .vendor-grid { grid-template-columns: 1fr; }
          .hero { padding: 3rem 1.25rem 3.5rem; }
          .hero-title { font-size: 2.75rem; }
          .embiem-section { padding: 1rem 1.25rem 2rem; }
          .embiem-card { padding: 1.75rem; }
          .directory { padding: 0 1.25rem 3rem; }
          .search-bar-wrap { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .nav { padding: 0 1.25rem; }
          .footer { padding: 1.5rem 1.25rem; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-icon">🎓</div>
          FUD Hub
        </a>
        <ul className="nav-links">
          <li><a href="#directory">Directory</a></li>
          <li><a href="#numbers">Numbers</a></li>
          <li><a href="#embiem">For Founders</a></li>
        </ul>
        <button className="nav-cta" onClick={() => document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })}>
          Explore
        </button>
        <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Live · 200+ student vendors on campus
        </div>
        <h1 className="hero-title">
          The Blueprint of<br />
          <span className="hero-title-accent">Campus Excellence.</span>
        </h1>
        <p className="hero-subtitle">
          A curated directory of student-led businesses redefining campus culture — from architectural pastry to bespoke tech. One tap, ordered via WhatsApp.
        </p>
        <div className="hero-btns">
          <button
            className="btn-primary"
            onClick={() => document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })}
          >
            Browse the Hub →
          </button>
          <button
            className="btn-secondary"
            onClick={() => document.getElementById("embiem")?.scrollIntoView({ behavior: "smooth" })}
          >
            List your business
          </button>
        </div>
      </section>

      {/* ── EMBIEM CARD ── */}
      <section className="embiem-section" id="embiem">
        <div className="embiem-card">
          <p className="embiem-eyebrow">Built by EMBIEM</p>
          <h2 className="embiem-title">
            Your Campus. Your Vendors <span className="embiem-title-gradient">Engineered by EMBIEM.</span>
          </h2>
          <p className="embiem-body">
            Built for FUD students, by FUD students. EMBIEM is the student-led agency powering FUD Hub — from design and development to vendor onboarding and support. Interested in listing your business or collaborating with us? Reach out via WhatsApp and let's elevate campus culture together.
          </p>
          <button
            className="btn-primary"
            onClick={() => window.open("https://wa.me/2348000000000?text=Hi%20EMBIEM!%20I%20want%20to%20list%20my%20business%20on%20FUD%20Hub.", "_blank")}
          >
            Order food, shop drip, grab tech →
          </button>
        </div>
      </section>

      {/* ── DIRECTORY ── */}
      <section className="directory" id="directory">
        {/* Search + Filter */}
        <div className="search-bar-wrap">
          <div className="search-input-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search pastries, tailors, tech repair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="vendor-grid">
          {filtered.length > 0 ? (
            filtered.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
              <h3>No vendors found</h3>
              <p>Try a different search term or category</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-left">
          FUD Hub by <span>EMBIEM</span> · Federal University Dutsinma
        </p>
        <div className="footer-chips">
          {["FUD Hub", "Vendor Portal", "EMBIEM.dev"].map((item) => (
            <span key={item} className="footer-chip">{item}</span>
          ))}
        </div>
      </footer>
    </>
  );
}
