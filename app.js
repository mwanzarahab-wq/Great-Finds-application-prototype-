// Global extraction since we are loading via CDN scripts
const { useState, useEffect, useRef, useMemo } = React;
const { Search, Heart, MessageCircle, Sparkles, Clock, MapPin, ShieldCheck, X, Send, ChevronRight, Camera, Tag, TrendingUp, Bell } = Lucide;

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
  },
  {
    id: "l5",
    title: "Markham Slim Chinos",
    brand: "Markham (likely)",
    category: "Trousers",
    size: "32",
    condition: "New With Tags",
    photo: "linear-gradient(135deg,#5c4a2e,#a68a5b)",
    startingBid: 90,
    currentBid: 90,
    buyItNow: 150,
    bids: 0,
    closesInMin: 400,
    seller: "s1",
    city: "Lusaka",
    aiTip: "These read smart-casual — loafers and a tucked linen shirt take them from office to evening without changing.",
    aiContext: "Tags intact suggest never-worn Markham stock, originally retailing around K380.",
  },
  {
    id: "l6",
    title: "Shein Satin Slip Dress",
    brand: "Shein",
    category: "Dresses",
    size: "S",
    condition: "Like New",
    photo: "linear-gradient(135deg,#6b2f4a,#c46b8f)",
    startingBid: 35,
    currentBid: 52,
    buyItNow: 90,
    bids: 4,
    closesInMin: 120,
    seller: "s2",
    city: "Kitwe",
    aiTip: "Layer a cropped denim jacket over this for daytime, then drop it for evening — one dress, two occasions.",
    aiContext: "Fabric weight and finish are consistent with Shein's satin slip line, originally retailing around K180.",
  },
];

const PARTNERS = {
  Woolworths: { tier: "Premium" }, Edgars: { tier: "Premium" }, "Studio 88": { tier: "Premium" }, Markham: { tier: "Premium" },
  Shein: { tier: "Value" }, Mud: { tier: "Value" }, Shiloh: { tier: "Value" }, "Kuchi Brides": { tier: "Value" },
  "Mr Price": { tier: "Value" }, Pep: { tier: "Value" }, Jets: { tier: "Value" },
};

const LOOKS = [
  {
    id: "look1",
    title: "Office Chic, Copperbelt Edition",
    aesthetic: "office chic",
    photo: "linear-gradient(160deg,#2b2620,#5c4a35 45%,#8a6a42)",
    items: [
      { name: "Tailored Blazer", price: 165, type: "listing", listingId: "l1", recommended: false },
      { name: "Slim Chinos", price: 150, type: "listing", listingId: "l5", recommended: false },
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
      { name: "Nude Strap Sandals", price: 210, type: "partner", partner: "Mr Price", recommended: false },
    ],
  },
  {
    id: "look3",
    title: "Streetwear, Cairo Road Saturday",
    aesthetic: "streetwear",
    photo: "linear-gradient(160deg,#12222b,#264a5c 50%,#7fa6c2)",
    items: [
      { name: "Denim Jacket", price: 78, type: "listing", listingId: "l4", recommended: false },
      { name: "Graphic Tee", price: 65, type: "partner", partner: "Shein", recommended: false },
      { name: "Wool Coat Layer", price: 310, type: "listing", listingId: "l3", recommended: false },
    ],
  },
  {
    id: "look4",
    title: "Evening Out, Two Ways",
    aesthetic: "evening",
    photo: "linear-gradient(160deg,#3a1730,#6b2f4a 50%,#c46b8f)",
    items: [
      { name: "Satin Slip Dress", price: 52, type: "listing", listingId: "l6", recommended: false },
      { name: "Statement Earrings", price: 140, type: "partner", partner: "Studio 88", recommended: true },
      { name: "Block Heels", price: 380, type: "partner", partner: "Markham", recommended: true },
    ],
  },
];

const AESTHETICS = ["office chic", "chitenge fusion", "streetwear", "evening"];

