import { useState } from "react";
import { useApp, type View, type NoticeKind } from "../context";
import { Bag, Bell, Calendar, Flower, GradCap, Heart, MenuIcon, Pen, Play, Seal, Store, X } from "./Icons";

const ago = (ts: number) => {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const NOTICE_ICON: Record<NoticeKind, (p: { className?: string }) => JSX.Element> = {
  booking: (p) => <Calendar {...p} />,
  order: (p) => <Bag {...p} />,
  course: (p) => <GradCap {...p} />,
  cert: (p) => <Seal {...p} />,
  legal: (p) => <Pen {...p} />,
  partner: (p) => <Store {...p} />,
  affiliate: (p) => <Heart {...p} />,
};

function NoticeBell() {
  const { notices, unread, markAllRead, clearNotices } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        data-tour="bell"
        onClick={() => setOpen((o) => !o)}
        className={`relative grid h-11 w-11 place-items-center rounded-full border transition-all hover:-translate-y-0.5 ${
          open ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink/70 hover:border-forest hover:text-forest"
        }`}
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-crimson px-1 text-[10px] font-bold leading-none text-ivory ring-2 ring-ivory">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} aria-label="Close notifications" tabIndex={-1} />
          <div className="modal-in absolute right-0 top-[52px] z-50 w-[340px] max-w-[88vw] overflow-hidden rounded-xl border border-ink/10 bg-ivory shadow-[0_34px_80px_-24px_rgba(26,59,139,0.45)]">
            <div className="flex items-center justify-between border-b border-ink/10 bg-pine px-4 py-3 text-ivory">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Notifications · सूचना</p>
              <div className="flex gap-3 text-[10.5px] font-bold uppercase tracking-wider">
                {notices.some((n) => !n.read) && (
                  <button onClick={markAllRead} className="text-ivory/70 transition hover:text-marigold">Mark read</button>
                )}
                {notices.length > 0 && (
                  <button onClick={clearNotices} className="text-ivory/70 transition hover:text-coral">Clear</button>
                )}
              </div>
            </div>
            <div className="max-h-[380px] overflow-y-auto scroll-elegant">
              {notices.length === 0 ? (
                <p className="px-5 py-10 text-center text-[13px] text-ink/50">
                  Quiet for now — bookings, certificates and orders will land here.
                </p>
              ) : (
                notices.map((n) => {
                  const Icon = NOTICE_ICON[n.kind];
                  return (
                    <div key={n.id} className={`flex gap-3 border-b border-ink/8 px-4 py-3.5 transition-colors ${n.read ? "opacity-60" : "bg-white/70"}`}>
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${n.read ? "bg-sand text-ink/50" : "bg-forest/15 text-forest"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink">
                          {n.title}
                          {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />}
                        </p>
                        <p className="mt-0.5 truncate text-[12.5px] text-ink/55">{n.body}</p>
                        <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/35">{ago(n.ts)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const LINKS: { v: View; label: string; nep: string; live?: boolean }[] = [
  { v: "map", label: "Live Map", nep: "लाइभ", live: true },
  { v: "training", label: "Training", nep: "प्रशिक्षण" },
  { v: "services", label: "Services", nep: "सेवा" },
  { v: "market", label: "Marketplace", nep: "बजार" },
  { v: "careers", label: "Careers", nep: "अवसर" },
  { v: "nepal", label: "Nepal", nep: "सामुदायिक" },
  { v: "collaborate", label: "Collaborate", nep: "सहकार्य" },
  { v: "partner", label: "Partner", nep: "साझेदार" },
  { v: "legal", label: "Legal", nep: "कानुनी" },
];

export default function Nav() {
  const { view, go, cartCount, setCartOpen, enrollments, bookings, festival, setFestival, setAutopilot } = useApp();
  const [open, setOpen] = useState(false);
  const spaceCount = enrollments.length + bookings.length;

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-ivory/15 bg-ivory/90 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          {/* brand */}
          <button onClick={() => go("home")} className="group flex items-center gap-2.5 text-left" aria-label="Junetara Glam home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-pine text-marigold transition-transform duration-500 group-hover:rotate-90">
              <Flower className="h-6 w-6" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[22px] font-semibold italic tracking-tight text-pine">
                Junetara <span className="text-crimson">Glam</span>
              </span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.34em] text-forest/70">जुनेतारा ग्ल्याम · Nepal</span>
            </span>
          </button>

          {/* desktop links */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.v}
                onClick={() => go(l.v)}
                className={`link-sweep flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  view === l.v ? "active text-crimson" : "text-ink/70 hover:text-pine"
                }`}
              >
                {l.live && <span className="blink h-1.5 w-1.5 rounded-full bg-crimson" />}
                {l.label}
              </button>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2.5">
            <button
              data-tour="autopilot"
              onClick={() => setAutopilot(true)}
              className="group relative grid h-11 w-11 place-items-center rounded-full bg-pine text-marigold shadow-sm transition-all hover:-translate-y-0.5 hover:bg-crimson hover:text-ivory"
              aria-label="Run the autopilot tour"
              title="Autopilot — watch the ecosystem drive itself"
            >
              <Play className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-ivory" />
            </button>
            <button
              onClick={() => setFestival(!festival)}
              className={`grid h-11 w-11 place-items-center rounded-full border transition-all hover:-translate-y-0.5 ${
                festival
                  ? "border-marigold bg-marigold text-pine shadow-[0_0_26px_rgba(255,184,0,0.45)]"
                  : "border-ink/20 text-ink/60 hover:border-marigold hover:text-marigold"
              }`}
              aria-label={festival ? "Turn festival mode off" : "Turn festival mode on"}
              aria-pressed={festival}
              title="Festival mode · दशैं २०८३"
            >
              <Flower className={`h-5 w-5 ${festival ? "diya-flame" : ""}`} />
            </button>
            <NoticeBell />
            <button
              onClick={() => go("space")}
              className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all sm:flex ${
                view === "space" ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink/70 hover:border-forest hover:text-forest"
              }`}
            >
              <GradCap className="h-4 w-4" />
              My Space
              {spaceCount > 0 && <span className="rounded-full bg-crimson px-1.5 py-0.5 text-[10px] leading-none text-ivory">{spaceCount}</span>}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              data-tour="bag"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-marigold text-pine shadow-sm transition-all hover:-translate-y-0.5 hover:bg-sun"
              aria-label={`Open bag, ${cartCount} items`}
            >
              <Bag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-crimson px-1 text-[10px] font-bold text-ivory">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 text-pine lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <nav className="fade-in border-t border-ink/10 bg-ivory px-5 pb-6 pt-4 lg:hidden" aria-label="Mobile">
            <div className="grid grid-cols-2 gap-2">
              {LINKS.map((l) => (
                <button
                  key={l.v}
                  onClick={() => {
                    go(l.v);
                    setOpen(false);
                  }}
                  className={`rounded-lg px-4 py-3.5 text-left transition-colors ${
                    view === l.v ? "bg-pine text-ivory" : "bg-white/70 text-ink hover:bg-sand"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider">
                    {l.live && <span className="blink h-1.5 w-1.5 rounded-full bg-crimson" />}
                    {l.label}
                  </span>
                  <span className={`text-[12px] ${view === l.v ? "text-sun" : "text-ink/45"}`}>{l.nep}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  go("space");
                  setOpen(false);
                }}
                className={`col-span-2 rounded-lg px-4 py-3.5 text-left transition-colors ${view === "space" ? "bg-pine text-ivory" : "bg-marigold/20 text-pine hover:bg-marigold/30"}`}
              >
                <span className="block text-[13px] font-bold uppercase tracking-wider">My Space · मेरो स्पेस</span>
                <span className="text-[12px] opacity-70">{enrollments.length} courses · {bookings.length} bookings</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
