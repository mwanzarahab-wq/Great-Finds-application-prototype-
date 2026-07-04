// Global extraction since we are loading via CDN scripts
const { useState, useEffect, useRef, useMemo } = React;

/* ---------------------------------------------------------
   GREAT FINDS — Interactive Prototype
   Two equal-weight pillars: Thrift Marketplace + Style Feed
   Shared AI engine (Stylist), Complete the Look bridge
--------------------------------------------------------- */

const COPPER = "#B8622E";
const TEAL = "#2E5C4E";
const GOLD = "#C9A15C";
const INK = "#1C1A17";
const BONE = "#F2ECE1";

// ---------- SVG Icons Helper ----------
function Icon({ name, size = 20, color = "currentColor", style = {} }) {
  const icons = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>',
    message: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"></path></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>',
    chevron: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>',
    tag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
    trending: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>'
  };
  return React.createElement("span", {
    style: Object.assign({ display: "inline-flex", width: size, height: size, color: color }, style),
    dangerouslySetInnerHTML: { __html: icons[name] || "" }
  });
}

// ---------- Mock data ----------
const SELLERS = [
  { id: "s1", name: "Mwansa K.", city: "Lusaka", rating: 4.8, sales: 62, verified: true },
  { id: "s2", name: "Temwa B.", city: "Kitwe", rating: 4.6, sales: 21, verified: true },
  { id: "s3", name: "Chanda M.", city: "Ndola", rating: 4.2, sales: 8, verified: false },
  { id: "s4", name: "Bupe L.", city: "Lusaka", rating: 4.9, sales: 140, verified: true },
];

const LISTINGS = [
  {
    id: "l1",
    title: "Studio 88 Tailored Blazer",
    brand: "Studio 88 (likely)",
    category: "Blazers",
    size: "M",
    condition: "Like New",
    photo: "linear-gradient(135deg,#3d3227,#7a5c3e)",
    startingBid: 120,
    currentBid: 165,
    buyItNow: 260,
    bids: 7,
    closesInMin: 42,
    seller: "s1",
    city: "Lusaka",
    aiTip: "Pair with straight-leg denim and a plain white tee — let the tailoring do the work. Roll the sleeves once for an off-duty finish.",
    aiContext: "Construction and buttons suggest a Studio 88 tailored line, originally retailing around K450.",
  },
  {
    id: "l2",
    title: "Vintage Chitenge Wrap Dress",
    brand: "Independent tailor",
    category: "Dresses",
    size: "S/M",
    condition: "Great",
    photo: "linear-gradient(135deg,#8a3b2b,#d97b3f)",
    startingBid: 60,
    currentBid: 60,
    buyItNow: null,
    bids: 0,
    closesInMin: 190,
    seller: "s2",
    city: "Kitwe",
    aiTip: "Keep accessories minimal — a single gold cuff and nude sandals let the print carry the look for a graduation or Sunday lunch.",
    aiContext: "Hand-finished seams and pattern placement suggest custom tailoring rather than a mass retail piece.",
  },
  {
    id: "l3",
    title: "Woolworths Wool-Blend Coat",
    brand: "Woolworths (likely)",
    category: "Outerwear",
    size: "L",
    condition: "Good",
    photo: "linear-gradient(135deg,#2b2f33,#5c6670)",
    startingBid: 200,
    currentBid: 310,
    buyItNow: 420,
    bids: 12,
    closesInMin: 8,
    seller: "s4",
    city: "Lusaka",
    aiTip: "A structured coat like this wants contrast underneath — try it over a fitted turtleneck with tapered trousers for cool-season mornings.",
    aiContext: "Label remnants and stitch quality point to Woolworths outerwear, originally retailing around K850.",
  },
  {
    id: "l4",
    title: "Mr Price Denim Jacket",
    brand: "Mr Price",
    category: "Outerwear",
    size: "M",
    condition: "Good",
    photo: "linear-gradient(135deg,#33506b,#7fa6c2)",
    startingBid: 45,
    currentBid: 78,
    buyItNow: 130,
    bids: 5,
    closesInMin: 260,
    seller: "s3",
    city: "Ndola",
    aiTip: "Classic denim-on-denim works if you vary the wash — pair with darker jeans and white sneakers for a casual weekend look.",
    aiContext: "Hardware and label font confirm Mr Price, originally retailing around K280.",
  }
];