// ---------- Helpers ----------

function fmtK(n) {
  return `K${n.toLocaleString()}`;
}

function fmtCountdown(min) {
  if (min < 60) return `${min}m left`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return `${h}h ${m}m left`;
  return `${Math.floor(h / 24)}d ${h % 24}h left`;
}

function conditionColor(c) {
  return { Good: "#8a8a8a", Great: "#6b8a5c", "Like New": TEAL, "New With Tags": GOLD }[c] || "#8a8a8a";
}

// ---------- Root App ----------

function GreatFinds() {
  const [tab, setTab] = useState("market"); // market | style | stylist
  const [listings, setListings] = useState(LISTINGS);
  const [openListing, setOpenListing] = useState(null);
  const [openLook, setOpenLook] = useState(null);
  const [watchlist, setWatchlist] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [followed, setFollowed] = useState(new Set(["office chic"]));
  const [stylistOpen, setStylistOpen] = useState(false);
  const [stylistSeed, setStylistSeed] = useState(null);

  // countdown tick
  useEffect(() => {
    const t = setInterval(() => {
      setListings((prev) => prev.map((l) => ({ ...l, closesInMin: Math.max(0, l.closesInMin - 1 / 60) })));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function placeBid(listingId, amount) {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, currentBid: amount, bids: l.bids + 1 } : l))
    );
    showToast(`Bid placed: ${fmtK(amount)}`);
    setOpenListing((cur) => (cur ? { ...cur, currentBid: amount, bids: cur.bids + 1 } : cur));
  }

  function toggleWatch(id) {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Removed from watchlist"); }
      else { next.add(id); showToast("Added to watchlist"); }
      return next;
    });
  }

  function toggleFollow(tag) {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }

  function openStylistWith(seed) {
    setStylistSeed(seed);
    setStylistOpen(true);
  }

  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: INK, minHeight: "100vh", color: BONE }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: BONE, color: INK, position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}>

        <Header tab={tab} />

        <div style={{ paddingBottom: 84 }}>
          {tab === "market" && (
            <MarketplaceTab
              listings={listings}
              onOpen={setOpenListing}
              watchlist={watchlist}
              toggleWatch={toggleWatch}
            />
          )}
          {tab === "style" && (
            <StyleFeedTab
              looks={LOOKS}
              onOpenLook={setOpenLook}
              followed={followed}
              toggleFollow={toggleFollow}
            />
          )}
        </div>

        <BottomNav tab={tab} setTab={setTab} onStylist={() => openStylistWith(null)} />

        {openListing && (
          <ListingDetail
            listing={listingById[openListing.id] || openListing}
            seller={SELLERS.find((s) => s.id === (listingById[openListing.id] || openListing).seller)}
            onClose={() => setOpenListing(null)}
            onBid={placeBid}
            watching={watchlist.has(openListing.id)}
            toggleWatch={() => toggleWatch(openListing.id)}
            looks={LOOKS}
            onOpenLook={(look) => { setOpenListing(null); setOpenLook(look); }}
            onAskStylist={(seed) => { setOpenListing(null); openStylistWith(seed); }}
          />
        )}

        {openLook && (
          <LookDetail
            look={openLook}
            onClose={() => setOpenLook(null)}
            listingById={listingById}
            onOpenListing={(l) => { setOpenLook(null); setOpenListing(l); }}
          />
        )}

        {stylistOpen && (
          <StylistChat seed={stylistSeed} onClose={() => setStylistOpen(false)} />
        )}

        {toast && <Toast text={toast} />}
      </div>
    </div>
  );
}

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700;800&display=swap');
`;

// ---------- Header ----------

function Header({ tab }) {
  const isStyle = tab === "style";
  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 20,
        background: isStyle ? INK : BONE,
        color: isStyle ? BONE : INK,
        borderBottom: isStyle ? "none" : `1px solid ${INK}14`,
        transition: "background 0.3s, color 0.3s",
        padding: "14px 18px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 21, letterSpacing: "-0.02em" }}>
            Great Finds
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", opacity: 0.55, textTransform: "uppercase" }}>
            {isStyle ? "Style Feed" : "Marketplace"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Search size={18} strokeWidth={2} style={{ opacity: 0.8 }} />
          <Bell size={18} strokeWidth={2} style={{ opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

// ---------- Marketplace Tab ----------

function MarketplaceTab({ listings, onOpen, watchlist, toggleWatch }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Blazers", "Dresses", "Outerwear", "Trousers"];
  const shown = filter === "All" ? listings : listings.filter((l) => l.category === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 4px", overflowX: "auto" }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${filter === c ? COPPER : INK + "22"}`,
              background: filter === c ? COPPER : "transparent",
              color: filter === c ? BONE : INK,
              fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "12px 16px" }}>
        {shown.map((l) => (
          <ListingCard key={l.id} listing={l} onOpen={() => onOpen(l)} watching={watchlist.has(l.id)} toggleWatch={() => toggleWatch(l.id)} />
        ))}
      </div>
    </div>
  );
}

