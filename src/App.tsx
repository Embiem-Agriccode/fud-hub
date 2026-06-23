import { useEffect, useMemo, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
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
  images?: string[];
  verified?: boolean;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Uni Eats", "Campus Drip", "Fresh Cuts", "Tech Plug", "Lundary", "Home & Life", "Print & Copy",] as const;
const BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Timas Delight",
    category: "Uni Eats",
    initials: "TD",
    description: "Shawarma, mandi rice, milkshakes, mocktails and fresh small chops — campus comfort food done right.",
    tags: ["Shawarma", "Milkshakes", "Snacks"],
    whatsapp: "2347026356625",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/temaslogo.jpg",
    image: "/temas1.jpg",
    images: ["/temas1.jpg", "/temas2.jpg", "/temas3.jpg", "/temas4.jpg", "/temas5.jpg"],
    verified: true
  },
  {
    id: "2",
    name: "Shop with Lola",
    category: "Campus Drip",
    initials: "SL",
    description: "Soft, simple and affordable campus essentials — scrunchies, camisoles, sunglasses, hand cream and more.",
    tags: ["Accessories", "Camisoles", "Skincare"],
    whatsapp: "2347046998187",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/lolalogo.jpg",
    image: "/lola1.jpg",
    images: ["/lola1.jpg", "/lola2.jpg", "/lola3.jpg"],
    verified: true
  },
  {
    id: "3",
    name: "Shaffy's Treats",
    category: "Uni Eats",
    initials: "ST",
    description: "Handmade cakes, glazed doughnuts and crispy small chops made fresh to order. Every bite tells the story.",
    tags: ["Cakes", "Doughnuts", "Small Chops"],
    whatsapp: "2348026498451",
    accent: "from-amber-300/30 to-emerald-400/20",
    logo: "/shaffyslogo.jpg",
    image: "/shaffys1.jpg",
    images: ["/shaffys1.jpg", "/shaffys2.jpg", "/shaffys3.jpg", "/shaffys4.jpg"],
    verified: true
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
    images: ["/mata1.jpg", "/mata2.jpg"],
    verified: true
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
    images: ["/mbm1.jpg", "/mbm2.jpg", "/mbm3.jpg"],
    verified: true
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
    images: ["/10 1.jpg", "/10 2.jpg", "/10 3.jpg"],
    verified: true
  },
  {
    id: "8",
    name: "Dizzorh.inc",
    category: "Handmade",
    initials: "DI",
    description: "Handmade epoxy resin art - custom coasters, Home Decor.",
    tags: ["ResinArt", "Home Decor", "Vases"],
    whatsapp: "2347069421830",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/dizzorhlogo.jpg",
    image: "/dizzorh2.jpg",
    images: ["/dizzorh2.jpg", "/dizzorh3.jpg", "/dizzorh4.jpg"],
    verified: true
  },
  {
    id: "9",
    name: "Bel's Closet",
    category: "Campus Drip",
    initials: "BC",
    description: "Affordable, trendy clothing and accessories for students. Curated styles to elevate your campus wardrobe.",
    tags: ["Clothing", "Accessories", "Trendy"],
    whatsapp: "2348137595905",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/bellogo.jpg",
    image: "/bel1.jpg",
    images: ["/bel1.jpg", "/bel7.jpeg", "/bel3.jpg", "/bel6.jpeg", "/bel2.jpg", "/bel4.jpg", "/bel5.jpeg", "/bel10.jpeg"],
    verified: true
  },
  {
    id: "10",
    name: "Pretty Knot",
    category: "Handmade",
    initials: "PK",
    description: "Handmade jewelry and accessories. Unique pieces crafted with care and attention to detail.",
    tags: ["Jewelry", "Accessories", "Unique"],
    whatsapp: "2349115015516",
    accent: "from-amber-300/30 to-emerald-400/20",
    logo: "/amakalogo.jpeg",
    image: "/amaka1.jpeg",
    images: ["/amaka1.jpeg", "/amaka2.jpeg", "/amaka3.jpeg", "/amaka4.jpeg", "/amaka5.jpeg"],
  },
  {
    id: "11",
    name: "NANZZ_LUXURY",
    category: "Campus Drip",
    initials: "NL",
    description: "Abayas, jallabiyas, male and female shoes, handbags, jewelry, perfumes and unisex English wears.",
    tags: ["Abayas", "Jallabiyas", "Perfume"],
    whatsapp: "2349020376049",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/nanzzlogo.jpeg",
    image: "/nanzz2.jpeg",
    images: ["/nanzz3.jpeg", "/nanzz.jpeg", "/nanzz2.jpeg", "/nanzz1.jpeg"],
  },
  {
    id: "12",
    name: "KHADI BRAINDS & MORE",
    category: "Campus Drip",
    initials: "KB",
    description: "Trendy campus dresses - casual, dinner, weekend fits. Custom sizes + fast delivery.",
    tags: ["Clothing", "Hairstyle", "Trendy"],
    whatsapp: "2347073447864",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/khadilogo.jpeg",
    image: "/khadi1.jpeg",
    images: ["/khadi1.jpeg", "/khadi12.jpeg", "/khadi4.jpeg", "/khadi11.jpeg", "/khadi6.jpeg", "/khadi9.jpeg", "/khadi12.jpeg"],
  },
  {
    id: "13",
    name: "A.L.M OTAKU WEARS",
    category: "Campus Drip",
    initials: "AO",
    description: "Anime streetwear & merch - tees, hoodies, caps. Naruto, Demon Slayer, One Piece designs.",
    tags: ["AnimeCloth", "Streetwear", "Cosplay"],
    whatsapp: "2348054982024",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/zakilogo.jpeg",
    image: "/zaki1.jpeg",
    images: ["/zaki2.jpeg", "/zaki12.jpeg", "/zaki3.jpeg", "/zaki4.jpeg", "/zaki5.jpeg", "/zaki6.jpeg", "/zaki7.jpeg", "/zaki8.jpeg", "/zaki9.jpeg", "/zaki10.jpeg", "/zaki11.jpeg", "/zaki12.jpeg"],
  },
  {
    id: "14",
    name: "DRIP WITH KEL",
    category: "Campus Drip",
    initials: "DK",
    description: "Streetwear, wristwatches, Timberland boots & slippers/palms. Campus drip plug.",
    tags: ["Timberland", "Boots", "Watches", "Slippers", "Streetwear"],
    whatsapp: "2349122765942",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/kellogo.jpeg",
    image: "/kel1.jpeg",
    images: ["/kel1.jpeg", "/kel2.jpeg", "/kel3.jpeg", "/kel4.jpeg"],
  },
  {
    id: "15",
    name: "MATASHI",
    category: "Campus Drip",
    initials: "MT",
    description: "Traditional Hausa caps - embroidered, colored, plain. Fila, tangaran, campus styles.",
    tags: ["HausaCap", "Fila", "Tangaran", "TraditionalWear"],
    whatsapp: "2348029943729",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/matashilogo.jpeg",
    image: "/matashi2.jpg",
    images: ["/matashi3.jpg", "/matashi4.jpg", "/matashi5.jpg", "/matashi6.jpg"],
  },
  {
    id: "16",
    name: "Glow City",
    category: "Campus Drip",
    initials: "GC",
    description: "Luxury fabrics, perfumes, trendy shoes, bags & beauty essentials. Affordable + quality.",
    tags: ["Fabrics", "Perfumes", "Shoes", "Bags", "Beauty"],
    whatsapp: "2349012146029",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/glowlogo.jpg",
    image: "/glow1.jpg",
    images: ["/glow2.jpg", "/glow3.jpg", "/glow4.jpg", "/glow5.jpg"],
  },
  {
    id: "17",
    name: "Syms Souvenirs",
    category: "Handmade",
    initials: "SS",
    description: "Ribbons, kasko, veil pins & more for weddings, birthdays, parties. Make your day memorable.",
    tags: ["Ribbons", "Kasko", "VeilPins", "Souvenirs", "Wedding"],
    whatsapp: "2347061147976",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/symslogo.jpg",
    image: "/syms1.jpg",
    images: ["/syms1.jpg", "/syms3.jpg", "/syms2.jpg", "/syms4.jpg"],
  },
  {
    id: "18",
    name: "HAZO's Collection",
    category: "Campus Drip",
    initials: "HZ",
    description: "High-quality bedsheets and duvets, plus modest fashion items including hijabs, jalbabs, inner caps, and socks.",
    tags: ["Bedsheets", "Duvets", "Hijab", "ModestWear"],
    whatsapp: "2349060932856",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/hazologo.jpeg",
    image: "/hazo1.jpeg",
    images: ["/hazo1.jpeg", "/hazo2.jpeg", "/hazo3.jpeg", "/hazo4.jpeg"],
  },
  {
    id: "19",
    name: "BKD Art & General Printing",
    category: "Print & Copy",
    initials: "BKD",
    description: "Architectural drawings, graphics design, plastic ID cards, printing and online services. Shop 16, Backside. Open 8am–12pm.",
    tags: ["Graphics", "ID Card", "Photocopy"],
    whatsapp: "2348162831389",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/bkdlogo.jpg",
    image: "/bkdshop.jpg",
    images: ["/bkdshop.jpg"],
    verified: true,
  },
  {
    id: "20",
    name: "Alaminu Bookshop",
    category: "Print & Copy",
    initials: "AB",
    description: "Books, stationery, lab coats, calculators, pens, cleaners, key holders and tailoring services. Shop 46, Backside. Open 7am–10pm.",
    tags: ["Books", "Lab Coat", "Tailoring"],
    whatsapp: "2347067434367",
    accent: "from-rose-300/20 to-emerald-400/15",
    image: "/alaminu1.jpg",
    images: ["/alaminu1.jpg", "/alaminu3.jpg", "/alaminu4.jpg", "/alaminu5.jpg", "/alaminu6.jpg", "/alaminu7.jpg", "/alaminu8.jpg", "/alaminu9.jpg", "/alaminu10.jpeg"],
  },
  {
    id: "21",
    name: "Ibro Print",
    category: "Print & Copy",
    initials: "IP",
    description: "Printing, scanning, binding, passport photos, banners, stickers and online services. Shop 13, Backside. Open 9am–9pm.",
    tags: ["Printing", "Binding", "Graphics"],
    whatsapp: "2348137917452",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/ibrologo.jpg",
    image: "/ibroshop.jpg",
    images: ["/ibroshop.jpg"],
    verified: true,
  },
  {
    id: "22",
    name: "Yusuf Dankuda Communication",
    category: "Tech Plug",
    initials: "YDC",
    description: "Phone accessories at student-friendly prices. Earpieces, cases, powerbanks, chargers, headphones and MP3 players. Shop 37, Backside. Open 8am–12pm.",
    tags: ["Earpiece", "Powerbank", "Charger"],
    whatsapp: "2347038177322",
    accent: "from-emerald-400/30 to-cyan-400/10",
    image: "/yusufdankuda.jpg",
    images: ["/yusufdankuda.jpg", "/yusufdankuda1.jpg", "/yusufdankuda2.jpg", "/yusufdankuda3.jpg"],
    verified: true,
  },
  {
    id: "23",
    name: "Dedon Photo Studio",
    category: "Print & Copy",
    initials: "DS",
    description: "Professional passport photos and photocopy services on campus. Fast, affordable and reliable. Backside. Open 8am–10pm.",
    tags: ["Passport Photo", "Photocopy", "Studio"],
    whatsapp: "2348062661141",
    accent: "from-orange-300/25 to-emerald-400/15",
    image: "/dedonshop.jpg",
    images: ["/dedonshop.jpg"],
  },
  {
    id: "24",
    name: "Taves Kitchen",
    category: "Uni Eats",
    initials: "TK",
    description: "Jollof rice, fried rice, pasta, semo, eba, egusi soup, chicken stew, pepper soup and more. Hot meals delivered campus-wide. Opposite Baba Shoe Maker, Backside. Open 8am–4pm & 7pm–10pm.",
    tags: ["Jollof Rice", "Local Meals", "Delivery"],
    whatsapp: "2348064420724",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/taweslogo.jpg",
    image: "/tawes1.jpg",
    images: ["/tawes1.jpg", "/tawes2.jpg", "/tawes3.jpg", "/tawes4.jpg", "/tawes5.jpg"],
  },
  {
    id: "25",
    name: "High Speed Enterprises",
    category: "Print & Copy",
    initials: "HS",
    description: "Fast printing, scanning, photocopy, project binding and business services on campus. Backside. Open 8am–4pm & 7pm–10pm.",
    tags: ["Printing", "Binding", "Photocopy"],
    whatsapp: "2349121131739",
    accent: "from-cyan-400/25 to-emerald-400/15",
    image: "/highspeedshop.jpg",
    images: ["/highspeedshop.jpg"],
    verified: true,
  },
  {
    id: "26",
    name: "Dynamic Laundry Service",
    category: "Laundry",
    initials: "DL",
    description: "Professional washing and ironing for both male and female students. Clean clothes delivered back to you. Opposite Baba Shoe Maker, Backside. Open 8am–4pm & 7pm–10pm.",
    tags: ["Laundry", "Ironing", "Delivery"],
    whatsapp: "2348121697125",
    accent: "from-pink-400/20 to-emerald-400/20",
    image: "/dynamic1.jpg",
    images: ["/dynamic1.jpg", "/dynamic2.jpg", "/dynamic3.jpg", "/dynamic4.jpg"],
  },
  {
    id: "27",
    name: "Fresh Garri",
    category: "Uni Eats",
    initials: "FG",
    description: "Premium Ijebu Garri available in Dutse. Crunchy, smooth, no stone.",
    tags: ["Garri", "Ijebu Garri", "CampusDelivery"],
    whatsapp: "2348100511947",
    accent: "from-orange-300/25 to-emerald-400/15",
    image: "/freshgarri.jpg",
    images: ["/freshgarri.jpg"],
  },
  {
    id: "28",
    name: "Hauwerh's Delicacy",
    category: "Uni Eats",
    initials: "HD",
    description: "Snacks: meatpie, samosa, spring rolls, cupcakes, birthday cakes and fresh small chops — available for delivery & pickup.",
    tags: ["Meatpie", "Snacks", "SmallChops", "Cakes"],
    whatsapp: "2348029213590",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/hauwherlogo.jpg",
    image: "/hauwher1.jpg",
    images: ["/hauwher1.jpg", "/hauwher2.jpg", "/hauwher3.jpg"],
  },
  {
    id: "29",
    name: " BURSTING FLAVORS ",
    category: "Campus Drip",
    initials: "BF",
    description: "Custom cakes, cupcakes, birthday cakes & cake slices. Made fresh for campus events. Order 24hrs before.",
    tags: ["Cakes", "Cupcakes", "Birthday Cakes", "Cake Slices",],
    whatsapp: "2349160658322",
    accent: "from-cyan-400/25 to-emerald-400/15",
   
    image: "/burstinglogo.jpeg",
    images: ["/burstinglogo.jpeg",],
  },
  {
    id: "30",
    name: "feyy’s iStore",
    category: "Tech Plug",
    initials: "FI",
    description: "your go-to plug for 🇺🇸🇬🇧 Brand new / used iPhones, Samsung, pixels, iPads and lots more.",
    tags: ["Clothing", "Accessories", "Trendy"],
    whatsapp: "2348091060095",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/feyyslogo.jpeg",
    image: "/feyys1.jpeg",
    images: ["/feyys1.jpeg", "/feyys2.jpeg", "/feyys4.jpeg"],
    verified: false
  },
  {
    id: "31",
    name: "Marvie's collection (Home of aesthetics&lifestyle)",
    category: "Campus Drip",
    initials: "DK",
    description: "Trendy campus dresses - casual, dinner, weekend fits. Custom sizes + fast delivery.",
    tags: ["Clothes", "shoes", "Watches", "bags",],
    whatsapp: "2349067563686",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/marvieslogo.jpeg",
    image: "/marvies1.jpeg",
    images: ["/marvies1.jpeg", "/marvies2.jpeg", "/marvies3.jpeg", "/marvies4.jpeg"],
  },
  {
    id: "32",
    name: "Zee arewa treats and treasures",
    category: "uni eats",
    initials: "ZT",
    description: "Cakes, snacks & food orders. Necklaces, rings, watches & accessories. Onitsha + nationwide delivery. DM to order.",
    tags: ["Cakes", "Food Orders", "Necklaces", "Accessories"],
    whatsapp: "2349071340953",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/zee10.jpeg",
    image: "/zee11.jpeg",
    images: ["/zee11.jpeg", "/zee12.jpeg", "/zee13.jpeg", "/zee14.jpeg", "/zee15.jpeg", "/zee16.jpeg", "/zee17.jpeg", "/zee18.jpeg", "/zee19.jpeg", "/zee20.jpeg", "/zee21.jpeg", "/zee22.jpeg", "/zee23.jpeg", "/zee24.jpeg", "/zee25.jpeg", "/zee26.jpeg", "/zee27.jpeg", "/zee28.jpeg", "/zee29.jpeg", "/zee30.jpeg", "/zee1.jpeg", "/zee2.jpeg", "/zee3.jpeg", "/zee4.jpeg", "/zee5.jpeg", "/zee6.jpeg", "/zee7.jpeg", "/zee8.jpeg", "/zee9.jpeg"],
    verified: false,
  },
  {
    id: "33",
    name: "CJ'S CUT✂️",
    category: "Fresh Cuts",
    initials: "CC",
    description: "Fresh cuts, fades, line-ups, beard trims and hair designs. Professional barbering services on campus Block B male Hostel.",
    tags: ["Fresh Cuts", "Barbering"],
    whatsapp: "2348028246860",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/cjlogo.jpeg",
    image: "/cj1.jpeg",
    images: ["/cj1.jpeg",],
  },
  {
    id: "34",
    name: "Skay Production ",
    category: "Print & Copy",
    initials: "SP",
    description: "Social media designs, Flyer Design, 3D Logo Brochure, Business Card, invitation Card, Calendars, Customized Jotter, Customized Frameless and Frame, Customized Towels, Mugs and Throw Pillows etc",
    tags: ["Social Media Designs", "Flyer Design", "3D Logo Brochure", ],
    whatsapp: "2348039859215",
    accent: "from-rose-300/20 to-emerald-400/15",
    
    image: "/skaylogo.jpeg",
    images: ["/skaylogo.jpeg",],
  },
   {
    id: "35",
    name: "Sharp cut Barber 💈 ",
    category: "Fresh Cuts",
    initials: "SB",
    description: "Professional barbering services on campus Block A male Hostel Available days: Mondays to Sunday.",
    tags: ["Fresh Cuts", "Barbering"],
    whatsapp: "2349137817122",
    accent: "from-rose-300/20 to-emerald-400/15",
    
    image: "/sharp1.jpg",
    images: ["/sharp1.jpg", "/sharp2.jpg",],
  },
  {
    id: "36",
    name: "Jossy's empire",
    category: "Campus Drip",
    initials: "JE",
    description: "I sell vintage materials,packet shirt and short,tote bags and popcorn",
    tags: ["Vintage", "bags", "ModestWear"],
    whatsapp: "2349127151817",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/jossylogo.jpeg",
    image: "/jossy1.jpeg",
    images: ["/jossy1.jpeg", "/jossy2.jpeg", "/jossy3.jpeg", "/jossy4.jpeg"],
  },
];

