import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  COURSES, SEED_CERTS, SEED_VENDOR_QUEUE, SEED_DISPUTES, SEED_LEDGER,
  type VendorApplication, type Dispute,
} from "./data";

export type View = "home" | "training" | "services" | "market" | "careers" | "collaborate" | "partner" | "space" | "map" | "deck" | "legal" | "nepal";

export type Role = "customer" | "center" | "service" | "vendor" | "admin";

export interface AffiliateProfile {
  name: string;
  channel: string;
  city: string;
  code: string;
  joined: string;
}

export interface Agreement {
  id: string;
  docId: string;
  docCode: string;
  docTitle: string;
  party: string;
  org: string;
  city: string;
  ref: string;
  signedAt: string;
}

export interface LedgerEntry {
  id: string;
  entity: string;
  date: string;
  type: "income" | "expense";
  category: string;
  note: string;
  amount: number;
}

export type NoticeKind = "booking" | "order" | "course" | "cert" | "legal" | "partner" | "affiliate";

export interface Notice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  ts: number;
  read: boolean;
}

export interface Offer {
  id: string;
  service: string;
  artist: string;
  myPrice: number;
  basePrice: number;
  status: "accepted" | "countered" | "declined";
  counterPrice?: number;
  finalPrice?: number;
  date: string;
}

export interface Booking {
  id: string;
  service: string;
  price: number;
  venue: string;
  artist: string;
  date: string;
  time: string;
  mode: "salon" | "home";
  name: string;
  gateway: string;
}

export interface Order {
  id: string;
  items: number;
  total: number;
  date: string;
  gateway: string;
}

export interface Application {
  id: string;
  listingId: string;
  title: string;
  org: string;
  kind: "internship" | "job";
  date: string;
}

export interface Enrollment {
  courseId: string;
  done: number;
  date: string;
  gateway: string;
  certId?: string;
}

export interface Cert {
  id: string;
  holder: string;
  course: string;
  center: string;
  date: string;
  hours: number;
}

export interface PartnerLead {
  id: string;
  type: string;
  name: string;
  city: string;
  date: string;
}

interface Toast {
  id: number;
  msg: string;
}

interface AppCtx {
  view: View;
  go: (v: View) => void;
  searchSeed: Partial<Record<View, string>>;
  seedSearch: (v: View, q: string) => void;

  role: Role;
  setRole: (r: Role) => void;

  cart: Record<string, number>;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  addToCart: (id: string) => void;
  setQty: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;

  wishlist: string[];
  toggleWish: (id: string) => void;

  enrollments: Enrollment[];
  enroll: (courseId: string, gateway: string) => void;
  completeLesson: (courseId: string) => void;

  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id">) => void;
  cancelBooking: (id: string) => void;

  orders: Order[];
  checkout: (gateway: string, total: number) => void;

  applications: Application[];
  apply: (listingId: string, title: string, org: string, kind: "internship" | "job") => void;

  partnerLeads: PartnerLead[];
  submitPartner: (type: string, name: string, city: string) => void;

  certs: Cert[];

  offers: Offer[];
  addOffer: (o: Omit<Offer, "id" | "date">) => void;

  pendingVendors: VendorApplication[];
  approveVendor: (id: string) => void;
  rejectVendor: (id: string) => void;

  disputes: Dispute[];
  resolveDispute: (id: string) => void;

  affiliate: AffiliateProfile | null;
  joinAffiliate: (name: string, channel: string, city: string) => void;

  agreements: Agreement[];
  signAgreement: (doc: { id: string; code: string; title: string }, party: string, org: string, city: string) => string;

  ledger: LedgerEntry[];
  addLedgerEntry: (e: Omit<LedgerEntry, "id">) => void;
  deleteLedgerEntry: (id: string) => void;

  notices: Notice[];
  unread: number;
  notify: (kind: NoticeKind, title: string, body: string) => void;
  markAllRead: () => void;
  clearNotices: () => void;

  festival: boolean;
  setFestival: (v: boolean) => void;

  joinSession: (title: string, trainer: string) => void;

