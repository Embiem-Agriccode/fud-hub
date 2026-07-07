import { useEffect, useMemo, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type VerifiedSale = {
  id: string;
  // A single combined screenshot: WhatsApp order chat + payment receipt + delivery confirmation.
  image: string;
};

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
  deal?: boolean;
  dealLabel?: string;
  verifiedSales?: VerifiedSale[];
};

type Department = "Fisheries" | "Animal Science" | "Crop Science";

type AgriProduct = {
  id: string;
  name: string;
  department: Department;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  description: string;
};

type ToastTone = "success" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };
type Tab = "vendors" | "agri" | "management";

type Audience = "Students" | "Vendors" | "Keke Operators" | "Senate";
type Broadcast = {
  id: string;
  message: string;
  audiences: Audience[];
  createdAt: number;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Uni Eats", "Campus Drip", "Fresh Cuts", "Tech Plug", "Laundry", "Home & Life", "Print & Copy", "Data & Airtime"] as const;
const DEPARTMENTS: Department[] = ["Fisheries", "Animal Science", "Crop Science"];
const AUDIENCE_OPTIONS: { id: Audience; label: string; icon: string }[] = [
  { id: "Students", label: "Students", icon: "🎓" },
  { id: "Vendors", label: "Vendors", icon: "🛍️" },
  { id: "Keke Operators", label: "Keke Operators", icon: "🛺" },
  { id: "Senate", label: "Senate", icon: "🏛️" },
];

// Faculty of Agriculture farm order line — update to the real farm desk number.
const FARM_WHATSAPP = "2348012345678";
// Rotate this PIN whenever farm management staff changes.
const MANAGEMENT_PIN = "2468";

const BUSINESSES: Business[] = [
  {
    id: "4",
    name: "Maroonette Creates",
    category: "Home & Life",
    initials: "MC",
    description: "A creative brand built on passion, innovation, and the art bringing ideas to life.",
    tags: ["Crochet", "Wearable Art", "Aesthetics", "Handmade"],
    whatsapp: "2348086816625",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/maroonettelogo.jpg",
    image: "/maroonette1.jpg",
    images: ["/maroonette1.jpg", "/maroonette2.jpg", "/maroonette3.jpg", "/maroonette4.jpg", "/maroonette5.jpg", "/maroonette6.jpg", "/maroonette7.jpg"],
    verified: true,
    deal: true,
    dealLabel: "20% Off",
  },
  {
    id: "7",
    name: "Dizzorh.inc",
    category: "Home & Life",
    initials: "DI",
    description: "Handmade epoxy resin art - custom coasters, Home Decor.",
    tags: ["ResinArt", "Home Decor", "Vases", "Coasters", "Handmade"],
    whatsapp: "2347069421830",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/dizzorhlogo.jpg",
    image: "/dizzorh2.jpg",
    images: ["/dizzorh2.jpg", "/dizzorh3.jpg", "/dizzorh4.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "3",
    name: "Bel's Closet",
    category: "Campus Drip",
    initials: "BC",
    description: "Affordable, trendy clothing and accessories for students. Curated styles to elevate your campus wardrobe.",
    tags: ["Clothing", "Accessories", "Trendy", "Fashion", "Campus"],
    whatsapp: "2348137595905",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/bellogo.jpg",
    image: "/bel7.jpeg",
    images: ["/bel7.jpeg", "/bel1.jpeg", "/bel3.jpg", "/bel6.jpeg", "/bel2.jpg", "/bel4.jpg", "/bel5.jpeg", "/bel10.jpeg"],
    verified: true,
    deal: true,
    verifiedSales: [
      { id: "bc-vs1", image: "/bel1.jpeg" }
    ],
  },
  {
    id: "5",
    name: "Pretty Knot",
    category: "Home & Life",
    initials: "PK",
    description: "Handmade jewelry and accessories. Unique pieces crafted with care and attention to detail.",
    tags: ["Jewelry", "Accessories", "Beads", "Unique", "Handmade"],
    whatsapp: "2349115015516",
    accent: "from-amber-300/30 to-emerald-400/20",
    logo: "/amakalogo.jpeg",
    image: "/amaka1.jpeg",
    images: ["/amaka1.jpeg", "/amaka2.jpeg", "/amaka3.jpeg", "/amaka4.jpeg", "/amaka5.jpeg"],
    verified: true,
    deal: true,
  },
  {
    id: "1",
    name: "Everything Mata",
    category: "Campus Drip",
    initials: "EM",
    description: "Curated beauty and self-care products for elegant living. Skincare essentials delivered to your door.",
    tags: ["Skincare", "Self Care", "Beauty", "Cream", "Essentials"],
    whatsapp: "2349139294346",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/matalogo.jpg",
    image: "/mata1.jpg",
    images: ["/mata1.jpg", "/mata2.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "2",
    name: "Shop with Lola",
    category: "Campus Drip",
    initials: "SL",
    description: "Soft, simple and affordable campus essentials — scrunchies, camisoles, sunglasses, hand cream and more.",
    tags: ["Accessories", "Camisoles", "Skincare", "Scrunchies", "Sunglasses"],
    whatsapp: "2347046998187",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/lolalogo.jpg",
    image: "/lola1.jpg",
    images: ["/lola1.jpg", "/lola2.jpg", "/lola3.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "6",
    name: "Timas Delight",
    category: "Uni Eats",
    initials: "TD",
    description: "Shawarma, mandi rice, milkshakes, mocktails and fresh small chops — campus comfort food done right.",
    tags: ["Shawarma", "Milkshakes", "Snacks", "Mocktails", "MandRice"],
    whatsapp: "2347026356625",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/temaslogo.jpg",
    image: "/temas1.jpg",
    images: ["/temas1.jpg", "/temas2.jpg", "/temas3.jpg", "/temas4.jpg", "/temas5.jpg"],
    verified: true,
    deal: true,
    dealLabel: "20% Off",
    
  },
  {
    id: "8",
    name: "Jossy's Empire",
    category: "Campus Drip",
    initials: "JE",
    description: "Vintage materials, packet shirts and shorts, tote bags and popcorn.",
    tags: ["Vintage", "Tote Bags", "Shirts", "Fashion", "Popcorn"],
    whatsapp: "2349127151817",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/jossylogo.jpeg",
    image: "/jossy1.jpeg",
    images: ["/jossy1.jpeg", "/jossy2.jpeg", "/jossy3.jpeg", "/jossy4.jpeg"],
    verified: true,
    deal: true,
  },
  {
    id: "9",
    name: "10 Digit Integrated Service",
    category: "Uni Eats",
    initials: "DIS",
    description: "Sells affordable, crispy small chops + snacks. Natural ingredients, 100% homemade.",
    tags: ["Zobo", "Samosa", "PuffPuff", "Small Chops", "Snacks"],
    whatsapp: "2347031955575",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/10 logo.jpg",
    image: "/10 1.jpg",
    images: ["/10 1.jpg", "/10 2.jpg", "/10 3.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "10",
    name: "Deerjah Leeyu's",
    category: "Campus Drip",
    initials: "DI",
    description: "Abaya, jersey veils, hand sleeves, socks, perfume, brooches, and different types of veils and hijab.",
    tags: ["Abaya", "Hijab", "Hand Sleeve", "Perfume", "Veils"],
    whatsapp: "2347061435338",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "/deerjahlogo.jpg",
    image: "/deerjah1.jpg",
    images: ["/deerjah1.jpg", "/deerjah4.jpg", "/deerjah2.jpg", "/deerjah5.jpg", "/deerjah3.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "36",
    name: "Shaffy's Treats",
    category: "Uni Eats",
    initials: "ST",
    description: "Handmade cakes, glazed doughnuts and crispy small chops made fresh to order. Every bite tells the story.",
    tags: ["Cakes", "Doughnuts", "Small Chops", "Pastries", "Homemade"],
    whatsapp: "2348026498451",
    accent: "from-amber-300/30 to-emerald-400/20",
    logo: "/shaffyslogo.jpg",
    image: "/shaffys1.jpg",
    images: ["/shaffys1.jpg", "/shaffys2.jpg", "/shaffys3.jpg", "/shaffys4.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "11",
    name: "NANZZ_LUXURY",
    category: "Campus Drip",
    initials: "NL",
    description: "Abayas, jallabiyas, male and female shoes, handbags, jewelry, perfumes and unisex English wears.",
    tags: ["Abayas", "Jallabiyas", "Perfume", "Shoes", "Handbags"],
    whatsapp: "2349020376049",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/nanzzlogo.jpeg",
    image: "/nanzz2.jpeg",
    images: ["/nanzz3.jpeg", "/nanzz.jpeg", "/nanzz2.jpeg", "/nanzz1.jpeg"],
    deal: true,
  },
  {
    id: "12",
    name: "KHADI BRAINDS & MORE",
    category: "Campus Drip",
    initials: "KB",
    description: "Trendy campus dresses - casual, dinner, weekend fits. Custom sizes + fast delivery.",
    tags: ["Clothing", "Dresses", "Trendy", "Custom", "Fashion"],
    whatsapp: "2347073447864",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/khadilogo.jpeg",
    image: "/khadi1.jpeg",
    images: ["/khadi1.jpeg", "/khadi12.jpeg", "/khadi4.jpeg", "/khadi11.jpeg", "/khadi6.jpeg", "/khadi9.jpeg"],
  },
  {
    id: "13",
    name: "A.L.M OTAKU WEARS",
    category: "Campus Drip",
    initials: "AO",
    description: "Anime streetwear & merch - tees, hoodies, caps. Naruto, Demon Slayer, One Piece designs.",
    tags: ["Anime", "Streetwear", "Hoodies", "Naruto", "Cosplay"],
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
    deal: true,
  },
  {
    id: "59",
    name: "KHALCARE DATAPLUG",
    category: "Data & Airtime",
    initials: "KD",
    description: "Affordable Data + Airtime + bill payments + Utility Bills, Fast and Reliable",
    tags: ["Data", "Airtime", "Bill", "Airtel", "Glo", "9mobile"],
    whatsapp: "2348128795646",
    accent: "from-cyan-400/25 to-emerald-400/15",
    logo: "",
    image: "",
  },
  {
    id: "15",
    name: "MATASHI",
    category: "Campus Drip",
    initials: "MT",
    description: "Traditional Hausa caps - embroidered, colored, plain. Fila, tangaran, campus styles.",
    tags: ["HausaCap", "Fila", "Tangaran", "Traditional", "Caps"],
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
    category: "Home & Life",
    initials: "SS",
    description: "Ribbons, kasko, veil pins & more for weddings, birthdays, parties. Make your day memorable.",
    tags: ["Ribbons", "Kasko", "VeilPins", "Wedding", "Souvenirs"],
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
    tags: ["Bedsheets", "Duvets", "Hijab", "ModestWear", "Jalbab"],
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
    tags: ["Graphics", "ID Card", "Photocopy", "Printing", "Design"],
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
    tags: ["Books", "Lab Coat", "Stationery", "Tailoring", "Calculator"],
    whatsapp: "2347067434367",
    accent: "from-rose-300/20 to-emerald-400/15",
    image: "/alaminu1.jpg",
    images: ["/alaminu1.jpg", "/alaminu3.jpg", "/alaminu4.jpg", "/alaminu5.jpg", "/alaminu6.jpg", "/alaminu7.jpg", "/alaminu8.jpg", "/alaminu9.jpg", "/alaminu10.jpeg"],
    deal: true,
  },
  {
    id: "21",
    name: "Ibro Print",
    category: "Print & Copy",
    initials: "IP",
    description: "Printing, scanning, binding, passport photos, banners, stickers and online services. Shop 13, Backside. Open 9am–9pm.",
    tags: ["Printing", "Binding", "Scanning", "Passport Photo", "Banners"],
    whatsapp: "2348137917452",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/ibrologo.jpg",
    image: "/ibroshop.jpg",
    images: ["/ibroshop.jpg"],
    verified: true,
    deal: true,
  },
  {
    id: "22",
    name: "Yusuf Dankuda Communication",
    category: "Tech Plug",
    initials: "YDC",
    description: "Phone accessories at student-friendly prices. Earpieces, cases, powerbanks, chargers, headphones and MP3 players. Shop 37, Backside. Open 8am–12pm.",
    tags: ["Earpiece", "Powerbank", "Charger", "Headphones", "Phone Case"],
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
    tags: ["Passport Photo", "Photocopy", "Studio", "Printing", "ID Photo"],
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
    description: "Jollof rice, fried rice, pasta, semo, eba, egusi soup, chicken stew, pepper soup and more. Hot meals delivered campus-wide.",
    tags: ["Jollof Rice", "Local Meals", "Delivery", "Eba", "Egusi"],
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
    tags: ["Printing", "Binding", "Photocopy", "Scanning", "Projects"],
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
    description: "Professional washing and ironing for both male and female students. Clean clothes delivered back to you.",
    tags: ["Laundry", "Ironing", "Delivery", "Washing", "Clothes"],
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
    tags: ["Garri", "Ijebu Garri", "Food", "Delivery", "Snacks"],
    whatsapp: "2348100511947",
    accent: "from-orange-300/25 to-emerald-400/15",
    image: "/freshgarri.jpg",
    images: ["/freshgarri.jpg"],
    deal: true,
  },
  {
    id: "28",
    name: "Hauwerh's Delicacy",
    category: "Uni Eats",
    initials: "HD",
    description: "Snacks: meatpie, samosa, spring rolls, cupcakes, birthday cakes and fresh small chops — available for delivery & pickup.",
    tags: ["Meatpie", "Samosa", "Cakes", "Small Chops", "Snacks"],
    whatsapp: "2348029213590",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/hauwherlogo.jpg",
    image: "/hauwher1.jpg",
    images: ["/hauwher1.jpg", "/hauwher2.jpg", "/hauwher3.jpg"],
  },
  {
    id: "29",
    name: "BURSTING FLAVORS",
    category: "Uni Eats",
    initials: "BF",
    description: "Custom cakes, cupcakes, birthday cakes & cake slices. Made fresh for campus events. Order 24hrs before.",
    tags: ["Cakes", "Cupcakes", "Birthday Cakes", "Pastries", "Events"],
    whatsapp: "2349160658322",
    accent: "from-cyan-400/25 to-emerald-400/15",
    image: "/burstinglogo.jpeg",
    images: ["/burstinglogo.jpeg"],
  },
  {
    id: "30",
    name: "feyy's iStore",
    category: "Tech Plug",
    initials: "FI",
    description: "Your go-to plug for 🇺🇸🇬🇧 brand new / used iPhones, Samsung, Pixels, iPads and lots more.",
    tags: ["iPhone", "Samsung", "iPad", "UK-Used", "Phones"],
    whatsapp: "2348091060095",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/feyyslogo.jpeg",
    image: "/feyys1.jpeg",
    images: ["/feyys1.jpeg", "/feyys2.jpeg", "/feyys4.jpeg"],
    deal: true,
  },
  {
    id: "31",
    name: "Marvie's Collection",
    category: "Campus Drip",
    initials: "MC",
    description: "Trendy campus dresses - casual, dinner, weekend fits. Clothes, shoes, watches, bags. Custom sizes + fast delivery.",
    tags: ["Clothes", "Shoes", "Watches", "Bags", "Fashion"],
    whatsapp: "2349067563686",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/marvieslogo.jpeg",
    image: "/marvies1.jpeg",
    images: ["/marvies1.jpeg", "/marvies2.jpeg", "/marvies3.jpeg", "/marvies4.jpeg"],
  },
  {
    id: "32",
    name: "Zee Arewa Treats & Treasures",
    category: "Uni Eats",
    initials: "ZT",
    description: "Cakes, snacks & food orders. Necklaces, rings, watches & accessories. DM to order.",
    tags: ["Cakes", "Food", "Necklaces", "Accessories", "Snacks"],
    whatsapp: "2349071340953",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/zee10.jpeg",
    image: "/zee11.jpeg",
    images: ["/zee11.jpeg", "/zee12.jpeg", "/zee13.jpeg", "/zee14.jpeg", "/zee15.jpeg", "/zee1.jpeg", "/zee2.jpeg", "/zee3.jpeg"],
  },
  {
    id: "33",
    name: "CJ's Cut ✂️",
    category: "Fresh Cuts",
    initials: "CC",
    description: "Fresh cuts, fades, line-ups, beard trims and hair designs. Professional barbering on campus — Block B Male Hostel.",
    tags: ["Haircut", "Fade", "Lineup", "Beard Trim", "Barber"],
    whatsapp: "2348028246860",
    accent: "from-rose-300/20 to-emerald-400/15",
    logo: "/cjlogo.jpeg",
    image: "/cj1.jpeg",
    images: ["/cj1.jpeg"],
  },
  {
    id: "34",
    name: "Skay Production",
    category: "Print & Copy",
    initials: "SP",
    description: "Social media designs, flyer design, 3D logo, brochure, business card, calendars, customized frames, towels, mugs and throw pillows.",
    tags: ["Flyer Design", "Logo", "Social Media", "Business Card", "Graphics"],
    whatsapp: "2348039859215",
    accent: "from-rose-300/20 to-emerald-400/15",
    image: "/skaylogo.jpeg",
    images: ["/skaylogo.jpeg"],
  },
  {
    id: "35",
    name: "Sharp Cut Barber 💈",
    category: "Fresh Cuts",
    initials: "SB",
    description: "Professional barbering on campus — Block A Male Hostel. Available Monday to Sunday.",
    tags: ["Haircut", "Fade", "Lineup", "Barber", "Shave"],
    whatsapp: "2349137817122",
    accent: "from-rose-300/20 to-emerald-400/15",
    image: "/sharp1.jpg",
    images: ["/sharp1.jpg", "/sharp2.jpg"],
    deal: true,
  },
  {
    id: "37",
    name: "Jenny Girly Essentials",
    category: "Campus Drip",
    initials: "JG",
    description: "Your campus girly plug. Facial masks, eye masks, lip masks, earrings & female jewelry. Fast, affordable and reliable.",
    tags: ["Face Mask", "Eye Mask", "Earrings", "Jewelry", "Skincare"],
    whatsapp: "2348073567336",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/jennygirl4.jpeg",
    image: "/jennygirl1.jpeg",
    images: ["/jennygirl1.jpeg", "/jennygirl3.jpeg", "/jennygirl2.jpeg"],
  },
  {
    id: "38",
    name: "AY Tech",
    category: "Print & Copy",
    initials: "AY",
    description: "We print, make school projects, business posters, graphics design, website design and many more.",
    tags: ["Printing", "Graphics", "Website", "Poster", "Design"],
    whatsapp: "2349037636389",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/alameenyahyalogo.jpeg",
    image: "/alameenyahya1.jpeg",
    images: ["/alameenyahya1.jpeg"],
  },
  {
    id: "39",
    name: "Isha",
    category: "Uni Eats",
    initials: "I",
    description: "Bakes fresh cakes, birthday cakes, popcorn & bobo. Campus treats plug. Sweet, affordable, and reliable.",
    tags: ["Cake", "Birthday Cake", "Popcorn", "Bobo", "Pastries"],
    whatsapp: "2348121131015",
    accent: "from-pink-400/20 to-emerald-400/20",
    logo: "/aishalogo.jpeg",
    image: "/aisha1.jpeg",
    images: ["/aisha1.jpeg", "/aisha2.jpeg", "/aisha3.jpeg", "/aisha4.jpeg", "/aisha5.jpeg", "/aisha6.jpeg", "/aisha7.jpeg", "/aisha8.jpeg", "/aisha9.jpeg", "/aisha10.jpeg"],
    deal: true,
  },
  {
    id: "40",
    name: "Habbie Fit",
    category: "Campus Drip",
    initials: "HF",
    description: "Affordable female flat shoes and nightwear. Crispy, comfortable campus fits.",
    tags: ["Flat Shoes", "Nightwear", "Female Fashion", "Shoes", "Slippers"],
    whatsapp: "2348061949293",
    accent: "from-orange-300/25 to-emerald-400/15",
    logo: "/habbielogo.jpeg",
    image: "/habbie1.jpeg",
    images: ["/habbie1.jpeg", "/habbie2.jpeg", "/habbie3.jpeg"],
  },
];

const STATS = [
  { k: "40+", v: "Verified vendors" },
  { k: "8", v: "Categories" },
  { k: "4.9★", v: "Avg. campus rating" },
  { k: "< 30m", v: "Median response" },
];

const INITIAL_AGRI_PRODUCTS: AgriProduct[] = [
  {
    id: "agri-1",
    name: "Fresh Faculty Catfish",
    department: "Fisheries",
    price: 2500,
    unit: "kg",
    quantity: 60,
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&q=80",
    description: "Farm-raised, harvested fresh weekly from the Faculty of Agriculture fish ponds — no preservatives, no middlemen.",
  },
  {
    id: "agri-2",
    name: "Broiler Chickens (Live)",
    department: "Animal Science",
    price: 6500,
    unit: "bird",
    quantity: 40,
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
    description: "Healthy, well-fed broilers reared by the Department of Animal Science. Available live or dressed on request.",
  },
  {
    id: "agri-3",
    name: "Free-Range Eggs",
    department: "Animal Science",
    price: 3200,
    unit: "crate",
    quantity: 25,
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=800&q=80",
    description: "Rich, golden-yolk eggs from the poultry unit. Collected daily and sold same-day for peak freshness.",
  },
  {
    id: "agri-4",
    name: "Sweet Corn (Fresh Cobs)",
    department: "Crop Science",
    price: 800,
    unit: "cob",
    quantity: 120,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
    description: "Sweet, tender cobs harvested at peak ripeness from the Crop Science demonstration farm.",
  },
  {
    id: "agri-5",
    name: "Farm Tomatoes",
    department: "Crop Science",
    price: 1200,
    unit: "basket",
    quantity: 12,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80",
    description: "Vine-ripened tomatoes, hand-picked twice a week. Great for stews, sauces and campus kitchens.",
  },
];

// ── Emergency Contacts ────────────────────────────────────────────────────────
type EmergencyContact = {
  id: string; icon: string; category: string;
  name: string; role: string; number: string; priority?: boolean;
};

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "security", icon: "🚨", category: "Security / Safety Emergency", name: "SUG President", role: "Direct radio link to campus security", number: "07061892231", priority: true },
  { id: "medical", icon: "🏥", category: "Medical Emergency", name: "SUG Health Director", role: "Clinic & first response", number: "08156272900" },
  { id: "general", icon: "📢", category: "General Assistance", name: "SUG PRO", role: "Public relations & info", number: "08144291758" },
  { id: "welfare", icon: "🤝", category: "Student Welfare", name: "SUG Welfare Director", role: "Student support & advocacy", number: "08133415133" },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
function getRating(vendorId: string): number {
  try { return parseInt(localStorage.getItem(`fudhub_rating_${vendorId}`) || "0", 10) || 0; } catch { return 0; }
}
function saveRating(vendorId: string, rating: number) {
  try { localStorage.setItem(`fudhub_rating_${vendorId}`, String(rating)); } catch { /* ignore */ }
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ vendorId }: { vendorId: string }) {
  const [rating, setRating] = useState(() => getRating(vendorId));
  const [hovered, setHovered] = useState(0);
  const handleRate = (star: number) => { setRating(star); saveRating(vendorId, star); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1rem" }}>
      <div style={{ fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rate this vendor</div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || rating);
          return (
            <button key={star} onClick={() => handleRate(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, fontSize: "1.4rem", lineHeight: 1, color: filled ? "#10b981" : "oklch(0.35 0.02 250)", transform: filled ? "scale(1.15)" : "scale(1)", transition: "all 0.15s ease", filter: filled ? "drop-shadow(0 0 6px rgba(16,185,129,0.6))" : "none" }}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}>★</button>
          );
        })}
        {rating > 0 && <span style={{ fontSize: "0.75rem", color: "#10b981", alignSelf: "center", marginLeft: 4, fontWeight: 600 }}>{rating}/5</span>}
      </div>
    </div>
  );
}

// ── Toast Stack ───────────────────────────────────────────────────────────────
function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 300, display: "flex", flexDirection: "column", gap: 10, width: "calc(100% - 32px)", maxWidth: 420, pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ padding: "0.9rem 1.15rem", borderRadius: 14, background: t.tone === "error" ? "linear-gradient(135deg, #f87171, #ef4444)" : "linear-gradient(135deg, #34d399, #059669)", color: t.tone === "error" ? "#fff" : "oklch(0.12 0.02 160)", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 20px 50px -15px rgba(0,0,0,0.55)", animation: "toastIn 0.35s cubic-bezier(0.2,0.8,0.2,1)", textAlign: "center" }}>
          {t.message}
        </div>
      ))}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}