function ListingCard({ listing, onOpen, watching, toggleWatch }) {
  const urgent = listing.closesInMin < 15;
  return (
    <div
      onClick={onOpen}
      style={{ cursor: "pointer", background: "#fff", borderRadius: 10, overflow: "hidden", border: `1px solid ${INK}12`, position: "relative" }}
    >
      <div style={{ height: 130, background: listing.photo, position: "relative" }}>
        <span
          style={{
            position: "absolute", top: 8, left: 8, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em",
            padding: "3px 7px", borderRadius: 5, background: conditionColor(listing.condition), color: "#fff",
          }}
        >
          {listing.condition.toUpperCase()}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWatch(); }}
          style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.35)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Heart size={14} color={watching ? COPPER : "#fff"} fill={watching ? COPPER : "none"} />
        </button>
        {urgent && (
          <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 9.5, fontWeight: 700, color: "#fff", background: "#a33", padding: "3px 7px", borderRadius: 5, display: "flex", alignItems: "center", gap: 3 }}>
            <Clock size={10} /> {fmtCountdown(Math.round(listing.closesInMin))}
          </span>
        )}
      </div>
      <div style={{ padding: "9px 10px 11px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.25, marginBottom: 2 }}>{listing.title}</div>
        <div style={{ fontSize: 10.5, opacity: 0.55, marginBottom: 6 }}>{listing.size} · {listing.city}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 9.5, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Current bid</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: COPPER }}>{fmtK(listing.currentBid)}</div>
          </div>
          {!urgent && (
            <div style={{ fontSize: 10, opacity: 0.55, display: "flex", alignItems: "center", gap: 3 }}>
              <Clock size={11} /> {fmtCountdown(Math.round(listing.closesInMin))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Listing Detail ----------

function ListingDetail({ listing, seller, onClose, onBid, watching, toggleWatch, looks, onOpenLook, onAskStylist }) {
  const [bidInput, setBidInput] = useState(String(listing.currentBid + 10));
  const minBid = listing.currentBid + 5;
  const relatedLook = looks.find((lk) => lk.items.some((it) => it.listingId === listing.id));

  return (
    <Sheet onClose={onClose}>
      <div style={{ height: 240, background: listing.photo, borderRadius: "16px 16px 0 0", position: "relative" }}>
        <span style={{ position: "absolute", top: 10, left: 12, fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 6, background: conditionColor(listing.condition), color: "#fff" }}>
          {listing.condition.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: "16px 18px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 21, fontWeight: 600, margin: 0 }}>{listing.title}</h2>
            <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 3 }}>{listing.brand} · Size {listing.size} · {listing.city}</div>
          </div>
          <button onClick={toggleWatch} style={{ border: "none", background: "none", cursor: "pointer" }}>
            <Heart size={22} color={watching ? COPPER : INK} fill={watching ? COPPER : "none"} />
          </button>
        </div>

        {seller && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "8px 10px", background: BONE, borderRadius: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: TEAL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
              {seller.name[0]}
            </div>
            <div style={{ fontSize: 12 }}>
              <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                {seller.name} {seller.verified && <ShieldCheck size={13} color={TEAL} />}
              </div>
              <div style={{ opacity: 0.6, fontSize: 11 }}>{seller.rating}★ · {seller.sales} sales · {seller.city}</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: BONE, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.04em" }}>Current bid ({listing.bids})</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COPPER }}>{fmtK(listing.currentBid)}</div>
          </div>
          <div style={{ flex: 1, background: BONE, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <Clock size={10} style={{ verticalAlign: -1 }} /> Closes in
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{fmtCountdown(Math.round(listing.closesInMin))}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={bidInput}
            onChange={(e) => setBidInput(e.target.value.replace(/[^0-9]/g, ""))}
            style={{ flex: 1, border: `1.5px solid ${INK}30`, borderRadius: 8, padding: "10px 12px", fontSize: 14, fontWeight: 700 }}
          />
          <button
            onClick={() => {
              const amt = parseInt(bidInput || "0", 10);
              if (amt >= minBid) onBid(listing.id, amt);
            }}
            style={{ background: COPPER, color: "#fff", border: "none", borderRadius: 8, padding: "0 18px", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
          >
            Place bid
          </button>
        </div>
        <div style={{ fontSize: 10.5, opacity: 0.5, marginTop: 4 }}>Minimum bid {fmtK(minBid)}. Bids in the final 5 minutes auto-extend the auction.</div>

        {listing.buyItNow && (
          <button
            onClick={() => onBid(listing.id, listing.buyItNow)}
            style={{ width: "100%", marginTop: 8, background: "none", border: `1.5px solid ${INK}`, borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
          >
            Buy It Now — {fmtK(listing.buyItNow)}
          </button>
        )}

        {/* AI styling + context */}
        <div style={{ marginTop: 18, background: `${TEAL}10`, border: `1px solid ${TEAL}30`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Sparkles size={14} color={TEAL} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.03em" }}>AI Styling Tip</span>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{listing.aiTip}</div>
          <div style={{ height: 1, background: `${TEAL}25`, margin: "10px 0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Tag size={13} color={TEAL} />
            <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: "0.03em" }}>Product Context</span>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{listing.aiContext}</div>
        </div>

        <button
          onClick={() => onAskStylist({ type: "listing", listing })}
          style={{ width: "100%", marginTop: 10, background: "none", border: `1.5px dashed ${COPPER}`, color: COPPER, borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <MessageCircle size={14} /> Ask the Stylist about this piece
        </button>

        {/* Complete the look */}
        {relatedLook && (
          <div style={{ marginTop: 20 }}>
            <SeamDivider label="Complete the Look" />
            <div
              onClick={() => onOpenLook(relatedLook)}
              style={{ cursor: "pointer", display: "flex", gap: 10, alignItems: "center", background: INK, color: BONE, borderRadius: 10, padding: 10, marginTop: 10 }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 8, background: relatedLook.photo, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600 }}>{relatedLook.title}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>This piece appears in a Style Feed look — see the full outfit</div>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function SeamDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, borderTop: `1.5px dashed ${INK}40` }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6 }}>{label}</span>
      <div style={{ flex: 1, borderTop: `1.5px dashed ${INK}40` }} />
    </div>
  );
}

// ---------- Style Feed Tab ----------

function StyleFeedTab({ looks, onOpenLook, followed, toggleFollow }) {
  return (
    <div style={{ background: INK, color: BONE, minHeight: "60vh" }}>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 6px", overflowX: "auto" }}>
        {AESTHETICS.map((a) => (
          <button
            key={a}
            onClick={() => toggleFollow(a)}
            style={{
              flexShrink: 0, padding: "6px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${followed.has(a) ? GOLD : BONE + "33"}`,
              background: followed.has(a) ? GOLD : "transparent",
              color: followed.has(a) ? INK : BONE,
            }}
          >
            {followed.has(a) ? "✓ " : "+ "}{a}
          </button>
        ))}
      </div>

      <div style={{ padding: "8px 0 4px" }}>
        {looks.map((look) => (
          <LookCard key={look.id} look={look} onOpen={() => onOpenLook(look)} />
        ))}
      </div>
    </div>
  );
}

function LookCard({ look, onOpen }) {
  return (
    <div style={{ marginBottom: 2, borderBottom: `1px solid ${BONE}14` }}>
      <div onClick={onOpen} style={{ cursor: "pointer", height: 420, background: look.photo, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 45%)" }} />
        <div style={{ position: "absolute", top: 12, left: 14, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.75 }}>
          {look.aesthetic}
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, marginBottom: 8, lineHeight: 1.15 }}>{look.title}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {look.items.map((it, i) => (
              <span key={i} style={{ fontSize: 10.5, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)", padding: "4px 9px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                {it.recommended && <Sparkles size={9} color={GOLD} />}
                {it.name} · {fmtK(it.price)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LookDetail({ look, onClose, listingById, onOpenListing }) {
  return (
    <Sheet onClose={onClose} dark>
      <div style={{ height: 260, background: look.photo, borderRadius: "16px 16px 0 0" }} />
      <div style={{ padding: "16px 18px 28px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>{look.aesthetic}</div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, margin: 0, marginBottom: 14 }}>{look.title}</h2>

        {look.items.map((item, i) => {
          const linkedListing = item.type === "listing" ? listingById[item.listingId] : null;
          const tier = item.type === "partner" ? PARTNERS[item.partner]?.tier : null;
          return (
            <div
              key={i}
              onClick={() => linkedListing && onOpenListing(linkedListing)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < look.items.length - 1 ? `1px solid ${BONE}18` : "none",
                cursor: linkedListing ? "pointer" : "default",
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 8, background: linkedListing ? linkedListing.photo : "#3a3a3a", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: 11, opacity: 0.6, display: "flex", alignItems: "center", gap: 5 }}>
                  {item.type === "listing" ? "Live Great Finds listing" : `${item.partner} · ${tier} Partner`}
                  {item.recommended && <span style={{ color: GOLD, fontWeight: 700 }}>· Recommended</span>}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: item.type === "listing" ? COPPER : GOLD }}>{fmtK(item.price)}</div>
                {linkedListing && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 16, fontSize: 10.5, opacity: 0.5, lineHeight: 1.5 }}>
          Items marked "Recommended" are Premium Partner matches ranked for fit and margin, disclosed as required by the Style Feed's margin-aware ranking policy.
        </div>
      </div>
    </Sheet>
  );
}

// ---------- Bottom Nav ----------

function BottomNav({ tab, setTab, onStylist }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: `1px solid ${INK}14`, display: "flex", zIndex: 30 }}>
      <NavBtn active={tab === "market"} label="Marketplace" icon={<TrendingUp size={20} />} onClick={() => setTab("market")} accent={COPPER} />
      <NavBtn active={tab === "style"} label="Style Feed" icon={<Sparkles size={20} />} onClick={() => setTab("style")} accent={TEAL} />
      <NavBtn active={false} label="Stylist" icon={<MessageCircle size={20} />} onClick={onStylist} accent={GOLD} />
    </div>
  );
}

function NavBtn({ active, label, icon, onClick, accent }) {
  return (
    <button onClick={onClick} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? accent : INK + "80" }}>
      {icon}
      <span style={{ fontSize: 10, fontWeight: 700 }}>{label}</span>
    </button>
  );
}

// ---------- Sheet (modal) ----------

function Sheet({ children, onClose, dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto",
          background: dark ? INK : "#fff", color: dark ? BONE : INK,
          borderRadius: "16px 16px 0 0", animation: "slideUp 0.25s ease-out",
        }}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(30px); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }`}</style>
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10, zIndex: 5, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={16} color="#fff" />
        </button>
        {children}
      </div>
    </div>
  );
}

// ---------- Stylist Chat ----------

function StylistChat({ seed, onClose }) {
  const initial = useMemo(() => {
    const msgs = [{ role: "ai", text: "Hi! I'm the Great Finds Stylist. Tell me an occasion, upload a photo, or ask me to build around a piece you're eyeing." }];
    if (seed?.type === "listing") {
      msgs.push({ role: "ai", text: `I see you're looking at the ${seed.listing.title}. Want me to build a full outfit around it, or suggest an occasion it works for?` });
    }
    return msgs;
  }, [seed]);

  const [messages, setMessages] = useState(initial);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: mockStylistReply(text, seed) }]);
    }, 650);
  }

  const suggestions = [
    "Job interview outfit under K300",
    "What goes with this jacket?",
    "Chitenge fusion for a wedding",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", background: INK, color: BONE }}>
      <div style={{ padding: "16px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${BONE}18` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={15} color={INK} />
          </div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 15 }}>Great Finds Stylist</div>
            <div style={{ fontSize: 10.5, opacity: 0.55 }}>Knows your size, budget & style</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color={BONE} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              maxWidth: "78%", padding: "9px 13px", borderRadius: 14, fontSize: 13, lineHeight: 1.45,
              background: m.role === "user" ? COPPER : "rgba(255,255,255,0.08)",
              color: m.role === "user" ? "#fff" : BONE,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {messages.length < 3 && (
        <div style={{ display: "flex", gap: 6, padding: "0 16px 10px", flexWrap: "wrap" }}>
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} style={{ fontSize: 11, padding: "6px 11px", borderRadius: 20, border: `1px solid ${BONE}33`, background: "none", color: BONE, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, padding: "10px 16px 18px", borderTop: `1px solid ${BONE}18`, alignItems: "center" }}>
        <button style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Camera size={17} color={BONE} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask the Stylist anything..."
          style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, padding: "10px 14px", fontSize: 13, color: BONE, outline: "none" }}
        />
        <button onClick={() => send(input)} style={{ background: GOLD, border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Send size={16} color={INK} />
        </button>
      </div>
    </div>
  );
}

function mockStylistReply(text, seed) {
  const t = text.toLowerCase();
  if (t.includes("interview")) {
    return "For a job interview under K300: the Studio 88 blazer (K165, currently biddable) paired with the Markham slim chinos (K150 buy-it-now) reads polished without trying too hard. I'd skip patterns — let the tailoring speak.";
  }
  if (t.includes("wedding") || t.includes("chitenge")) {
    return "For a wedding in chitenge fusion: the Vintage Chitenge Wrap Dress pairs beautifully with a gold cuff from Edgars and nude sandals from Mr Price — full look is in the Style Feed under 'Chitenge Fusion, Sunday Lunch.'";
  }
  if (t.includes("jacket") || (seed?.type === "listing" && t.includes("pair"))) {
    return "That jacket works two ways: dress it down with straight-leg denim and white sneakers, or dress it up with tailored trousers and loafers. Want me to pull matching pieces from current listings?";
  }
  return "Got it — based on your saved size and budget, I'd lean toward pieces already live in the Marketplace so you can act today rather than wait on new stock. Want me to show a few?";
}

// ---------- Toast ----------

function Toast({ text }) {
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", zIndex: 60,
      background: INK, color: BONE, padding: "10px 18px", borderRadius: 24, fontSize: 12.5, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    }}>
      {text}
    </div>
  );
}

// ---------- DOM Render Hook ----------
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(GreatFinds));