const STATS = [
  { k: "28+", v: "Verified vendors" },
  { k: "7", v: "Categories" },
  { k: "4.9★", v: "Avg. campus rating" },
  { k: "< 30m", v: "Median response" },
];

// ── Emergency Contacts ──────────────────────────────────────────────────────
type EmergencyContact = {
  id: string;
  icon: string;
  category: string;
  name: string;
  role: string;
  number: string;
  priority?: boolean;
};

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "security",
    icon: "🚨",
    category: "Security / Safety Emergency",
    name: "SUG President",
    role: "Direct radio link to campus security",
    number: "07061892231",
    priority: true,
  },
  {
    id: "medical",
    icon: "🏥",
    category: "Medical Emergency",
    name: "SUG Health Director",
    role: "Clinic & first response",
    number: "08156272900",
  },
  {
    id: "general",
    icon: "📢",
    category: "General Assistance",
    name: "SUG PRO",
    role: "Public relations & info",
    number: "08144291758",
  },
  {
    id: "welfare",
    icon: "🤝",
    category: "Student Welfare",
    name: "SUG Welfare Director",
    role: "Student support & advocacy",
    number: "08133415133",
  },
];

// ── localStorage helpers ───────────────────────────────────────────────────────
function getRating(vendorId: string): number {
  try {
    return parseInt(localStorage.getItem(`fudhub_rating_${vendorId}`) || "0", 10);
  } catch {
    return 0;
  }
}
function saveRating(vendorId: string, rating: number) {
  try {
    localStorage.setItem(`fudHub_rating_${vendorId}`, String(rating));
  } catch {
    // ignore
  }
}

// ── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({ vendorId }: { vendorId: string }) {
  const [rating, setRating] = useState(() => getRating(vendorId));
  const [hovered, setHovered] = useState(0);

  const handleRate = (star: number) => {
    setRating(star);
    saveRating(vendorId, star);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
      <div style={{ fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Rate this vendor
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || rating);
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 2,
                fontSize: "1.4rem", lineHeight: 1,
                color: filled ? "#10b981" : "oklch(0.35 0.02 250)",
                transform: filled ? "scale(1.15)" : "scale(1)",
                transition: "all 0.15s ease",
                filter: filled ? "drop-shadow(0 0 6px rgba(16,185,129,0.6))" : "none",
              }}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >★</button>
          );
        })}
        {rating > 0 && (
          <span style={{ fontSize: "0.75rem", color: "#10b981", alignSelf: "center", marginLeft: 4, fontWeight: 600 }}>
            {rating}/5
          </span>
        )}
      </div>
    </div>
  );
}

// ── Emergency Panel ───────────────────────────────────────────────────────────
function EmergencyPanel({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("security");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 150,
        background: "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, #ef4444 22%, transparent), color-mix(in oklab, var(--background) 88%, transparent))",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: "480px", margin: "0 auto",
          background: "linear-gradient(180deg, color-mix(in oklab, var(--surface-elevated) 95%, transparent), color-mix(in oklab, var(--surface) 98%, transparent))",
          borderTop: "2px solid #ef4444",
          borderLeft: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)",
          borderRight: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -20px 60px -10px rgba(239,68,68,0.14)",
          overflow: "hidden",
          animation: "slideUp 0.3s cubic-bezier(0.2,0.8,0.2,1)",
          maxHeight: "92vh", overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "1.5rem 1.25rem 1rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ width: 44, height: 44, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", background: "linear-gradient(135deg, #f87171, #ef4444)", boxShadow: "0 8px 24px -10px rgba(239,68,68,0.7)", flexShrink: 0 }}>🚨</span>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--foreground)", lineHeight: 1.2 }}>Emergency Help</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 2 }}>Tap to reveal a number, then press Call Now.</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "color-mix(in oklab, var(--foreground) 6%, transparent)", border: "1px solid color-mix(in oklab, var(--foreground) 10%, transparent)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--foreground)", fontSize: "1rem", flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: "0.5rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {EMERGENCY_CONTACTS.map((c) => {
            const isOpen = expanded === c.id;
            const isPriority = c.priority;
            return (
              <div key={c.id} style={{ borderRadius: 16, background: isPriority ? "linear-gradient(180deg, rgba(239,68,68,0.14), rgba(239,68,68,0.05))" : "color-mix(in oklab, var(--foreground) 4%, transparent)", border: isPriority ? "1px solid #ef4444" : isOpen ? "1px solid color-mix(in oklab, var(--foreground) 20%, transparent)" : "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)", boxShadow: isPriority ? "0 10px 40px -20px rgba(239,68,68,0.7)" : "none", transition: "border-color 0.2s ease" }}>
                <button onClick={() => setExpanded(isOpen ? null : c.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "1rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.15rem", background: isPriority ? "linear-gradient(135deg, #f87171, #ef4444)" : "color-mix(in oklab, var(--foreground) 6%, transparent)", border: isPriority ? "none" : "1px solid color-mix(in oklab, var(--foreground) 10%, transparent)" }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", color: isPriority ? "#fecaca" : "var(--foreground)", lineHeight: 1.3 }}>{c.category}</span>
                      {isPriority && <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 6px", borderRadius: 6, background: "rgba(255,255,255,0.15)", color: "#fff" }}>Priority</span>}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: 2 }}>{c.name} · {c.role}</div>
                  </div>
                  <span style={{ fontSize: "1rem", color: "var(--muted-foreground)", opacity: 0.7, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>⌄</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 1rem 1rem", animation: "fadeIn 0.18s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0.6rem 0.875rem", borderRadius: 10, marginBottom: 12, background: "color-mix(in oklab, var(--background) 60%, transparent)", border: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)" }}>
                      <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>Phone</span>
                      <span style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "var(--foreground)" }}>{c.number}</span>
                    </div>
                    <a href={`tel:${c.number}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "0.8rem", background: "linear-gradient(135deg, #f87171, #ef4444)", color: "white", fontWeight: 700, fontSize: "0.9rem", borderRadius: 12, border: "none", textDecoration: "none", boxShadow: "0 10px 30px -10px rgba(239,68,68,0.7)" }}>📞 Call Now</a>
                  </div>
                )}
              </div>
            );
          })}
          <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", textAlign: "center", marginTop: 4, lineHeight: 1.5 }}>
            Contacts provided by FUD SUG &amp; verified by the Dean of Student Affairs. In a life-threatening emergency, also dial <strong style={{ color: "var(--foreground)" }}>112</strong>.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ── Keke FAB ──────────────────────────────────────────────────────────────────
function KekeFAB() {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <button onClick={() => setShowPopup(true)} aria-label="Keke Delivery - Coming Soon" style={{ position: "fixed", bottom: 28, right: 24, zIndex: 90, width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10b981)", border: "2px solid rgba(16,185,129,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", animation: "kekePulse 2s infinite" }}>🛺</button>
      {showPopup && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease" }} onClick={() => setShowPopup(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "oklch(0.18 0.02 250)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 24, padding: "2rem 2rem 1.75rem", maxWidth: 320, width: "calc(100% - 48px)", textAlign: "center", boxShadow: "0 0 60px -10px rgba(16,185,129,0.4)", animation: "popIn 0.3s cubic-bezier(0.2,0.8,0.2,1)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🛺</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "oklch(0.97 0.01 180)", marginBottom: "0.5rem", fontFamily: "var(--font-display, sans-serif)" }}>Keke Delivery</div>
            <div style={{ display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 999, padding: "3px 14px", fontSize: "0.7rem", color: "#10b981", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>Coming Soon</div>
            <p style={{ fontSize: "0.875rem", color: "oklch(0.65 0.02 250)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Campus-wide keke delivery is on its way. Order from any FUD Hub vendor and get it dropped right at your hostel door. 🚀</p>
            <button onClick={() => setShowPopup(false)} style={{ background: "#10b981", color: "#0a1a14", border: "none", borderRadius: 12, padding: "0.75rem 2rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", width: "100%", boxShadow: "0 0 24px -6px rgba(16,185,129,0.6)" }}>Got it, can't wait!</button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes kekePulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); } 70% { box-shadow: 0 0 0 14px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const observe = () => { document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible), .reveal-slide:not(.is-visible)").forEach((el) => io.observe(el)); };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); document.documentElement.classList.remove("reveal-ready"); };
  }, []);
}

// ── Vendor Modal ──────────────────────────────────────────────────────────────
function VendorModal({ business, onClose }: { business: Business; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const images = business.images || (business.image ? [business.image] : []);
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", background: "oklch(0.18 0.02 250)", borderRadius: "24px 24px 0 0", border: "1px solid color-mix(in oklab, oklch(0.72 0.21 152) 20%, transparent)", overflow: "hidden", animation: "slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1)", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
              {business.logo ? (
                <img src={business.logo} alt={business.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "oklch(0.22 0.022 250)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "oklch(0.85 0.22 158)", flexShrink: 0 }}>{business.initials}</div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.62 0.02 250)", background: "oklch(0.96 0.01 180 / 0.06)", border: "1px solid oklch(0.96 0.01 180 / 0.08)", borderRadius: 999, padding: "3px 8px" }}>{business.category}</span>
                  {business.verified && (
                    <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--emerald-bright)", background: "color-mix(in oklab, var(--emerald-glow) 15%, transparent)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>✓ Verified by EMBIEM</span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "oklch(0.97 0.01 180)", lineHeight: 1.25, marginTop: 6 }}>{business.name}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "oklch(0.26 0.025 250)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "oklch(0.97 0.01 180)", fontSize: "1rem", flexShrink: 0 }}>✕</button>
          </div>
        </div>

        {/* Image gallery */}
        {images.length > 0 && (
          <div style={{ position: "relative", margin: "0.75rem 1.25rem" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "oklch(0.22 0.022 250)", position: "relative" }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img key={current} src={images[current]} alt={`${business.name} ${current + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", animation: "fadeIn 0.3s ease" }} />
              {images.length > 1 && (
                <>
                  <button onClick={prev} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "white", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                  <button onClick={next} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 36, height: 36, color: "white", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 999, background: i === current ? "oklch(0.85 0.22 158)" : "oklch(0.4 0.02 250)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <div style={{ textAlign: "center", fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", marginTop: 4 }}>{current + 1} / {images.length}</div>
            )}
          </div>
        )}

        {/* Info */}
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <p style={{ fontSize: "0.9rem", color: "oklch(0.75 0.02 250)", lineHeight: 1.65, marginBottom: "0.875rem" }}>{business.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
            {business.tags.map((t) => (
              <span key={t} style={{ padding: "4px 12px", background: "oklch(0.22 0.022 250)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, fontSize: "0.75rem", color: "oklch(0.75 0.02 250)" }}>{t}</span>
            ))}
          </div>
          <StarRating vendorId={business.id} />
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "0.875rem", background: "oklch(0.78 0.19 155)", color: "oklch(0.15 0.02 250)", fontWeight: 700, fontSize: "0.9375rem", borderRadius: 14, border: "none", textDecoration: "none", boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Order via WhatsApp
          </a>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ lightMode, onToggle, onSOS }: { lightMode: boolean; onToggle: () => void; onSOS: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
            <img src="/embiem-logo.png" alt="EMBIEM" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">FUD Hub</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#directory" className="hover:text-foreground transition-colors" style={{ textDecoration: "none" }}>Directory</a>
          <a href="#stats" className="hover:text-foreground transition-colors" style={{ textDecoration: "none" }}>Numbers</a>
          <a href="#embiem" className="hover:text-foreground transition-colors" style={{ textDecoration: "none" }}>For Founders</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onToggle} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", background: "color-mix(in oklab, var(--foreground) 6%, transparent)", border: "1px solid color-mix(in oklab, var(--foreground) 10%, transparent)", borderRadius: 10, cursor: "pointer", lineHeight: 1, flexShrink: 0 }} aria-label="Toggle light/dark mode">
            {lightMode ? "🌙" : "☀️"}
          </button>
          <button onClick={onSOS} style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.02em", color: "white", background: "#ef4444", border: "none", padding: "8px 13px", borderRadius: 10, cursor: "pointer", flexShrink: 0 }} aria-label="Emergency SOS">
            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "white", opacity: 0.7, animation: "sosPing 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "white" }} />
            </span>
            SOS
          </button>
        </div>
      </div>
      <style>{`@keyframes sosPing { 75%, 100% { transform: scale(2.4); opacity: 0; } }`}</style>
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
          Live · 28+ student vendors on campus
        </div>
         <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.02] tracking-tight">
  Discover & order from <br />
  <span className="text-gradient-emerald">FUD vendors.</span>
</h1>
        <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
       Food, fashion, tech, print — all student-run. One tap away on WhatsApp.
            </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#directory" style={{ textDecoration: "none" }} className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)] transition-shadow">
            Browse the Hub <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a href="#embiem" style={{ textDecoration: "none" }} className="text-foreground inline-flex items-center gap-2 rounded-full glow-border bg-surface px-5 py-3 text-sm font-medium hover:bg-surface-elevated transition-colors">
            List your business
          </a>
        </div>
      </div>

      <div id="embiem" className="reveal-slide relative overflow-hidden rounded-2xl border border-emerald-glow/30 bg-gradient-to-br from-surface-elevated to-surface p-6 sm:p-8 shadow-[0_0_40px_-12px_rgba(0,0,0,0.5)]" style={{ marginTop: "4.5rem" }}>
        <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-bright mb-2">Built by EMBIEM</div>
          <h2 className="text-xl sm:text-2xl font-display font-semibold leading-snug tracking-tight">
            Your Campus. Your Vendors <span className="text-gradient-emerald">Engineered by EMBIEM.</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
  Built for FUD students, by FUD students. EMBIEM designs and runs FUD Hub — from onboarding vendors to keeping it running.
          </p>
         <a href={`https://wa.me/2347044389234?text=${encodeURIComponent("Hi EMBIEM! I'd like to list my business on FUD Hub.")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)] transition-shadow">
            Add your business to FUD Hub →
          </a>
        </div>
      </div>

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
      <div className="reveal glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-3.5-3.5" />
          </svg>
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search pastries, tailors, tech repair..." className="w-full bg-surface/60 border text-foreground rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-emerald-glow transition" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {CATEGORIES.map((c) => {
            const isActive = c === active;
            return (
              <button key={c} onClick={() => onActive(c)} style={{ padding: "8px 16px", borderRadius: 999, fontSize: "0.8125rem", fontWeight: isActive ? 600 : 400, cursor: "pointer", transition: "all 0.25s ease", border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)", background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)", color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)", boxShadow: isActive ? "0 0 24px -6px oklch(0.72 0.21 152)" : "none", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.92 0.01 180)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.4)"; } }}
                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.65 0.02 250)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; } }}
              >{c}</button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ business, index, onOpen }: { business: Business; index: number; onOpen: () => void }) {
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;
  return (
    <article className="reveal group relative glass-card rounded-2xl p-6 flex flex-col hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--emerald-glow),55%,transparent)] hover:border-emerald-glow/60" style={{ transitionDelay: `${(index % 9) * 40}ms` }}>
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${business.accent} pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-3 cursor-pointer" onClick={onOpen}>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 glow-border bg-surface place-items-center grid rounded-xl shrink-0 overflow-hidden">
            {business.logo ? (
              <img src={business.logo} alt={business.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span className="text-gradient-emerald font-display text-lg font-bold tracking-tight">{business.initials}</span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">{business.category}</span>
        </div>
        {business.verified && (
          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--emerald-bright)", background: "color-mix(in oklab, var(--emerald-glow) 15%, transparent)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap", flexShrink: 0 }}>✓ Verified</span>
        )}
      </div>
      <div className="relative mt-4 flex-1 cursor-pointer" onClick={onOpen}>
        <h3 className="text-xl font-display font-semibold leading-snug tracking-tight">{business.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {business.tags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 text-muted-foreground bg-surface/60">{t}</span>
          ))}
        </div>
      </div>
      <div className="reveal-slide relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-surface-elevated to-surface cursor-pointer" style={{ transitionDelay: `${(index % 9) * 60 + 120}ms` }} onClick={onOpen}>
        {business.image ? (
          <img src={business.image} alt={`${business.name} product`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-linear-gradient(45deg, color-mix(in oklab, var(--emerald-glow) 8%, transparent) 0 1px, transparent 1px 14px)" }} />
            <div className="relative flex flex-col items-center gap-2 text-center p-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-bright/70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="m21 17-5-5-8 8" /></svg>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">No Photo Yet</span>
            </div>
          </div>
        )}
        {business.images && business.images.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "3px 10px", fontSize: "0.7rem", color: "white", backdropFilter: "blur(4px)" }}>+{business.images.length - 1} more</div>
        )}
      </div>
      <div className="relative mt-5 pt-5 border-t border-border/70">
        <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-400 shadow-[0_0_24px_-6px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          Order via WhatsApp
        </a>
      </div>
    </article>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
function Grid({ items, onOpen }: { items: Business[]; onOpen: (b: Business) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">No vendors match that search. Try another category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((b, i) => <Card key={b.id} business={b} index={i} onOpen={() => onOpen(b)} />)}
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
  const [lightMode, setLightMode] = useState(false);
  useReveal();
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Business | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESSES.filter((b) => {
      const matchCat = active === "All" || b.category === active;
      const matchQ = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: lightMode ? "#f8fafc" : undefined, color: lightMode ? "#0a0f1a" : undefined }}>
      <Nav lightMode={lightMode} onToggle={() => setLightMode(!lightMode)} onSOS={() => setShowEmergency(true)} />
      <Hero />
      <Controls active={active} onActive={setActive} query={query} onQuery={setQuery} />
      <Grid items={filtered} onOpen={setSelectedVendor} />
      <Stats />
      {selectedVendor && <VendorModal business={selectedVendor} onClose={() => setSelectedVendor(null)} />}
      {showEmergency && <EmergencyPanel onClose={() => setShowEmergency(false)} />}
      <KekeFAB />
    </div>
  );
}