// ── Campus Broadcast Banners ─────────────────────────────────────────────────
function getBroadcastAccent(audiences: Audience[]) {
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

function BroadcastBanners({ broadcasts, onDismiss }: { broadcasts: Broadcast[]; onDismiss: (id: string) => void }) {
  if (broadcasts.length === 0) return null;
  return (
    <div style={{ position: "relative", zIndex: 45, padding: "12px 24px 0" }}>
      <div className="mx-auto max-w-7xl" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {broadcasts.map((b) => {
          const accent = getBroadcastAccent(b.audiences);
          return (
            <div key={b.id} style={{ position: "relative", borderRadius: 16, padding: "14px 46px 14px 16px", background: accent.bg, borderLeft: `4px solid ${accent.border}`, border: `1px solid color-mix(in oklab, ${accent.border} 35%, transparent)`, boxShadow: `0 14px 34px -18px ${accent.glow}`, animation: "bannerIn 0.35s cubic-bezier(0.2,0.8,0.2,1)", backdropFilter: "blur(6px)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: "1.2rem", flexShrink: 0, lineHeight: 1.4 }}>{accent.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.55, margin: 0 }}>{b.message}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
                    {b.audiences.map((a) => {
                      const opt = AUDIENCE_OPTIONS.find((o) => o.id === a);
                      return (
                        <span key={a} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                          {opt?.icon} {opt?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button onClick={() => onDismiss(b.id)} aria-label="Dismiss broadcast" style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "var(--muted-foreground)", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes bannerIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Testimonials Modal (rate vendor + real verified transaction vouchers) ───
function TestimonialViewer({ business, index: _index, onClose, onNav }: { business: Business; index: number; onClose: () => void; onNav: (dir: 1 | -1) => void }) {  const sales = business.verifiedSales || [];
  const [tab, setTab] = useState<"reviews" | "vouchers">(sales.length > 0 ? "vouchers" : "reviews");
  const [zoomed, setZoomed] = useState<number | null>(null);
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (zoomed !== null) setZoomed(null); else onClose(); }
      if (zoomed !== null) {
        if (e.key === "ArrowRight") setZoomed((z) => (z === null ? z : (z + 1) % sales.length));
        if (e.key === "ArrowLeft") setZoomed((z) => (z === null ? z : (z - 1 + sales.length) % sales.length));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [onClose, onNav, zoomed, sales.length]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "oklch(0.18 0.02 250)", borderRadius: "24px 24px 0 0", border: "1px solid color-mix(in oklab, oklch(0.72 0.21 152) 20%, transparent)", overflow: "hidden", animation: "slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1)", maxHeight: "90vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>

        <div style={{ padding: "1.25rem 1.25rem 1rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              {business.logo
                ? <img src={business.logo} alt={business.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
                : <div style={{ width: 44, height: 44, borderRadius: 10, background: "oklch(0.22 0.022 250)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "oklch(0.85 0.22 158)", flexShrink: 0 }}>{business.initials}</div>
              }
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "oklch(0.97 0.01 180)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{business.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5 }}>
                  {business.verified && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--emerald-bright)", background: "color-mix(in oklab, var(--emerald-glow) 15%, transparent)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>🔒 Secured & Verified by EMBIEM</span>
                  )}
                  {sales.length > 0 && (
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#34d399", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>🧾 {sales.length} Verified Transaction{sales.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: "50%", background: "oklch(0.26 0.025 250)", border: "none", color: "oklch(0.97 0.01 180)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, padding: "0 1.25rem", flexShrink: 0 }}>
          <button onClick={() => setTab("reviews")} style={{ flex: 1, padding: "0.7rem", borderRadius: "12px 12px 0 0", border: "none", borderBottom: tab === "reviews" ? "2px solid #10b981" : "2px solid transparent", background: tab === "reviews" ? "rgba(16,185,129,0.08)" : "transparent", color: tab === "reviews" ? "var(--emerald-bright)" : "oklch(0.62 0.02 250)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>⭐ Rate This Vendor</button>
          <button onClick={() => setTab("vouchers")} style={{ flex: 1, padding: "0.7rem", borderRadius: "12px 12px 0 0", border: "none", borderBottom: tab === "vouchers" ? "2px solid #10b981" : "2px solid transparent", background: tab === "vouchers" ? "rgba(16,185,129,0.08)" : "transparent", color: tab === "vouchers" ? "var(--emerald-bright)" : "oklch(0.62 0.02 250)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>📸 Transaction Vouchers</button>
        </div>

        <div style={{ padding: "1.25rem", overflowY: "auto", flex: 1, minHeight: 0 }}>
          {tab === "reviews" && (
            <div>
              <StarRating vendorId={business.id} />
              <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: 4 }}>
                Ratings are submitted directly by FUD students who've ordered from {business.name}. This app doesn't publish written reviews yet — only the transaction vouchers below are independently verifiable.
              </p>
            </div>
          )}
          {tab === "vouchers" && (
            sales.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {sales.map((s, i) => (
                  <button key={s.id} onClick={() => setZoomed(i)} style={{ borderRadius: 14, overflow: "hidden", border: "2px solid #10b981", cursor: "pointer", background: "oklch(0.2 0.02 250)", padding: 0, aspectRatio: "1/1", position: "relative" }}>
                    <img src={s.image} alt="Verified transaction slip" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "rgba(16,185,129,0.85)", fontSize: "0.6rem", fontWeight: 700, color: "#052e1e", textAlign: "center" }}>✅ Verified</div>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textAlign: "center", padding: "1.5rem 0" }}>No verified transaction vouchers uploaded yet for {business.name}.</p>
            )
          )}
        </div>

        <div style={{ padding: "1rem 1.25rem 1.25rem", flexShrink: 0 }}>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "0.9rem", borderRadius: 14, background: "oklch(0.78 0.19 155)", color: "oklch(0.15 0.02 250)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)" }}>
            🛍️ Order via WhatsApp
          </a>
        </div>
      </div>

      {zoomed !== null && sales[zoomed] && (
        <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }} onClick={(e) => { e.stopPropagation(); setZoomed(null); }}>
          {sales.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); setZoomed((z) => (z === null ? z : (z - 1 + sales.length) % sales.length)); }} aria-label="Previous" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1.3rem", cursor: "pointer" }}>‹</button>
          )}
          <img src={sales[zoomed].image} alt="Verified transaction slip full view" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 16, border: "2px solid #10b981", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
          {sales.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); setZoomed((z) => (z === null ? z : (z + 1) % sales.length)); }} aria-label="Next" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1.3rem", cursor: "pointer" }}>›</button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setZoomed(null); }} aria-label="Close zoom" style={{ position: "absolute", top: 16, right: 16, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
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
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "radial-gradient(80% 60% at 50% 0%, color-mix(in oklab, #ef4444 22%, transparent), color-mix(in oklab, var(--background) 88%, transparent))", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", background: "linear-gradient(180deg, color-mix(in oklab, var(--surface-elevated) 95%, transparent), color-mix(in oklab, var(--surface) 98%, transparent))", borderTop: "2px solid #ef4444", borderLeft: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)", borderRight: "1px solid color-mix(in oklab, var(--foreground) 8%, transparent)", borderRadius: "24px 24px 0 0", boxShadow: "0 -20px 60px -10px rgba(239,68,68,0.14)", overflow: "hidden", animation: "slideUp 0.3s cubic-bezier(0.2,0.8,0.2,1)", maxHeight: "92vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
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
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
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
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "oklch(0.97 0.01 180)", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>Keke Delivery</div>
            <div style={{ display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 999, padding: "3px 14px", fontSize: "0.7rem", color: "#10b981", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>Coming Soon</div>
            <p style={{ fontSize: "0.875rem", color: "oklch(0.65 0.02 250)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Campus-wide keke delivery is on its way. Order from any FUD Hub vendor and get it dropped right at your hostel door. 🚀</p>
            <button onClick={() => setShowPopup(false)} style={{ background: "#10b981", color: "#0a1a14", border: "none", borderRadius: 12, padding: "0.75rem 2rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", width: "100%", boxShadow: "0 0 24px -6px rgba(16,185,129,0.6)" }}>Got it, can't wait!</button>
          </div>
        </div>
      )}
      <style>{`@keyframes kekePulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.7)}70%{box-shadow:0 0 0 14px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}@keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}`}</style>
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
    const observe = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible), .reveal-slide:not(.is-visible)").forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); document.documentElement.classList.remove("reveal-ready"); };
  }, []);
}

// ── Vendor Modal ──────────────────────────────────────────────────────────────
function VendorModal({ business, onClose, onShowTestimonials }: { business: Business; onClose: () => void; onShowTestimonials: (business: Business, index?: number) => void }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const images = business.images || (business.image ? [business.image] : []);
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => { touchEndX.current = e.changedTouches[0].clientX; const diff = touchStartX.current - touchEndX.current; if (Math.abs(diff) > 40) diff > 0 ? next() : prev(); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto", background: "oklch(0.18 0.02 250)", borderRadius: "24px 24px 0 0", border: "1px solid color-mix(in oklab, oklch(0.72 0.21 152) 20%, transparent)", overflow: "hidden", animation: "slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1)", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
              {business.logo
                ? <img src={business.logo} alt={business.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                : <div style={{ width: 44, height: 44, borderRadius: 10, background: "oklch(0.22 0.022 250)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "oklch(0.85 0.22 158)", flexShrink: 0 }}>{business.initials}</div>
              }
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.62 0.02 250)", background: "oklch(0.96 0.01 180 / 0.06)", border: "1px solid oklch(0.96 0.01 180 / 0.08)", borderRadius: 999, padding: "3px 8px" }}>{business.category}</span>
                  {business.verified && <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--emerald-bright)", background: "color-mix(in oklab, var(--emerald-glow) 15%, transparent)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>✓ Verified by EMBIEM</span>}
                  {business.deal && <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "oklch(0.25 0.04 60)", background: "linear-gradient(135deg, oklch(0.88 0.16 85), oklch(0.78 0.18 65))", borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>🏷️ {business.dealLabel || "5% Off"}</span>}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "oklch(0.97 0.01 180)", lineHeight: 1.25, marginTop: 6 }}>{business.name}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "oklch(0.26 0.025 250)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "oklch(0.97 0.01 180)", fontSize: "1rem", flexShrink: 0 }}>✕</button>
          </div>
        </div>
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
                {images.map((_, i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 999, background: i === current ? "oklch(0.85 0.22 158)" : "oklch(0.4 0.02 250)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />)}
              </div>
            )}
            {images.length > 1 && <div style={{ textAlign: "center", fontSize: "0.75rem", color: "oklch(0.62 0.02 250)", marginTop: 4 }}>{current + 1} / {images.length}</div>}
          </div>
        )}
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <p style={{ fontSize: "0.9rem", color: "oklch(0.75 0.02 250)", lineHeight: 1.65, marginBottom: "0.875rem" }}>{business.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: business.verifiedSales && business.verifiedSales.length > 0 ? "1.25rem" : "1.25rem" }}>
            {business.tags.map((t) => <span key={t} style={{ padding: "4px 12px", background: "oklch(0.22 0.022 250)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, fontSize: "0.75rem", color: "oklch(0.75 0.02 250)" }}>{t}</span>)}
          </div>

          {business.verifiedSales && business.verifiedSales.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--emerald-bright)", marginBottom: 10 }}>
                🧾 Verified Campus Sales
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {business.verifiedSales.map((sale, idx) => (
                  <button
                    key={sale.id}
                    onClick={() => onShowTestimonials(business, idx)}
                    aria-label="View verified transaction slip"
                    style={{ display: "flex", flexDirection: "column", width: 128, flexShrink: 0, borderRadius: 16, overflow: "hidden", border: "2px solid #10b981", cursor: "pointer", background: "oklch(0.2 0.02 250)", padding: 0, boxShadow: "0 8px 24px -10px rgba(16,185,129,0.4)" }}
                  >
                    <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                      <img src={sale.image} alt="Verified transaction slip preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 4px", background: "rgba(16,185,129,0.18)" }}>
                      <span style={{ fontSize: "0.65rem" }}>✅</span>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#34d399", lineHeight: 1.15, textAlign: "center" }}>Verified Transaction Slip</span>
                    </div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", marginTop: 8 }}>Tap a slip to view the full WhatsApp order, payment receipt & delivery confirmation.</p>
            </div>
          )}

          <StarRating vendorId={business.id} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0.875rem 0.5rem", background: "oklch(0.78 0.19 155)", color: "oklch(0.15 0.02 250)", fontWeight: 700, fontSize: "0.875rem", borderRadius: 14, border: "none", textDecoration: "none", boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              <span style={{ whiteSpace: "nowrap" }}> Order via WhatsApp</span>
            </a>
            <button
              onClick={() => onShowTestimonials(business, 0)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0.875rem 0.5rem", borderRadius: 14, border: "1px solid color-mix(in oklab, var(--emerald-glow) 45%, transparent)", background: "color-mix(in oklab, var(--emerald-glow) 12%, transparent)", color: "var(--emerald-bright)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              🧾 Testimonials
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ onSOS, activeTab, onTab }: { onSOS: () => void; activeTab: Tab; onTab: (t: Tab) => void }) {  const tabs: { id: Tab; label: string }[] = [
    { id: "vendors", label: "FUD Vendors" },
    { id: "agri", label: "Agri-Market" },
    { id: "management", label: "Management" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
            <img src="/embiem-logo.png" alt="EMBIEM" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span className="font-display font-semibold tracking-tight text-lg">FUD Hub</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          
          <button onClick={onSOS} style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.02em", color: "white", background: "#ef4444", border: "none", padding: "8px 13px", borderRadius: 10, cursor: "pointer", flexShrink: 0 }} aria-label="Emergency SOS">
            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "white", opacity: 0.7, animation: "sosPing 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "white" }} />
            </span>
            SOS
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-3" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 8, width: "max-content" }}>
          {tabs.map((t) => {
            const isActive = t.id === activeTab;
            return (
              <button key={t.id} onClick={() => onTab(t.id)}
                style={{ padding: "8px 18px", borderRadius: 999, fontSize: "0.8125rem", fontWeight: isActive ? 700 : 500, cursor: "pointer", transition: "all 0.25s ease", border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)", background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)", color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)", boxShadow: isActive ? "0 0 24px -6px oklch(0.72 0.21 152)" : "none", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes sosPing{75%,100%{transform:scale(2.4);opacity:0}}`}</style>
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
          Live · 40+ student vendors on campus
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
  query: string; onQuery: (q: string) => void;
}) {
  return (
    <section id="directory" className="mx-auto max-w-7xl px-6">
      <div className="reveal glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-3.5-3.5" />
          </svg>
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search vendors, food, gadgets, barber..." className="w-full bg-surface/60 border text-foreground rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-emerald-glow transition" />
        </div>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", margin: "0 -1rem", padding: "0 1rem" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "max-content" }}>
            {CATEGORIES.map((c) => {
              const isActive = c === active;
              return (
                <button key={c} onClick={() => onActive(c)}
                  style={{ padding: "8px 18px", borderRadius: 999, fontSize: "0.8125rem", fontWeight: isActive ? 600 : 400, cursor: "pointer", transition: "all 0.25s ease", border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)", background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)", color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)", boxShadow: isActive ? "0 0 24px -6px oklch(0.72 0.21 152)" : "none", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.92 0.01 180)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.4)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.65 0.02 250)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; } }}
                >{c}</button>
              );
            })}
          </div>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        </div>
      </div>
    </section>
  );
}

// ── Vendor Card ───────────────────────────────────────────────────────────────
function Card({ business, index, onOpen, onShowTestimonials }: { business: Business; index: number; onOpen: () => void; onShowTestimonials: (business: Business) => void }) {
  const waHref = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I'd like to place an order via FUD Hub.`)}`;
  const displayTags = business.tags.slice(0, 3);
  return (
    <article className="reveal group relative glass-card rounded-2xl p-6 flex flex-col hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--emerald-glow),55%,transparent)] hover:border-emerald-glow/60" style={{ transitionDelay: `${(index % 9) * 40}ms` }}>
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${business.accent} pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-3 cursor-pointer" onClick={onOpen}>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 glow-border bg-surface place-items-center grid rounded-xl shrink-0 overflow-hidden">
            {business.logo
              ? <img src={business.logo} alt={business.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span className="text-gradient-emerald font-display text-lg font-bold tracking-tight">{business.initials}</span>
            }
          </div>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">{business.category}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          {business.verified && (
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--emerald-bright)", background: "color-mix(in oklab, var(--emerald-glow) 15%, transparent)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap" }}>✓ Verified</span>
          )}
         {business.deal && (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "oklch(0.25 0.04 60)", background: "linear-gradient(135deg, oklch(0.88 0.16 85), oklch(0.78 0.18 65))", borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap", boxShadow: "0 2px 8px -2px oklch(0.78 0.18 65 / 0.5)" }}>🏷️ {business.dealLabel || "5% Off"}</span>
          )}
        </div>
      </div>
      <div className="relative mt-4 flex-1 cursor-pointer" onClick={onOpen}>
        <h3 className="text-xl font-display font-semibold leading-snug tracking-tight">{business.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{business.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {displayTags.map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 text-muted-foreground bg-surface/60">{t}</span>
          ))}
          {business.tags.length > 3 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full border border-border/70 text-muted-foreground bg-surface/60">+{business.tags.length - 3}</span>
          )}
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
      <div className="relative mt-5 pt-5 border-t border-border/70 grid grid-cols-2 gap-2">
        <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", padding: "0.7rem 0.4rem", fontSize: "0.8125rem" }} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary font-semibold text-primary-foreground transition-all duration-400 shadow-[0_0_24px_-6px_var(--emerald-glow)] hover:shadow-[0_0_50px_-2px_var(--emerald-glow)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          <span style={{ whiteSpace: "nowrap" }}> Order via WB</span>
        </a>
        <button
          onClick={(e) => { e.stopPropagation(); onShowTestimonials(business); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, padding: "0.7rem 0.4rem", fontSize: "0.8125rem", fontWeight: 700, border: "1px solid color-mix(in oklab, var(--emerald-glow) 40%, transparent)", background: "color-mix(in oklab, var(--emerald-glow) 10%, transparent)", color: "var(--emerald-bright)", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          🧾 Testimonials
        </button>
      </div>
    </article>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
function Grid({ items, onOpen, onShowTestimonials }: { items: Business[]; onOpen: (b: Business) => void; onShowTestimonials: (b: Business) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">No vendors match that search. Try another category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((b, i) => (
            <Card key={b.id} business={b} index={i} onOpen={() => onOpen(b)} onShowTestimonials={onShowTestimonials} />
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

// ── Agri-Market ───────────────────────────────────────────────────────────────
function AgriHero() {
  return (
    <section className="mx-auto max-w-7xl px-6" style={{ paddingTop: "7rem", paddingBottom: "3rem" }}>
      <div className="reveal max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1.5 text-xs text-foreground" style={{ marginBottom: "2rem" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-bright animate-pulse" />
          Direct from the Faculty of Agriculture farms
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight" style={{ lineHeight: "1.25" }}>
          Farm-fresh produce, <span className="text-gradient-emerald">straight to campus.</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground leading-relaxed" style={{ marginTop: "1.75rem", marginBottom: "2.5rem" }}>
          Fish, livestock and crops raised and harvested by FUD's own Faculty of Agriculture departments — no middlemen, just the farm.
        </p>
      </div>
    </section>
  );
}
function AgriFilterBar({ filter, onFilter }: { filter: "All" | Department; onFilter: (d: "All" | Department) => void }) {
  const options: ("All" | Department)[] = ["All", ...DEPARTMENTS];
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="reveal glass-card rounded-2xl p-4 flex gap-2" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        {options.map((o) => {
          const isActive = o === filter;
          return (
            <button key={o} onClick={() => onFilter(o)}
              style={{ padding: "8px 18px", borderRadius: 999, fontSize: "0.8125rem", fontWeight: isActive ? 600 : 400, cursor: "pointer", transition: "all 0.25s ease", border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)", background: isActive ? "oklch(0.72 0.21 152)" : "rgba(255,255,255,0.04)", color: isActive ? "oklch(0.12 0.02 160)" : "oklch(0.65 0.02 250)", boxShadow: isActive ? "0 0 24px -6px oklch(0.72 0.21 152)" : "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              {o}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AgriCard({ product, index }: { product: AgriProduct; index: number }) {
  const waHref = `https://wa.me/${FARM_WHATSAPP}?text=${encodeURIComponent(`Hi! I'd like to order ${product.name} from the FUD Faculty of Agriculture Agri-Market.`)}`;
  const low = product.quantity < 15;
  return (
   <article className="reveal group relative glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--emerald-glow),55%,transparent)] hover:border-emerald-glow/60 transition-all duration-400" style={{ transitionDelay: `${(index % 9) * 40}ms` }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-400/15 to-cyan-400/10 pointer-events-none" />
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span style={{ position: "absolute", top: 10, left: 10, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 999, background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)" }}>{product.department}</span>
        {low && <span style={{ position: "absolute", top: 10, right: 10, fontSize: "0.65rem", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "rgba(245,158,11,0.92)", color: "#1a1206" }}>Low stock</span>}
      </div>
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 className="text-lg font-display font-semibold tracking-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground" style={{ flex: 1 }}>{product.description}</p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "0.9rem", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "var(--emerald-bright)" }}>
            ₦{product.price.toLocaleString()}<span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", fontWeight: 400 }}> /{product.unit}</span>
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{product.quantity}{product.unit} available</span>
        </div>
        <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "0.8rem", borderRadius: 12, background: "oklch(0.78 0.19 155)", color: "oklch(0.15 0.02 250)", fontWeight: 700, fontSize: "0.875rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          Order via WhatApp
        </a>
      </div>
    </article>
  );
}

function AgriMarket({ products, filter, onFilter }: { products: AgriProduct[]; filter: "All" | Department; onFilter: (d: "All" | Department) => void }) {
  return (
    <>
      <AgriHero />
      <AgriFilterBar filter={filter} onFilter={onFilter} />
      <section className="mx-auto max-w-7xl px-6 py-12">
        {products.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center text-muted-foreground">No produce listed in this department yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((p, i) => <AgriCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </>
  );
}

// ── Management: PIN Gate ─────────────────────────────────────────────────────
function PinGate({ onUnlock, attempt }: { onUnlock: (pin: string) => void; attempt: number }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    setDigits(["", "", "", ""]);
    refs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const handleChange = (i: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 3) refs[i + 1].current?.focus();
    if (next.every((d) => d !== "")) onUnlock(next.join(""));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  return (
    <section className="mx-auto max-w-md px-6 text-center" style={{ paddingTop: "7rem", paddingBottom: "4rem" }}>
      <div className={`glass-card rounded-2xl p-8 sm:p-10 ${attempt > 0 ? "pin-shake" : ""}`}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
        
        <h2 className="text-2xl font-display font-semibold tracking-tight">Management Access</h2>
        
        <p className="text-sm text-muted-foreground" style={{ marginTop: "0.75rem" }}>
          Enter the 4-digit Farm Manager PIN to continue.
        </p>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: "2.5rem" }}>
          {digits.map((d, i) => (
            <input key={i} ref={refs[i]} value={d} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric" maxLength={1} type="password" autoFocus={i === 0}
              style={{ width: 52, height: 60, textAlign: "center", fontSize: "1.5rem", fontWeight: 700, borderRadius: 14, background: "oklch(0.2 0.02 250)", border: "1px solid color-mix(in oklab, var(--emerald-glow) 30%, transparent)", color: "oklch(0.97 0.01 180)", outline: "none" }} />
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground/70" style={{ marginTop: "2.25rem" }}>
          Restricted to the Faculty of Agriculture farm management team.
        </p>
      </div>
      <style>{`.pin-shake{animation:pinShake 0.4s ease}@keyframes pinShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </section>
  );
}


// ── Management: Farm Manager Portal ──────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: 12, background: "oklch(0.2 0.02 250)",
  border: "1px solid rgba(255,255,255,0.1)", color: "oklch(0.95 0.01 180)", fontSize: "0.9rem", outline: "none", marginTop: 6,
};
const labelStyle: React.CSSProperties = {
  fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.62 0.02 250)", display: "block",
};

function BroadcastComposer({ onSend, addToast }: { onSend: (message: string, audiences: Audience[]) => void; addToast: (message: string, tone?: ToastTone) => void }) {
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Audience[]>([]);

  const toggle = (a: Audience) => {
    setSelected((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handleSend = () => {
    if (!message.trim()) { addToast("Write a message before broadcasting.", "error"); return; }
    if (selected.length === 0) { addToast("Select at least one target audience.", "error"); return; }
    onSend(message.trim(), selected);
    setMessage("");
    setSelected([]);
    addToast("📢 Broadcast sent live to campus!");
  };

  return (
    <div className="reveal glass-card rounded-2xl p-6 sm:p-8" style={{ marginBottom: "2.5rem" }}>
      <h3 className="text-lg font-display font-semibold mb-1">📢 Campus Broadcast</h3>
      <p className="text-sm text-muted-foreground mb-6">Send a live announcement straight to the FUD Hub homepage.</p>

      <label style={labelStyle}>Message</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Write a campus-wide announcement..." style={{ ...inputStyle, resize: "vertical", marginBottom: "1.5rem" }} />

      <label style={labelStyle}>Target audience</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 8, marginBottom: "1.75rem" }}>
        {AUDIENCE_OPTIONS.map((opt) => {
          const isActive = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.75rem 1rem", borderRadius: 12, border: isActive ? "2px solid #10b981" : "1px solid rgba(255,255,255,0.1)", background: isActive ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)", color: isActive ? "var(--emerald-bright)" : "oklch(0.75 0.02 250)", fontWeight: isActive ? 700 : 500, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s ease" }}
            >
              <span style={{ fontSize: "1.1rem" }}>{opt.icon}</span>
              {opt.label}
              {isActive && <span style={{ marginLeft: "auto", fontSize: "0.8rem" }}>✓</span>}
            </button>
          );
        })}
      </div>

      <button onClick={handleSend} style={{ width: "100%", padding: "0.9rem", borderRadius: 14, border: "none", background: "oklch(0.72 0.21 152)", color: "oklch(0.12 0.02 160)", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)" }}>
        Send Live Broadcast
      </button>
    </div>
  );
}

function FarmManagerPortal({ setAgriProducts, addToast, onLock, onSendBroadcast }: {
  setAgriProducts: React.Dispatch<React.SetStateAction<AgriProduct[]>>;
  addToast: (message: string, tone?: ToastTone) => void;
  onLock: () => void;
  onSendBroadcast: (message: string, audiences: Audience[]) => void;
}) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<Department>("Fisheries");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName(""); setPrice(""); setQuantity(""); setDescription(""); setImagePreview(null); setDepartment("Fisheries"); setUnit("kg");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fallbackImages: Record<Department, string> = {
    Fisheries: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&q=80",
    "Animal Science": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
    "Crop Science": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80",
  };

  const handlePublish = () => {
    const priceNum = parseFloat(price);
    const qtyNum = parseFloat(quantity);
    if (!name.trim()) { addToast("Add a product name before publishing.", "error"); return; }
    if (!department) { addToast("Select a department.", "error"); return; }
    if (!priceNum || priceNum <= 0) { addToast("Enter a valid price per unit.", "error"); return; }
    if (!qtyNum || qtyNum <= 0) { addToast("Enter the quantity available.", "error"); return; }

    const newProduct: AgriProduct = {
      id: `agri-${Date.now()}`,
      name: name.trim(),
      department,
      price: priceNum,
      unit: unit.trim() || "unit",
      quantity: qtyNum,
      image: imagePreview || fallbackImages[department],
      description: description.trim() || `Fresh from the Department of ${department}, FUD Faculty of Agriculture.`,
    };

    setAgriProducts((prev) => [newProduct, ...prev]);
    addToast(`${newProduct.name} is now live on the Agri-Market 🌾`);
    resetForm();
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="reveal flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-bright mb-2">Faculty of Agriculture</div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">🌾 Faculty Farm Management Portal</h2>
        </div>
        <button onClick={onLock} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "oklch(0.65 0.02 250)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>🔒 Lock Portal</button>
      </div>

      <BroadcastComposer onSend={onSendBroadcast} addToast={addToast} />

      <div className="reveal glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-display font-semibold mb-6">Publish a new product</h3>
        <div className="grid gap-4">
          <div>
            <label style={labelStyle}>Product name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Faculty Catfish" style={inputStyle} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} style={inputStyle}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Unit</label>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg / dozen / crate" style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Price per unit (₦)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="2500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Quantity available</label>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" min="0" placeholder="60" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Farm-fresh, harvested this week..." />
          </div>
          <div>
            <label style={labelStyle}>Product photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} style={{ display: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <button onClick={() => fileInputRef.current?.click()} style={{ padding: "0.7rem 1.1rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "oklch(0.9 0.01 180)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                {imagePreview ? "📷 Change photo" : "📷 Upload photo"}
              </button>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />}
            </div>
          </div>
          <button onClick={handlePublish} style={{ marginTop: 8, width: "100%", padding: "0.9rem", borderRadius: 14, border: "none", background: "oklch(0.72 0.21 152)", color: "oklch(0.12 0.02 160)", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)" }}>
            Publish Live to Agri-Market →
          </button>
        </div>
      </div>
    </section>
  );
}

function ManagementPortal({ setAgriProducts, addToast, onSendBroadcast }: {
  setAgriProducts: React.Dispatch<React.SetStateAction<AgriProduct[]>>;
  addToast: (message: string, tone?: ToastTone) => void;
  onSendBroadcast: (message: string, audiences: Audience[]) => void;
}) {
  const [authed, setAuthed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const handleUnlock = (pin: string) => {
    if (pin === MANAGEMENT_PIN) {
      setAuthed(true);
    } else {
      setAttempt((a) => a + 1);
      addToast("Incorrect PIN — access denied.", "error");
    }
  };

  if (!authed) return <PinGate onUnlock={handleUnlock} attempt={attempt} />;
  return <FarmManagerPortal setAgriProducts={setAgriProducts} addToast={addToast} onLock={() => setAuthed(false)} onSendBroadcast={onSendBroadcast} />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();
  const [activeTab, setActiveTab] = useState<Tab>("vendors");
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Business | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [agriProducts, setAgriProducts] = useState<AgriProduct[]>(INITIAL_AGRI_PRODUCTS);
  const [agriFilter, setAgriFilter] = useState<"All" | Department>("All");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [testimonialView, setTestimonialView] = useState<{ business: Business; index: number } | null>(null);

  const addToast = (message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  };

  const handleSendBroadcast = (message: string, audiences: Audience[]) => {
    // Internal site banner — displays live at the top of the homepage.
    const newBroadcast: Broadcast = { id: `bc-${Date.now()}`, message, audiences, createdAt: Date.now() };
    setBroadcasts((prev) => [newBroadcast, ...prev]);

    // Simulated external SMS gateway dispatch (Termii / Africa's Talking style) — for demo purposes only, no real SMS is sent.
    setTimeout(() => {
      addToast("📡 Gateway Broadcast: SMS payload successfully routed via Termii API to registered student mobile lines.");
    }, 500);
  };

  const dismissBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  const openTestimonials = (business: Business, index: number = 0) => {
    if (!business.verifiedSales || business.verifiedSales.length === 0) {
      addToast(`No verified sales uploaded yet for ${business.name}.`, "error");
      return;
    }
    setTestimonialView({ business, index });
  };

  const navTestimonial = (dir: 1 | -1) => {
    setTestimonialView((v) => {
      if (!v) return v;
      const total = v.business.verifiedSales?.length || 1;
      const nextIndex = (v.index + dir + total) % total;
      return { ...v, index: nextIndex };
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESSES.filter((b) => {
      const matchCat = active === "All" || b.category === active;
      const matchQ = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [active, query]);

  const filteredAgri = useMemo(() => agriProducts.filter((p) => agriFilter === "All" || p.department === agriFilter), [agriProducts, agriFilter]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">      <BroadcastBanners broadcasts={broadcasts} onDismiss={dismissBroadcast} />
        <Nav onSOS={() => setShowEmergency(true)} activeTab={activeTab} onTab={setActiveTab} />
      {activeTab === "vendors" && (
        <>
          <Hero />
          <Controls active={active} onActive={setActive} query={query} onQuery={setQuery} />
          <Grid items={filtered} onOpen={setSelectedVendor} onShowTestimonials={openTestimonials} />
          <Stats />
        </>
      )}

      {activeTab === "agri" && (
        <AgriMarket products={filteredAgri} filter={agriFilter} onFilter={setAgriFilter} />
      )}

     {activeTab === "management" && (
        <ManagementPortal setAgriProducts={setAgriProducts} addToast={addToast} onSendBroadcast={handleSendBroadcast} />
      )}

      {selectedVendor && (
        <VendorModal business={selectedVendor} onClose={() => setSelectedVendor(null)} onShowTestimonials={openTestimonials} />
      )}
      {testimonialView && (
        <TestimonialViewer
          business={testimonialView.business}
          index={testimonialView.index}
          onClose={() => setTestimonialView(null)}
          onNav={navTestimonial}
        />
      )}
      {showEmergency && <EmergencyPanel onClose={() => setShowEmergency(false)} />}
      <KekeFAB />
      <ToastStack toasts={toasts} />
    </div>
    );
}
