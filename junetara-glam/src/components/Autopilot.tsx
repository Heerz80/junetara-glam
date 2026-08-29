import { useEffect, useRef, useState } from "react";
import { useApp } from "../context";
import { LIVE_SESSIONS, INTERNSHIPS, PRODUCTS } from "../data";
import { LEGAL_DOCS } from "../legal";
import { Flower, Play, X } from "./Icons";

type Api = ReturnType<typeof useApp>;

type Step = {
  label: string;
  pos: { x: number; y: number }; // viewport %
  dur?: number;
  run: (a: Api) => void;
};

const pct = (p: { x: number; y: number }) => ({
  x: (p.x / 100) * window.innerWidth,
  y: (p.y / 100) * window.innerHeight,
});

export default function Autopilot() {
  const api = useApp();
  const { autopilot, setAutopilot } = api;

  // Always-fresh handle so timeline callbacks never use stale state
  const apiRef = useRef<Api>(api);
  apiRef.current = api;

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);
  const timers = useRef<number[]>([]);

  const ls1 = LIVE_SESSIONS[0];
  const i1 = INTERNSHIPS[0];
  const doc = LEGAL_DOCS[0];
  const cartTotal = PRODUCTS[0].price + PRODUCTS[5].price; // serum + lipstick

  const steps: Step[] = [
    { label: "Waking the ecosystem…", pos: { x: 30, y: 30 }, run: (a) => a.go("home") },
    { label: "Searching 500+ verified courses for “Bridal”", pos: { x: 32, y: 55 }, run: (a) => { a.seedSearch("training", "Bridal"); a.go("training"); } },
    { label: "Enrolling in Basic Beautician Foundation · eSewa", pos: { x: 70, y: 42 }, run: (a) => a.enroll("c1", "eSewa") },
    { label: "Logging a practical hour toward certification", pos: { x: 70, y: 50 }, run: (a) => a.completeLesson("c1") },
    { label: `Joining the live class · ${ls1.trainer}`, pos: { x: 50, y: 62 }, run: (a) => { a.go("home"); a.joinSession(ls1.title, ls1.trainer); } },
    { label: "Opening the live map — artists pinging in real time", pos: { x: 55, y: 45 }, dur: 2600, run: (a) => a.go("map") },
    { label: "Naming my price, InDrive-style — Sabina accepts रू 4,000", pos: { x: 58, y: 52 }, run: (a) => a.addOffer({ service: "Bridal touch-up", artist: "Sabina Maharjan", myPrice: 4000, basePrice: 4500, status: "accepted", finalPrice: 4000 }) },
    { label: "Booking a Gold Radiance Facial at Parijat Wellness", pos: { x: 62, y: 48 }, run: (a) => a.go("services") },
    { label: "Confirmed · Friday 13:00 · paid via Khalti", pos: { x: 65, y: 58 }, run: (a) => a.addBooking({ service: "Gold Radiance Facial", price: 2800, venue: "Parijat Wellness Studio, Jhamsikhel", artist: "Anita Tamang", date: "Fri 24 Apr", time: "13:00", mode: "salon", name: "You", gateway: "Khalti" }) },
    { label: "Adding Kumari serum + bridal lipstick to the bag", pos: { x: 38, y: 48 }, run: (a) => { a.go("market"); a.addToCart(PRODUCTS[0].id); a.addToCart(PRODUCTS[5].id); } },
    { label: `Checking out रू ${cartTotal.toLocaleString("en-IN")} via Khalti`, pos: { x: 80, y: 60 }, run: (a) => a.checkout("Khalti", cartTotal) },
    { label: "Applying for the Junior Bridal Assistant internship", pos: { x: 50, y: 48 }, run: (a) => { a.go("careers"); a.apply(i1.id, i1.title, i1.org, "internship"); } },
    { label: "E-signing the Service Provider Agreement", pos: { x: 58, y: 52 }, run: (a) => { a.go("legal"); a.signAgreement({ id: doc.id, code: doc.code, title: doc.title }, "Service Provider", "Asha Beauty Lounge", "Kathmandu"); } },
    { label: "Training Center dashboard — roster, fees, revenue", pos: { x: 40, y: 14 }, run: (a) => { a.go("space"); a.setRole("center"); } },
    { label: "Salon dashboard — chairs, ratings, takings", pos: { x: 50, y: 14 }, run: (a) => a.setRole("service") },
    { label: "Vendor dashboard — inventory & B2B orders", pos: { x: 60, y: 14 }, run: (a) => a.setRole("vendor") },
    { label: "Admin mission control — approvals & disputes", pos: { x: 70, y: 14 }, run: (a) => a.setRole("admin") },
    { label: "Your whole journey — saved in My Space", pos: { x: 50, y: 40 }, run: (a) => a.setRole("customer") },
    {
      label: "Autopilot complete — every action is real ✳",
      pos: { x: 50, y: 50 },
      dur: 2800,
      run: (a) => {
        a.setFestival(true);
        a.toast("Autopilot finished — everything it did is saved in My Space");
        a.go("home");
      },
    },
  ];

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setAutopilot(false);
  };

  useEffect(() => {
    if (!autopilot) return;
    setStep(0);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    let t = 300;
    steps.forEach((s, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          setPos(pct(s.pos));
          setRippleKey((k) => k + 1);
          s.run(apiRef.current);
        }, t)
      );
      t += s.dur ?? 2200;
    });
    timers.current.push(
      window.setTimeout(() => setAutopilot(false), t + 400)
    );

    return () => {
      timers.current.forEach((x) => window.clearTimeout(x));
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autopilot]);

  if (!autopilot) return null;

  const total = steps.length;
  const progress = Math.round(((step + 1) / total) * 100);

  return (
    <>
      {/* soft dim to focus attention */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[105] bg-pine/10" />

      {/* ghost cursor */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[115]"
        style={{
          left: pos.x,
          top: pos.y,
          transition: "left 0.8s cubic-bezier(0.22,1,0.36,1), top 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <span key={rippleKey} className="ap-ripple absolute left-0 top-0 h-12 w-12 rounded-full border-2 border-marigold" />
          <span className="absolute -left-6 -top-6 h-12 w-12 rounded-full border border-marigold/50" />
          <span className="block h-4 w-4 rounded-full bg-marigold shadow-[0_0_24px_rgba(255,184,0,0.9)] ring-4 ring-marigold/30" />
        </div>
      </div>

      {/* AUTOPILOT badge */}
      <div className="fixed left-5 top-20 z-[120] flex items-center gap-2.5 rounded-full bg-pine px-4 py-2.5 text-marigold shadow-[0_16px_40px_-10px_rgba(26,59,139,0.55)]">
        <span className="blink h-2 w-2 rounded-full bg-coral" />
        <span className="text-[11px] font-bold uppercase tracking-[0.26em]">Autopilot</span>
        <Flower className="diya-flame h-4 w-4" />
      </div>

      {/* caption bar */}
      <div className="fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4">
        <div className="modal-in flex w-full max-w-2xl items-center gap-4 rounded-2xl border border-marigold/30 bg-pine/95 px-5 py-4 text-ivory shadow-[0_30px_80px_-20px_rgba(26,59,139,0.7)] backdrop-blur-md">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marigold text-pine">
            <Play className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[17px] italic leading-tight">{steps[step]?.label}</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ivory/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-crimson via-coral to-marigold transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-[11px] font-bold text-marigold">
                {String(step + 1).padStart(2, "0")}/{total}
              </span>
            </div>
          </div>
          <button
            onClick={stop}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory/70 transition hover:border-coral hover:text-coral"
            aria-label="Stop autopilot"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