  autopilot: boolean;
  setAutopilot: (v: boolean) => void;

  toasts: Toast[];
  toast: (msg: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (sandboxed preview) — app keeps working in memory */
  }
}

let toastSeq = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("home");
  const [searchSeed, setSearchSeed] = useState<Partial<Record<View, string>>>({});

  const [cart, setCart] = useState<Record<string, number>>(() => load("jg-cart", {}));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => load("jg-wish", []));
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => load("jg-enroll", []));
  const [bookings, setBookings] = useState<Booking[]>(() => load("jg-book", []));
  const [orders, setOrders] = useState<Order[]>(() => load("jg-orders", []));
  const [applications, setApplications] = useState<Application[]>(() => load("jg-apps", []));
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>(() => load("jg-partner", []));
  const [certs, setCerts] = useState<Cert[]>(() => load("jg-certs", SEED_CERTS));
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [role, setRole] = useState<Role>(() => load("jg-role", "customer" as Role));
  const [offers, setOffers] = useState<Offer[]>(() => load("jg-offers", []));
  const [pendingVendors, setPendingVendors] = useState<VendorApplication[]>(() => load("jg-vqueue", SEED_VENDOR_QUEUE));
  const [disputes, setDisputes] = useState<Dispute[]>(() => load("jg-disputes", SEED_DISPUTES));
  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(() => load<AffiliateProfile | null>("jg-aff", null));
  const [agreements, setAgreements] = useState<Agreement[]>(() => load("jg-agr", []));
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => load("jg-ledger", SEED_LEDGER));
  const [notices, setNotices] = useState<Notice[]>(() => load("jg-notices", []));
  const [festival, setFestivalState] = useState<boolean>(() => load("jg-fest", false));
  const [autopilot, setAutopilot] = useState(false);

  useEffect(() => save("jg-cart", cart), [cart]);
  useEffect(() => save("jg-wish", wishlist), [wishlist]);
  useEffect(() => save("jg-enroll", enrollments), [enrollments]);
  useEffect(() => save("jg-book", bookings), [bookings]);
  useEffect(() => save("jg-orders", orders), [orders]);
  useEffect(() => save("jg-apps", applications), [applications]);
  useEffect(() => save("jg-partner", partnerLeads), [partnerLeads]);
  useEffect(() => save("jg-certs", certs), [certs]);
  useEffect(() => save("jg-role", role), [role]);
  useEffect(() => save("jg-offers", offers), [offers]);
  useEffect(() => save("jg-vqueue", pendingVendors), [pendingVendors]);
  useEffect(() => save("jg-disputes", disputes), [disputes]);
  useEffect(() => save("jg-aff", affiliate), [affiliate]);
  useEffect(() => save("jg-agr", agreements), [agreements]);
  useEffect(() => save("jg-ledger", ledger), [ledger]);
  useEffect(() => save("jg-notices", notices), [notices]);
  useEffect(() => save("jg-fest", festival), [festival]);

  const toast = useCallback((msg: string) => {
    const id = ++toastSeq;
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const go = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const seedSearch = useCallback((v: View, q: string) => {
    setSearchSeed((s) => ({ ...s, [v]: q }));
  }, []);

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const addToCart = useCallback(
    (id: string) => {
      setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      toast("Added to your bag");
    },
    [toast]
  );

  const setQty = useCallback((id: string, q: number) => {
    setCart((c) => {
      if (q <= 0) {
        const { [id]: _gone, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: q };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((c) => {
    const { [id]: _gone, ...rest } = c;
    return rest;
  }), []);

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist((w) => {
        const has = w.includes(id);
        toast(has ? "Removed from wishlist" : "Saved to wishlist ♥");
        return has ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [toast]
  );

  const notify = useCallback((kind: NoticeKind, title: string, body: string) => {
    setNotices((list) =>
      [{ id: `nt-${Date.now()}-${Math.floor(Math.random() * 999)}`, kind, title, body, ts: Date.now(), read: false }, ...list].slice(0, 24)
    );
  }, []);

  const markAllRead = useCallback(() => setNotices((list) => list.map((n) => ({ ...n, read: true }))), []);
  const clearNotices = useCallback(() => setNotices([]), []);
  const setFestival = useCallback(
    (v: boolean) => {
      setFestivalState(v);
      if (v) toast("🪔 Festival mode on — शुभ दशैं २०८३");
    },
    [toast]
  );

  const joinSession = useCallback(
    (title: string, trainer: string) => {
      toast(`You're in — “${title}” starts shortly`);
      notify("course", "Live session joined", `${title} · with ${trainer}`);
    },
    [toast, notify]
  );

  const enroll = useCallback(
    (courseId: string, gateway: string) => {
      const course = COURSES.find((c) => c.id === courseId);
      setEnrollments((e) => (e.some((x) => x.courseId === courseId) ? e : [...e, { courseId, done: 0, date: new Date().toISOString().slice(0, 10), gateway }]));
      toast(`Enrolled — ${course ? course.title : "course"} confirmed via ${gateway}`);
      notify("course", "Enrollment confirmed", `${course ? course.title : "Course"} · paid via ${gateway}`);
    },
    [toast, notify]
  );

  const completeLesson = useCallback(
    (courseId: string) => {
      setEnrollments((list) =>
        list.map((e) => {
          if (e.courseId !== courseId) return e;
          const course = COURSES.find((c) => c.id === courseId);
          const total = course?.syllabus.length ?? 0;
          const done = Math.min(e.done + 1, total);
          if (done === total && !e.certId && course) {
            const certId = `JG-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
            setCerts((cs) => [
              ...cs,
              { id: certId, holder: "You (My Space profile)", course: course.title, center: course.center, date: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }), hours: course.months * 24 },
            ]);
            toast(`🎓 Complete! Certificate ${certId} issued & QR-verified`);
            notify("cert", "Certificate issued", `${certId} · ${course.title} · QR-verifiable on Careers`);
            return { ...e, done, certId };
          }
          return { ...e, done };
        })
      );
    },
    [toast]
  );

  const addBooking = useCallback(
    (b: Omit<Booking, "id">) => {
      setBookings((list) => [...list, { ...b, id: `BK-${Date.now().toString().slice(-5)}` }]);
      toast(`Booking confirmed — SMS reminder scheduled (${b.gateway})`);
      notify("booking", "Booking confirmed", `${b.service} · ${b.date} at ${b.time} · paid via ${b.gateway}`);
    },
    [toast, notify]
  );

  const cancelBooking = useCallback(
    (id: string) => {
      setBookings((list) => list.filter((b) => b.id !== id));
      toast("Booking cancelled — refund initiated to your wallet");
    },
    [toast]
  );

  const checkout = useCallback(
    (gateway: string, total: number) => {
      const items = cartCount;
      const id = `ORD-${Date.now().toString().slice(-5)}`;
      setOrders((o) => [...o, { id, items, total, date: new Date().toISOString().slice(0, 10), gateway }]);
      setCart({});
      toast(`Order confirmed — payment via ${gateway}, delivery in 2–4 days`);
      notify("order", "Order placed", `${id} · ${items} item${items === 1 ? "" : "s"} · रू ${total.toLocaleString("en-IN")} via ${gateway}`);
      return id;
    },
    [cartCount, toast, notify]
  );

  const apply = useCallback(
    (listingId: string, title: string, org: string, kind: "internship" | "job") => {
      setApplications((a) => (a.some((x) => x.listingId === listingId) ? a : [...a, { id: `AP-${Date.now().toString().slice(-4)}`, listingId, title, org, kind, date: new Date().toISOString().slice(0, 10) }]));
      toast(`Application sent to ${org} — under review`);
    },
    [toast]
  );

  const submitPartner = useCallback(
    (type: string, name: string, city: string) => {
      const id = `JG-V-${String(Math.floor(1000 + Math.random() * 9000))}`;
      setPartnerLeads((p) => [...p, { id, type, name, city, date: new Date().toISOString().slice(0, 10) }]);
      toast(`Partner application ${id} received — onboarding team will call within 48h`);
      notify("partner", "Partner application received", `${id} · ${type} · response within 48h`);
    },
    [toast, notify]
  );

  const addOffer = useCallback(
    (o: Omit<Offer, "id" | "date">) => {
      setOffers((list) => [
        { ...o, id: `OF-${Date.now().toString().slice(-5)}`, date: new Date().toISOString().slice(0, 10) },
        ...list,
      ].slice(0, 12));
    },
    []
  );

  const approveVendor = useCallback(
    (id: string) => {
      const v = pendingVendors.find((x) => x.id === id);
      setPendingVendors((list) => list.filter((x) => x.id !== id));
      toast(`✓ ${v ? v.name : "Vendor"} approved & listed on the marketplace`);
    },
    [pendingVendors, toast]
  );

  const rejectVendor = useCallback(
    (id: string) => {
      const v = pendingVendors.find((x) => x.id === id);
      setPendingVendors((list) => list.filter((x) => x.id !== id));
      toast(`${v ? v.name : "Vendor"} rejected — applicant notified by SMS`);
    },
    [pendingVendors, toast]
  );

  const resolveDispute = useCallback(
    (id: string) => {
      const d = disputes.find((x) => x.id === id);
      setDisputes((list) => list.filter((x) => x.id !== id));
      toast(`Dispute ${d ? d.booking : ""} resolved — refund of रू ${d ? d.amount.toLocaleString("en-IN") : 0} initiated`);
    },
    [disputes, toast]
  );

  const joinAffiliate = useCallback(
    (name: string, channel: string, city: string) => {
      const code = `JG-AFF-${String(Math.floor(1000 + Math.random() * 9000))}`;
      setAffiliate({ name, channel, city, code, joined: new Date().toISOString().slice(0, 10) });
      toast(`Welcome to the collective — your code ${code} is live`);
      notify("affiliate", "Affiliate account live", `Code ${code} · 5–8% commission · payouts monthly`);
    },
    [toast, notify]
  );

  const signAgreement = useCallback(
    (doc: { id: string; code: string; title: string }, party: string, org: string, city: string) => {
      const ref = `JG-AGR-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const rec: Agreement = {
        id: `${Date.now()}`,
        docId: doc.id,
        docCode: doc.code,
        docTitle: doc.title,
        party,
        org,
        city,
        ref,
        signedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      setAgreements((list) => [rec, ...list]);
      toast(`${doc.code} executed — reference ${ref}`);
      notify("legal", "Agreement executed", `${doc.code} · ref ${ref} · stored in My Space`);
      return ref;
    },
    [toast, notify]
  );

  const addLedgerEntry = useCallback(
    (e: Omit<LedgerEntry, "id">) => {
      setLedger((list) => [{ ...e, id: `lg-${Date.now()}` }, ...list]);
      toast(`Entry recorded — ${e.type === "income" ? "+" : "−"} रू ${e.amount.toLocaleString("en-IN")} (${e.entity})`);
    },
    [toast]
  );

  const deleteLedgerEntry = useCallback((id: string) => {
    setLedger((list) => list.filter((x) => x.id !== id));
  }, []);

  const value: AppCtx = {
    view, go, searchSeed, seedSearch,
    role, setRole,
    cart, cartCount, cartOpen, setCartOpen, addToCart, setQty, removeFromCart,
    wishlist, toggleWish,
    enrollments, enroll, completeLesson,
    bookings, addBooking, cancelBooking,
    orders, checkout,
    applications, apply,
    partnerLeads, submitPartner,
    certs,
    offers, addOffer,
    pendingVendors, approveVendor, rejectVendor,
    disputes, resolveDispute,
    affiliate, joinAffiliate,
    agreements, signAgreement,
    ledger, addLedgerEntry, deleteLedgerEntry,
    notices,
    unread: notices.filter((n) => !n.read).length,
    notify, markAllRead, clearNotices,
    festival, setFestival,
    joinSession,
    autopilot, setAutopilot,
    toasts, toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
