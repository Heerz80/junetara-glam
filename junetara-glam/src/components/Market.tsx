import { useMemo, useState } from "react";
import { useApp } from "../context";
import { PRODUCTS, npr, type Product } from "../data";
import { Kicker, Masked, Reveal, Stars } from "./ui";
import { ArrowUpRight, Bag, Building, Heart, Pin, Search, Truck } from "./Icons";

const CATS = ["All", "Skin", "Hair", "Makeup", "Tools", "B2B Supplies"];

/* -------- hand-drawn SVG product art for salon supplies -------- */
export function ProductArt({ kind }: { kind: "wax" | "towels" | "ring" }) {
  if (kind === "wax") {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <rect width="200" height="200" fill="#ffd9d2" />
        <circle cx="100" cy="100" r="72" fill="#f4f6fc" />
        <ellipse cx="100" cy="128" rx="46" ry="10" fill="#ffb800" opacity=".35" />
        <path d="M64 96c0-6 6-10 12-10h48c6 0 12 4 12 10v26c0 6-6 10-12 10H76c-6 0-12-4-12-10V96z" fill="#1a3b8b" />
        <ellipse cx="100" cy="94" rx="36" ry="9" fill="#2b52e1" />
        <ellipse cx="100" cy="92" rx="28" ry="6" fill="#ffd36b" />
        <rect x="88" y="66" width="24" height="14" rx="7" fill="#ea5240" />
        <rect x="96" y="58" width="8" height="10" rx="4" fill="#ea5240" opacity=".7" />
        <circle cx="100" cy="118" r="5" fill="#ffd36b" />
        <path d="M100 112c2.5 3 2.5 6 0 9-2.5-3-2.5-6 0-9z" fill="#f4f6fc" />
      </svg>
    );
  }
  if (kind === "towels") {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <rect width="200" height="200" fill="#e6ecfa" />
        <circle cx="100" cy="100" r="72" fill="#f4f6fc" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0 ${i * 14})`}>
            <rect x="52" y={76 + 0} width="96" height="12" rx="6" fill={["#1a3b8b", "#2b52e1", "#ffb800", "#ea5240"][i]} />
            <circle cx="52" cy={82} r="6" fill={["#1a3b8b", "#2b52e1", "#ffb800", "#ea5240"][i]} />
            <circle cx="52" cy={82} r="2.5" fill="#f4f6fc" />
          </g>
        ))}
        <path d="M60 66c14-8 66-8 80 0" stroke="#2b52e1" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <rect width="200" height="200" fill="#e6ecfa" />
      <circle cx="100" cy="100" r="72" fill="#1a3b8b" />
      <circle cx="100" cy="92" r="40" fill="none" stroke="#ffd36b" strokeWidth="10" />
      <circle cx="100" cy="92" r="40" fill="none" stroke="#ffb800" strokeWidth="3" strokeDasharray="4 7" />
      <rect x="96" y="132" width="8" height="26" rx="3" fill="#ffd36b" />
      <rect x="82" y="156" width="36" height="8" rx="4" fill="#ffb800" />
      <circle cx="100" cy="92" r="14" fill="#f4f6fc" opacity=".15" />
      <circle cx="132" cy="60" r="5" fill="#ea5240" />
    </svg>
  );
}

/* -------- product card (shared with Home + Dashboard) -------- */
export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWish } = useApp();
  const wished = wishlist.includes(product.id);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white/80 transition-all duration-500 hover:-translate-y-1.5 hover:border-marigold/60 hover:shadow-[0_26px_55px_-28px_rgba(14,43,38,0.42)]">
      <div className="relative aspect-[5/6] overflow-hidden">
        {product.img ? (
          <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">{product.art && <ProductArt kind={product.art} />}</div>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-crimson px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory">{product.badge}</span>
        )}
        {product.b2b && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-pine/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-marigold">
            <Building className="h-3 w-3" /> B2B / wholesale
          </span>
        )}
        {product.nepali && !product.b2b && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-crimson/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory">
            🇳🇵 Made in Nepal
          </span>
        )}
        <button
          onClick={() => toggleWish(product.id)}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full transition-all ${wished ? "bg-crimson text-ivory" : "bg-ivory/90 text-pine hover:bg-ivory"}`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="h-4 w-4" filled={wished} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-crimson">{product.cat}</p>
        <h3 className="mt-1 font-display text-[17px] leading-tight text-pine">{product.name}</h3>
        {product.origin && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink/50"><Pin className="h-3 w-3 shrink-0 text-forest" /> {product.origin}</p>}
        <div className="mt-1.5 flex items-center gap-1.5">
          <Stars rating={product.rating} className="h-3 w-3" />
          <span className="text-[11.5px] font-bold text-forest">{product.rating}</span>
          <span className="text-[11px] text-ink/45">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3.5">
          <div>
            <p className="font-display text-lg font-semibold text-pine">{npr(product.price)}</p>
            {product.mrp > product.price && <p className="text-[11.5px] text-ink/45 line-through">{npr(product.mrp)}</p>}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            className="group/btn flex items-center gap-1.5 rounded-full bg-pine px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-marigold transition-all hover:bg-crimson hover:text-ivory"
          >
            <Bag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Market view ---------------- */
export default function Market() {
  const { go, searchSeed } = useApp();
  const [q, setQ] = useState(searchSeed.market ?? "");
  const [cat, setCat] = useState("All");
  const [b2bOnly, setB2bOnly] = useState(false);
  const [nepaliOnly, setNepaliOnly] = useState(false);
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (cat !== "All" && p.cat !== cat) return false;
      if (b2bOnly && !p.b2b) return false;
      if (nepaliOnly && !p.nepali) return false;
      if (needle && !`${p.name} ${p.cat} ${p.origin ?? ""}`.toLowerCase().includes(needle)) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [q, cat, b2bOnly, nepaliOnly, sort]);

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden bg-sand/70">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[170px] font-bold leading-none text-crimson/10">बजार</p>
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
          <Reveal><Kicker>बजार · Retail & wholesale</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] text-pine md:text-7xl" lines={[<>The bazaar,</>, <><em className="italic text-crimson">digitised</em>.</>]} />
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-lg text-ink/65">
              Nepali botanicals, bridal staples and professional salon supplies — direct from verified vendors,
              delivered beyond Kathmandu. Wholesale pricing unlocks for partner vendors.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div data-tour="bazaar" className="mt-7 flex flex-col gap-3 rounded-xl border border-ink/10 bg-white/85 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search serums, oils, salon kits…" className="w-full rounded-lg border border-ink/15 bg-ivory py-2.5 pl-10 pr-3 text-[14px] outline-none transition focus:border-marigold focus:bg-white" />
                </div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-ink/15 bg-ivory px-3 py-2.5 text-[13.5px] font-semibold text-ink/75 outline-none focus:border-marigold">
                  <option value="popular">Most reviewed</option>
                  <option value="rating">Top rated</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                </select>
                <button onClick={() => setB2bOnly(!b2bOnly)} className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all ${b2bOnly ? "border-pine bg-pine text-marigold" : "border-ink/15 bg-ivory text-ink/60 hover:border-forest"}`}>
                  <Building className="h-4 w-4" /> B2B only
                </button>
                <button onClick={() => setNepaliOnly(!nepaliOnly)} className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all ${nepaliOnly ? "border-crimson bg-crimson text-ivory" : "border-ink/15 bg-ivory text-ink/60 hover:border-crimson"}`}>
                  🇳🇵 Made in Nepal
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATS.map((c) => (
                  <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all ${cat === c ? "bg-crimson text-ivory" : "bg-sand text-ink/60 hover:text-crimson"}`}>{c}</button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* delivery strip */}
      <div className="border-y border-ink/10 bg-pine py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-1.5 px-5 text-[12.5px] font-semibold text-ivory/85 md:px-8">
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-marigold" /> Free delivery over {npr(3000)}</span>
          <span className="flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-marigold" /> Valley delivery in 24–48h</span>
          <span className="flex items-center gap-2"><Building className="h-4 w-4 text-marigold" /> Bulk orders for partner salons: 8–15% off</span>
        </div>
      </div>

      {/* grid */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <p className="mb-6 text-[13px] font-semibold text-ink/55">
          Showing <strong className="text-pine">{filtered.length}</strong> of {PRODUCTS.length} products
          {b2bOnly && <> · <span className="text-crimson">wholesale & professional</span></>}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/25 bg-white/50 p-14 text-center">
            <Bag className="mx-auto h-10 w-10 text-marigold" />
            <p className="mt-4 font-display text-2xl italic text-pine">Nothing on that shelf — yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">Vendors add new stock weekly. Try clearing the B2B filter or searching “serum”.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* wholesale CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-pine p-8 text-ivory md:flex-row md:items-center md:p-10">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold"><Building className="h-4 w-4" /> For salons & academies</p>
              <h3 className="mt-3 font-display text-3xl italic md:text-4xl">Stop losing margin to the middleman.</h3>
              <p className="mt-2 max-w-xl text-[14.5px] text-ivory/70">
                Partner vendors order supplies through Junetara B2B at wholesale rates with monthly consolidated
                billing — the procurement layer your salon never had.
              </p>
            </div>
            <button onClick={() => go("partner")} className="group flex shrink-0 items-center gap-3 rounded-full bg-marigold px-7 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-pine transition-all hover:-translate-y-0.5 hover:bg-sun">
              Become a vendor <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