const LOOKS = [
  {
    id: "look1",
    title: "Office Chic, Copperbelt Edition",
    aesthetic: "office chic",
    photo: "linear-gradient(160deg,#2b2620,#5c4a35 45%,#8a6a42)",
    items: [
      { name: "Tailored Blazer", price: 165, type: "listing", listingId: "l1", recommended: false },
      { name: "Leather Loafers", price: 320, type: "partner", partner: "Woolworths", recommended: true },
    ],
  },
  {
    id: "look2",
    title: "Chitenge Fusion, Sunday Lunch",
    aesthetic: "chitenge fusion",
    photo: "linear-gradient(160deg,#5c1f16,#8a3b2b 50%,#d97b3f)",
    items: [
      { name: "Chitenge Wrap Dress", price: 60, type: "listing", listingId: "l2", recommended: false },
      { name: "Gold Cuff Bracelet", price: 95, type: "partner", partner: "Edgars", recommended: true },
    ],
  }
];

const AESTHETICS = ["office chic", "chitenge fusion"];

function fmtK(n) { return `K${n.toLocaleString()}`; }
function fmtCountdown(min) { return `${Math.round(min)}m left`; }

// ---------- Root Component ----------
function GreatFinds() {
  const [tab, setTab] = useState("market");
  const [listings, setListings] = useState(LISTINGS);
  const [watchlist, setWatchlist] = useState(new Set());
  const [followed, setFollowed] = useState(new Set(["office chic"]));

  function toggleWatch(id) {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return React.createElement("div", { style: { background: INK, minHeight: "100vh", color: BONE, fontFamily: "sans-serif" }},
    React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", background: BONE, color: INK, minHeight: "100vh", paddingBottom: 80 }},
      // Header
      React.createElement("div", { style: { padding: 16, background: tab === "style" ? INK : BONE, color: tab === "style" ? BONE : INK, display: "flex", justifyContent: "space-between", alignItems: "center" }},
        React.createElement("span", { style: { fontSize: 20, fontWeight: "bold" }}, "Great Finds"),
        React.createElement("div", { style: { display: "flex", gap: 12 }},
          React.createElement(Icon, { name: "search" }),
          React.createElement(Icon, { name: "bell" })
        )
      ),
      // Tabs
      tab === "market" ? 
        React.createElement("div", { style: { padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }},
          listings.map(l => React.createElement("div", { key: l.id, style: { background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #ddd" }},
            React.createElement("div", { style: { height: 120, background: l.photo, position: "relative" }},
              React.createElement("button", { 
                onClick: (e) => { e.stopPropagation(); toggleWatch(l.id); },
                style: { position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 28, height: 28, color: watchlist.has(l.id) ? COPPER : "#fff", cursor: "pointer" }
              }, "♥")
            ),
            React.createElement("div", { style: { padding: 8 }},
              React.createElement("div", { style: { fontSize: 13, fontWeight: "bold" }}, l.title),
              React.createElement("div", { style: { color: COPPER, fontWeight: "bold", marginTop: 4 }}, fmtK(l.currentBid))
            )
          ))
        ) : 
        React.createElement("div", { style: { padding: 16 }},
          LOOKS.map(look => React.createElement("div", { key: look.id, style: { marginBottom: 16, borderRadius: 8, overflow: "hidden", background: INK, color: BONE }},
            React.createElement("div", { style: { height: 200, background: look.photo, padding: 16, display: "flex", flexDirection: "column", justifyContent: "end" }},
              React.createElement("div", { style: { fontSize: 18, fontWeight: "bold" }}, look.title)
            )
          ))
        ),
      // Bottom Navigation
      React.createElement("div", { style: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", display: "flex", borderTop: "1px solid #ddd", zIndex: 100 }},
        React.createElement("button", { onClick: () => setTab("market"), style: { flex: 1, padding: 12, background: "none", border: "none", color: tab === "market" ? COPPER : INK, fontWeight: "bold" }}, "Marketplace"),
        React.createElement("button", { onClick: () => setTab("style"), style: { flex: 1, padding: 12, background: "none", border: "none", color: tab === "style" ? TEAL : INK, fontWeight: "bold" }}, "Style Feed")
      )
    )
  );
}

// ---------- DOM Render Hook ----------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(GreatFinds));
