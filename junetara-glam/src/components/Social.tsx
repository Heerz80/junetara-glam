import { useMemo, useState, type FormEvent } from "react";
import { useApp } from "../context";
import {
  SOCIAL_POSTS, TRENDING_TAGS, TOP_CREATORS, EVENTS, PROVINCES, NETWORK_CITIES,
  PRODUCTS, npr, type SocialPost,
} from "../data";
import { Kicker, Masked, Reveal } from "./ui";
import {
  ArrowRight, Calendar, Check, Flower, Heart, MapIcon, Pen, Pin, Plus,
  Qr, Signal, Sparkle, Users,
} from "./Icons";
import { ProductCard } from "./Market";

type Tab = "social" | "events" | "nepali" | "network";

const TABS: { id: Tab; label: string; nep: string }[] = [
  { id: "social", label: "Social Hub", nep: "सामुदायिक" },
  { id: "events", label: "Events", nep: "कार्यक्रम" },
  { id: "nepali", label: "Made in Nepal", nep: "नेपाली उत्पादन" },
  { id: "network", label: "Network", nep: "सञ्जाल" },
];

/* ================= SOCIAL HUB ================= */
function SocialHub() {
  const { toast } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(SOCIAL_POSTS);
  const [liked, setLiked] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const publish = (e: FormEvent) => {
    e.preventDefault();
    if (draft.trim().length < 4) {
      toast("Write a little more before you post ✳");
      return;
    }
    const post: SocialPost = {
      id: `sp-${Date.now()}`,
      author: "You",
      initials: "YO",
      color: "#ea5240",
      role: "Community member",
      city: "Kathmandu",
      time: "just now",
      text: draft.trim(),
      tags: ["#JunetaraGlam"],
      likes: 0,
      comments: [],
    };
    setPosts((p) => [post, ...p]);
    setDraft("");
    toast("Posted to the community ✳");
  };

  const toggleLike = (id: string) => {
    setLiked((l) => {
      const has = l.includes(id);
      setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, likes: p.likes + (has ? -1 : 1) } : p)));
      return has ? l.filter((x) => x !== id) : [...l, id];
    });
  };

  const addComment = (id: string) => {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { id: `c-${Date.now()}`, author: "You", text }] } : p)));
    setCommentDraft((d) => ({ ...d, [id]: "" }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* feed */}
      <div className="lg:col-span-7">
        <Reveal>
          <form onSubmit={publish} className="rounded-xl border border-ink/10 bg-white/80 p-5">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-crimson font-display text-base italic text-ivory">YO</span>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a look, a win, a question… the ecosystem is listening."
                rows={2}
                className="flex-1 resize-none rounded-lg border border-ink/15 bg-ivory px-4 py-3 text-[14.5px] outline-none transition focus:border-forest focus:bg-white"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11.5px] font-semibold text-ink/45">
                <Sparkle className="h-3.5 w-3.5 text-marigold" /> Tips: add #hashtags · photos welcome
              </p>
              <button type="submit" className="rounded-full bg-pine px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest">
                Post
              </button>
            </div>
          </form>
        </Reveal>

        <div className="mt-6 space-y-5">
          {posts.map((p, i) => {
            const isLiked = liked.includes(p.id);
            const isFollowed = followed.includes(p.author);
            const isOpen = expanded === p.id;
            return (
              <Reveal key={p.id} delay={Math.min(i, 4) * 80}>
                <article className="rounded-xl border border-ink/10 bg-white/80 p-5 transition-all duration-300 hover:shadow-[0_18px_44px_-26px_rgba(26,59,139,0.35)]">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-base italic text-ivory" style={{ background: p.color }}>
                      {p.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-display text-lg leading-tight text-pine">{p.author}</h3>
                        <span className="text-[11.5px] font-bold uppercase tracking-wider text-ink/45">{p.role} · {p.city} · {p.time}</span>
                      </div>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-ink/75">{p.text}</p>
                      {p.tags.length > 0 && (
                        <p className="mt-2 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span key={t} className="cursor-pointer text-[12.5px] font-bold text-forest transition hover:text-crimson">{t}</span>
                          ))}
                        </p>
                      )}
                      {p.img && (
                        <div className="relative mt-3 overflow-hidden rounded-lg">
                          <img src={p.img} alt="" className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(p.id)}
                          className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${
                            isLiked ? "bg-crimson/10 text-crimson" : "bg-sand/70 text-ink/55 hover:bg-crimson/10 hover:text-crimson"
                          }`}
                        >
                          <Heart filled={isLiked} className={`h-4 w-4 transition-transform ${isLiked ? "scale-110" : "group-active:scale-90"}`} />
                          {p.likes}
                        </button>
                        <button
                          onClick={() => setExpanded(isOpen ? null : p.id)}
                          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${
                            isOpen ? "bg-forest/10 text-forest" : "bg-sand/70 text-ink/55 hover:bg-forest/10 hover:text-forest"
                          }`}
                        >
                          <Pen className="h-3.5 w-3.5" /> {p.comments.length} comment{p.comments.length === 1 ? "" : "s"}
                        </button>
                        {p.author !== "You" && (
                          <button
                            onClick={() => {
                              setFollowed((f) => (isFollowed ? f.filter((x) => x !== p.author) : [...f, p.author]));
                              toast(isFollowed ? `Unfollowed ${p.author}` : `Following ${p.author} ✳`);
                            }}
                            className={`ml-auto rounded-full px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all ${
                              isFollowed ? "border border-forest/40 text-forest" : "bg-pine text-marigold hover:bg-crimson hover:text-ivory"
                            }`}
                          >
                            {isFollowed ? "Following" : "Follow"}
                          </button>
                        )}
                      </div>
                      {isOpen && (
                        <div className="fade-in mt-4 space-y-2.5 border-t border-dashed border-ink/15 pt-4">
                          {p.comments.map((c) => (
                            <p key={c.id} className="rounded-lg bg-sand/60 px-3.5 py-2.5 text-[13px] text-ink/70">
                              <strong className="font-bold text-pine">{c.author}</strong> · {c.text}
                            </p>
                          ))}
                          <div className="flex gap-2">
                            <input
                              value={commentDraft[p.id] || ""}
                              onChange={(e) => setCommentDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addComment(p.id)}
                              placeholder="Add a comment…"
                              className="flex-1 rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-[13px] outline-none transition focus:border-forest focus:bg-white"
                            />
                            <button onClick={() => addComment(p.id)} className="rounded-full bg-forest px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider text-sun transition hover:bg-pine">
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* sidebar */}
      <div className="space-y-6 lg:col-span-5">
        <Reveal delay={100}>
          <div className="rounded-xl border border-ink/10 bg-white/80 p-5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">
              <Flower className="h-4 w-4 text-marigold" /> Trending in Nepal
            </p>
            <div className="mt-3 divide-y divide-ink/8">
              {TRENDING_TAGS.map((t, i) => (
                <div key={t.tag} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-sand/50">
                  <span className="font-display text-xl italic text-sand">{i + 1}</span>
                  <span className="font-bold text-forest">{t.tag}</span>
                  <span className="ml-auto text-[11.5px] text-ink/45">{t.posts}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <div className="rounded-xl border border-ink/10 bg-white/80 p-5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
              <Users className="h-4 w-4" /> Top creators this month
            </p>
            <div className="mt-3 space-y-3">
              {TOP_CREATORS.map((c) => {
                const isF = followed.includes(c.name);
                return (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pine font-display text-sm italic text-marigold">{c.name.split(" ").map((w) => w[0]).join("")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold text-ink">{c.name}</p>
                      <p className="text-[11px] text-ink/50">{c.role} · {c.followers}</p>
                    </div>
                    <span className="text-[11px] font-bold text-forest">{c.growth}</span>
                    <button
                      onClick={() => setFollowed((f) => (isF ? f.filter((x) => x !== c.name) : [...f, c.name]))}
                      className={`rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider transition ${isF ? "border border-forest/40 text-forest" : "bg-sand text-ink/60 hover:bg-pine hover:text-marigold"}`}
                    >
                      {isF ? "✓" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
        <Reveal delay={260}>
          <div className="rounded-xl border-2 border-dashed border-forest/40 bg-forest/5 p-5">
            <p className="font-display text-xl italic text-pine">Community guidelines</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink/60">
              Be kind, verify claims, credit artists. Selling is welcome in the marketplace — not in DMs.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= EVENTS ================= */
function EventsTab() {
  const { toast } = useApp();
  const [rsvps, setRsvps] = useState<string[]>([]);
  const [extra, setExtra] = useState<Record<string, number>>({});

  const toggleRsvp = (id: string, title: string, price: number) => {
    const has = rsvps.includes(id);
    setRsvps((r) => (has ? r.filter((x) => x !== id) : [...r, id]));
    setExtra((e) => ({ ...e, [id]: has ? 0 : 1 }));
    toast(has ? `Seat released for ${title}` : price === 0 ? `Seat reserved for ${title} — see you there! ✳` : `Seat reserved — pay ${npr(price)} at the gate or on Khalti`);
  };

  const catColor: Record<string, string> = {
    Workshop: "bg-forest text-sun",
    Expo: "bg-pine text-marigold",
    Competition: "bg-crimson text-ivory",
    Community: "bg-marigold text-pine",
    Webinar: "bg-moss text-ivory",
  };

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {EVENTS.map((ev, i) => {
          const going = rsvps.includes(ev.id);
          const taken = ev.taken + (extra[ev.id] || 0);
          const pct = Math.min(100, Math.round((taken / ev.seats) * 100));
          const full = taken >= ev.seats;
          return (
            <Reveal key={ev.id} delay={(i % 2) * 100}>
              <article className={`group flex h-full gap-5 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-26px_rgba(26,59,139,0.4)] ${going ? "border-forest/50 bg-forest/5" : "border-ink/10 bg-white/80"}`}>
                <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-pine py-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-marigold">{ev.month}</span>
                  <span className="font-display text-3xl font-semibold text-ivory">{ev.day}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ivory/50">{ev.time.split(" ")[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catColor[ev.cat]}`}>{ev.cat}</span>
                    <span className="flex items-center gap-1 text-[11.5px] text-ink/50"><Pin className="h-3 w-3 text-crimson" /> {ev.city} · {ev.venue}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl leading-tight text-pine">{ev.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{ev.desc}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-ink/45">
                      <span>{taken}/{ev.seats} seats</span>
                      <span className={pct > 85 ? "text-crimson" : "text-forest"}>{ev.price === 0 ? "Free entry" : npr(ev.price)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                      <div className={`h-full rounded-full transition-all duration-700 ${pct > 85 ? "bg-crimson" : "bg-forest"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toggleRsvp(ev.id, ev.title, ev.price)}
                    disabled={full && !going}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-[12px] font-bold uppercase tracking-[0.14em] transition-all ${
                      going
                        ? "bg-forest text-sun hover:bg-crimson hover:text-ivory"
                        : full
                        ? "cursor-not-allowed bg-sand text-ink/40"
                        : "bg-crimson text-ivory hover:bg-pine"
                    }`}
                  >
                    {going ? (<><Check className="h-4 w-4" /> Going — tap to cancel</>) : full ? "Sold out" : (<><Calendar className="h-4 w-4" /> Reserve my seat</>)}
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={200}>
        <p className="mt-6 rounded-xl border border-dashed border-ink/20 bg-white/50 p-5 text-center text-[13px] text-ink/55">
          Hosting an event? <span className="font-bold text-crimson">events@junetaraglam.com</span> — partner venues get free listings and push notifications to their city.
        </p>
      </Reveal>
    </div>
  );
}

/* ================= MADE IN NEPAL ================= */
function NepaliTab() {
  const nepaliProducts = PRODUCTS.filter((p) => p.nepali);
  return (
    <div>
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-pine p-8 text-ivory md:p-10">
          <p aria-hidden className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[150px] font-bold leading-none text-marigold/[0.07]">नेपाली</p>
          <Kicker tone="light">From Himal to Terai</Kicker>
          <h3 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
            The glow is <em className="italic text-marigold">homegrown</em>.
          </h3>
          <p className="mt-3 max-w-xl text-ivory/70">
            Every product below is formulated in Nepal from Nepali botanicals — rhododendron from Kaski, timur from the mid-hills,
            tea from Ilam, dhaka from Palpa. Buying here funds cooperatives, not imports.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {["🌸 Wild-harvested", "🤝 Cooperative-owned", "🇳🇵 100% Nepali", "♻️ Small-batch"].map((b) => (
              <span key={b} className="rounded-full border border-marigold/40 bg-marigold/10 px-3.5 py-1.5 text-[12px] font-bold text-marigold">{b}</span>
            ))}
          </div>
        </div>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {nepaliProducts.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 90}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================= NETWORK (Nepal map) ================= */
function NetworkTab() {
  const { go, toast } = useApp();
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string>("ktm");

  const totalPartners = PROVINCES.reduce((s, p) => s + p.partners, 0);
  const sel = NETWORK_CITIES.find((c) => c.id === selected)!;

  const vote = (id: string, city: string) => {
    setVotes((v) => ({ ...v, [id]: (v[id] || 0) + 1 }));
    toast(`+1 for ${city} — demand signal sent to the expansion team`);
  };

  const statusStyle: Record<string, string> = {
    live: "bg-forest text-sun",
    onboarding: "bg-marigold text-pine",
    planned: "bg-sand text-ink/55",
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* map */}
      <div className="lg:col-span-7">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-br from-[#eef2fc] to-[#e3ebfa] p-4 md:p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
                <Signal className="h-4 w-4" /> Live partner coverage · {totalPartners} partners
              </p>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink/45">
                <span className="blink h-1.5 w-1.5 rounded-full bg-crimson" /> updating
              </span>
            </div>
            <svg viewBox="0 0 1000 320" className="mt-4 w-full">
              <defs>
                <linearGradient id="np" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2b52e1" />
                  <stop offset="100%" stopColor="#1a3b8b" />
                </linearGradient>
              </defs>
              {/* stylized Nepal outline */}
              <path
                d="M20,190 C40,158 95,128 155,116 C225,102 265,84 345,78 C435,71 525,60 615,70 C705,80 785,74 855,95 C915,112 955,142 968,178 C978,204 958,228 902,238 C832,250 762,242 692,250 C612,258 542,264 462,260 C382,256 302,260 222,242 C152,227 92,217 47,207 C22,200 12,200 20,190 Z"
                fill="url(#np)"
                opacity="0.92"
              />
              <path
                d="M20,190 C40,158 95,128 155,116 C225,102 265,84 345,78 C435,71 525,60 615,70 C705,80 785,74 855,95 C915,112 955,142 968,178 C978,204 958,228 902,238 C832,250 762,242 692,250 C612,258 542,264 462,260 C382,256 302,260 222,242 C152,227 92,217 47,207 C22,200 12,200 20,190 Z"
                fill="none"
                stroke="#ffb800"
                strokeWidth="2.5"
                opacity="0.7"
              />
              {/* city markers */}
              {NETWORK_CITIES.map((c) => {
                const cx = c.x * 10;
                const cy = c.y * 3.2;
                const isSel = c.id === selected;
                const r = isSel ? 11 : c.status === "live" ? 8 : 6;
                return (
                  <g key={c.id} className="cursor-pointer" onClick={() => setSelected(c.id)}>
                    {c.status === "live" && (
                      <circle cx={cx} cy={cy} r={r + 6} fill="#ffb800" opacity="0.35" className="blink" />
                    )}
                    <circle cx={cx} cy={cy} r={r} fill={c.status === "live" ? "#ffb800" : c.status === "onboarding" ? "#ea5240" : "#f4f6fc"} stroke="#1a3b8b" strokeWidth="2" />
                    <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="17" fontWeight="700" fill={isSel ? "#ea5240" : "#1e293b"} fontFamily="Mukta, sans-serif">
                      {c.city}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* selected city detail */}
            <div className="fade-in mt-2 rounded-xl bg-white/85 p-4" key={sel.id}>
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="font-display text-2xl text-pine">{sel.city}</h4>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle[sel.status]}`}>{sel.status}</span>
                <span className="text-[12px] text-ink/50">{sel.province} Province</span>
                <button onClick={() => vote(sel.id, sel.city)} className="ml-auto flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider text-ivory transition hover:bg-pine">
                  <Plus className="h-3.5 w-3.5" /> Demand here · {sel.demand + (votes[sel.id] || 0)}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: sel.vendors, l: "salons & vendors" },
                  { v: sel.artists, l: "home artists" },
                  { v: sel.centers, l: "training centers" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-sand/60 py-3">
                    <p className="font-display text-2xl font-semibold text-forest">{s.v}</p>
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink/50">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <button onClick={() => go("partner")} className="group mt-6 flex w-full items-center justify-between rounded-xl bg-pine p-6 text-left text-ivory transition-all hover:-translate-y-0.5 hover:bg-forest">
            <div>
              <p className="font-display text-2xl italic">Bring Junetara to your city</p>
              <p className="mt-1 text-[13px] text-ivory/65">Seed partners get 0% commission for 6 months and a featured listing.</p>
            </div>
            <ArrowRight className="h-6 w-6 shrink-0 text-marigold transition-transform group-hover:translate-x-1.5" />
          </button>
        </Reveal>
      </div>

      {/* provinces */}
      <div className="lg:col-span-5">
        <Reveal delay={100}>
          <div className="rounded-xl border border-ink/10 bg-white/80 p-5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
              <MapIcon className="h-4 w-4" /> Seven provinces, one network
            </p>
            <div className="mt-4 space-y-4">
              {PROVINCES.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-ink">
                      {p.name} <span className="font-normal text-ink/45">· {p.nep} · {p.hq}</span>
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle[p.status]}`}>{p.status}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                      <div className="bar-grow h-full rounded-full bg-gradient-to-r from-forest to-marigold" style={{ width: `${p.coverage}%` }} />
                    </div>
                    <span className="w-12 text-right text-[11.5px] font-bold text-ink/55">{p.partners} pts</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-dashed border-ink/15 pt-4 text-[12px] text-ink/50">
              Phase 1 · Kathmandu Valley live — Phase 2 · Pokhara, Bharatpur, Butwal — Phase 3 · east &amp; far-west — Phase 4 · Karnali &amp; rural.
            </p>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-6 rounded-xl border border-ink/10 bg-white/80 p-5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">
              <Qr className="h-4 w-4" /> Why the network matters
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/65">
              A certificate earned in Dhangadhi is scanned and trusted in Kathmandu. An artist from Pokhara takes home bookings
              in Lakeside. One network turns 75 districts into one market.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= SHELL ================= */
export default function NepalHub() {
  const [tab, setTab] = useState<Tab>("social");

  return (
    <div>
      <section className="relative overflow-hidden bg-pine pb-14 pt-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-6 -top-14 select-none font-display text-[200px] font-bold leading-none text-ivory/[0.045]">नेपाल</p>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">Community · कार्यक्रम · सञ्जाल</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] md:text-7xl" lines={[<>From the Himal,</>, <><em className="italic text-marigold">to every district</em>.</>]} />
          <Reveal delay={200}>
            <p className="mt-4 max-w-xl text-lg text-ivory/70">
              The social heartbeat of the ecosystem — share your craft, meet at events, shop Nepali, and watch the
              network spread across all seven provinces.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-[68px] z-40 border-b border-ink/10 bg-ivory/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-5 py-2.5 md:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold uppercase tracking-wider transition-all ${
                tab === t.id ? "bg-pine text-marigold shadow-sm" : "bg-sand/70 text-ink/55 hover:bg-sand hover:text-pine"
              }`}
            >
              {t.label} <span className={tab === t.id ? "text-sun" : "text-ink/35"}>· {t.nep}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div key={tab} className="view-enter">
          {tab === "social" && <SocialHub />}
          {tab === "events" && <EventsTab />}
          {tab === "nepali" && <NepaliTab />}
          {tab === "network" && <NetworkTab />}
        </div>
      </section>
    </div>
  );
}
