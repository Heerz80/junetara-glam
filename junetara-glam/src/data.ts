/* ============================================================
   JUNETARA GLAM — content model
   Nepal's integrated beauty ecosystem (Master Plan v1.0, Apr 2026)
   ============================================================ */

export const npr = (n: number) => `रू ${n.toLocaleString("en-IN")}`;

export const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/a768d9a7-73b1-44e3-ad86-a03174835c64/_result.png",
  skincare: "https://image.qwenlm.ai/generated-images/2f24c763-8456-4af7-9f18-f626e093179c/_result.png",
  hair: "https://image.qwenlm.ai/generated-images/712f7174-5b69-4fde-9bb3-532565fdca80/_result.png",
  nails: "https://image.qwenlm.ai/generated-images/875d9320-732f-4566-bd80-e4ad37072f75/_result.png",
  lash: "https://image.qwenlm.ai/generated-images/8ee0a515-cae5-4fe8-83bd-d5f726f388ee/_result.png",
  salon: "https://image.qwenlm.ai/generated-images/1d562596-f043-424d-8440-b7b781fd2aed/_result.png",
  lipstick: "https://image.qwenlm.ai/generated-images/47610587-6609-4e65-ac49-bd147964b23c/_result.png",
  palette: "https://image.qwenlm.ai/generated-images/79fe1371-67ae-4789-8087-74153ae57f38/_result.png",
  serum: "https://image.qwenlm.ai/generated-images/23e1335a-5633-4e01-9ed5-c8525be62749/_result.png",
  cream: "https://image.qwenlm.ai/generated-images/3faa8c01-f36e-489a-9021-e8701951cc04/_result.png",
};

export const CITIES = ["Kathmandu", "Lalitpur", "Pokhara", "Bharatpur", "Biratnagar", "Dharan"];

/* ---------------- training ---------------- */
export type Tier = "basic" | "advanced" | "diploma" | "master";

export const TIERS: Record<Tier, { label: string; months: string; range: string; color: string; desc: string }> = {
  basic: { label: "Basic Beautician", months: "3 months", range: "रू 15,000 – 30,000", color: "#2b52e1", desc: "Threading, waxing, basic facial, mani-pedi, everyday makeup" },
  advanced: { label: "Advanced Beautician", months: "6 months", range: "रू 30,000 – 60,000", color: "#ffb800", desc: "Hair cutting & colour, advanced facial, bridal basics, skin analysis" },
  diploma: { label: "Professional Diploma", months: "12 months", range: "रू 60,000 – 1,20,000", color: "#ea5240", desc: "Spa therapy, nail art, advanced bridal, salon management" },
  master: { label: "Master Specialist", months: "18–24 months", range: "रू 1,20,000 – 2,00,000", color: "#1a3b8b", desc: "Cosmetology, derma treatments, colour theory, teaching" },
};

export interface Course {
  id: string;
  title: string;
  cat: "Makeup" | "Hair" | "Skin" | "Nails" | "Bridal" | "Business";
  tier: Tier;
  months: number;
  fee: number;
  installment: number;
  city: string;
  center: string;
  rating: number;
  reviews: number;
  students: number;
  seats: number;
  img: string;
  ctevt: boolean;
  tags: string[];
  syllabus: string[];
  outcomes: string[];
  trainer: string;
  includes: string[];
}

export const COURSES: Course[] = [
  {
    id: "c1", title: "Basic Beautician Foundation", cat: "Skin", tier: "basic", months: 3, fee: 18000, installment: 3,
    city: "Kathmandu", center: "Himalayan Beauty Academy", rating: 4.7, reviews: 312, students: 1240, seats: 14,
    img: IMG.skincare, ctevt: true,
    tags: ["Beginner", "Kit included", "Job assistance"],
    syllabus: ["Threading & face shaping", "Waxing techniques & hygiene", "Basic facial systems", "Manicure & pedicure protocol", "Everyday makeup application", "Client care & salon etiquette", "Practical assessments & portfolio shoot"],
    outcomes: ["CTEVT-aligned certificate with QR verification", "80+ logged practical hours", "Eligibility for Junetara internship matching"],
    trainer: "Sunita Maharjan · 12 yrs, CTEVT assessor",
    includes: ["Full starter kit (रू 6,000 value)", "Digital certificate", "Internship placement support", "3-month mentorship"],
  },
  {
    id: "c2", title: "Advanced Hair Design & Colour", cat: "Hair", tier: "advanced", months: 6, fee: 45000, installment: 4,
    city: "Kathmandu", center: "Everest Aesthetic Institute", rating: 4.8, reviews: 201, students: 640, seats: 10,
    img: IMG.hair, ctevt: true,
    tags: ["Balayage", "Chemical safety", "Portfolio build"],
    syllabus: ["Precision cutting systems", "Global & root colour chemistry", "Balayage & foiling", "Keratin & smoothing treatments", "Bridal hair foundations", "Skin & scalp analysis", "Client consultation mastery"],
    outcomes: ["Advanced certificate (QR verified)", "12 model-client sessions logged", "Priority listing as Junetara artist"],
    trainer: "Rajesh Karki · Session stylist, 14 yrs",
    includes: ["Colour & tool kit", "Mannequin + live models", "Digital certificate", "Salon referral network"],
  },
  {
    id: "c3", title: "Professional Beauty Diploma", cat: "Makeup", tier: "diploma", months: 12, fee: 95000, installment: 6,
    city: "Kathmandu", center: "Himalayan Beauty Academy", rating: 4.9, reviews: 154, students: 380, seats: 8,
    img: IMG.hero, ctevt: true,
    tags: ["Full career track", "Spa + bridal", "Management"],
    syllabus: ["Advanced hair chemicals", "Spa & body therapy systems", "Nail art & extensions", "Advanced bridal artistry", "HD & airbrush makeup", "Skin analysis & treatment plans", "Salon operations & management", "Business & client psychology"],
    outcomes: ["Diploma with national recognition pathway", "200+ practical hours", "Salon-manager readiness track"],
    trainer: "Panel of 6 senior trainers",
    includes: ["Complete professional kit", "Monthly masterclasses", "Digital certificate", "Job guarantee interviews"],
  },
  {
    id: "c4", title: "Master Cosmetology Specialist", cat: "Skin", tier: "master", months: 18, fee: 160000, installment: 8,
    city: "Lalitpur", center: "Lalitpur Skill & Beauty Center", rating: 4.9, reviews: 67, students: 92, seats: 6,
    img: IMG.skincare, ctevt: true,
    tags: ["Derma treatments", "Teaching license", "Elite"],
    syllabus: ["Clinical cosmetology theory", "Derma treatments & devices", "Advanced colour science", "Treatment-room safety & ethics", "Business management & accounts", "Curriculum design & teaching methods", "Research project & defence"],
    outcomes: ["Master specialist credential", "Licensed to train Tier 1–2 students", "Academy partnership pathway"],
    trainer: "Dr. Anisha Shrestha · Cosmetologist",
    includes: ["Derma device access", "International guest faculty", "Digital certificate", "Trainer database listing"],
  },
  {
    id: "c5", title: "Bridal Artistry Intensive", cat: "Bridal", tier: "advanced", months: 2, fee: 42000, installment: 2,
    city: "Kathmandu", center: "Moonlight Bridal Atelier", rating: 4.8, reviews: 268, students: 510, seats: 12,
    img: IMG.hero, ctevt: false,
    tags: ["Weekend batches", "Mehndi add-on", "Live brides"],
    syllabus: ["Nepali bridal traditions & looks", "HD, airbrush & long-wear systems", "Draping, jewellery setting & styling", "Mehndi fundamentals", "Photography-ready finishing", "Pricing, packages & client contracts"],
    outcomes: ["Bridal specialist badge on Junetara profile", "3 assisted live bridal bookings", "Portfolio with professional photographer"],
    trainer: "Sabina Maharjan · 400+ brides, 9 yrs",
    includes: ["Bridal kit access", "Live-model weekends", "Digital certificate", "Featured artist listing (1 month)"],
  },
  {
    id: "c6", title: "Nail Art & Extensions Pro", cat: "Nails", tier: "advanced", months: 3, fee: 35000, installment: 3,
    city: "Pokhara", center: "Pokhara Glam Studio & Academy", rating: 4.6, reviews: 143, students: 350, seats: 12,
    img: IMG.nails, ctevt: false,
    tags: ["Gel & acrylic", "Nail health", "Trend-led"],
    syllabus: ["Nail anatomy & hygiene", "Gel polish systems", "Acrylic & hard-gel extensions", "Nail art & embellishment", "E-file mastery & removal safety", "Client aftercare & retailing"],
    outcomes: ["Nail specialist certificate", "60 practice sets logged", "Home-service eligibility"],
    trainer: "Ritu Gurung · Nail artist, 6 yrs",
    includes: ["Gel & acrylic kit", "UV/LED lamp", "Digital certificate", "Supplier discounts"],
  },
  {
    id: "c7", title: "Ayurvedic & Organic Skin Therapy", cat: "Skin", tier: "advanced", months: 4, fee: 52000, installment: 4,
    city: "Kathmandu", center: "Parijat Wellness Institute", rating: 4.7, reviews: 118, students: 280, seats: 10,
    img: IMG.skincare, ctevt: true,
    tags: ["Ayurveda", "Organic formulations", "Wellness"],
    syllabus: ["Ayurvedic dosha & skin typing", "Herbal formulation basics", "Organic facial rituals", "Head & abhyanga massage", "Nutrition for skin health", "Sourcing Nepali botanicals"],
    outcomes: ["Ayurvedic skin therapist certificate", "Formulation portfolio of 10 recipes", "Wellness-center placement list"],
    trainer: "Baidya Ram Krishna Adhikari · 20 yrs",
    includes: ["Herbal formulation kit", "Garden-to-product field day", "Digital certificate"],
  },
  {
    id: "c8", title: "Salon Business & Management", cat: "Business", tier: "diploma", months: 3, fee: 40000, installment: 3,
    city: "Kathmandu", center: "Everest Aesthetic Institute", rating: 4.5, reviews: 96, students: 210, seats: 20,
    img: IMG.salon, ctevt: false,
    tags: ["Entrepreneurship", "For owners", "Digital tools"],
    syllabus: ["Salon economics & unit pricing", "Staff hiring, rosters & retention", "Inventory & B2B procurement", "Digital marketing for salons (TikTok/IG)", "Junetara vendor dashboard mastery", "Licensing, tax & compliance in Nepal"],
    outcomes: ["Business-ready salon launch plan", "Junetara premium vendor listing (3 months free)", "Owner community membership"],
    trainer: "Heera B. Bhandari · BPI strategic consultant",
    includes: ["Financial templates", "Vendor dashboard training", "Certificate", "1:1 launch consultation"],
  },
];

/* ---------------- services & venues ---------------- */
export interface Service { id: string; name: string; nep: string; cat: string; price: number; minutes: number; icon: string; desc: string; }

export const SERVICES: Service[] = [
  { id: "s1", name: "Haircut & Styling", nep: "कपाल काट्ने", cat: "Hair", price: 800, minutes: 45, icon: "scissors", desc: "Precision cut, wash and finish by a listed stylist." },
  { id: "s2", name: "Hair Colour / Balayage", nep: "कपाल रंगाउने", cat: "Hair", price: 3500, minutes: 150, icon: "droplet", desc: "Global colour, roots or balayage with bond care." },
  { id: "s3", name: "Classic Facial", nep: "फेसियल", cat: "Skin", price: 1200, minutes: 60, icon: "sparkle", desc: "Deep cleanse, exfoliation, massage and hydration." },
  { id: "s4", name: "Gold Radiance Facial", nep: "गोल्ड फेसियल", cat: "Skin", price: 2800, minutes: 75, icon: "gem", desc: "24k-infused ritual for event-ready glow." },
  { id: "s5", name: "Bridal Makeup Package", nep: "विवाह मेकअप", cat: "Bridal", price: 25000, minutes: 180, icon: "brush", desc: "HD makeup, hair, draping + trial session included." },
  { id: "s6", name: "Mehndi (Both Hands)", nep: "मेहन्दी", cat: "Bridal", price: 1500, minutes: 90, icon: "flower", desc: "Bridal or festive henna by a certified artist." },
  { id: "s7", name: "Manicure & Pedicure", nep: "म्यानिक्योर-पेडिक्योर", cat: "Nails", price: 1800, minutes: 75, icon: "nail", desc: "Spa mani-pedi with cuticle care and polish." },
  { id: "s8", name: "Gel Nail Art", nep: "नेल आर्ट", cat: "Nails", price: 2200, minutes: 90, icon: "nail", desc: "Gel extensions with custom art of your choice." },
  { id: "s9", name: "Full Body Spa Massage", nep: "स्पा मसाज", cat: "Wellness", price: 3500, minutes: 90, icon: "leaf", desc: "Ayurvedic or Swedish, with herbal oils." },
  { id: "s10", name: "Lash Lift & Tint", nep: "ल्यास लिफ्ट", cat: "Skin", price: 2500, minutes: 60, icon: "eye", desc: "Lift, tint and brow shaping in one sitting." },
];

export interface Salon { id: string; name: string; area: string; city: string; rating: number; reviews: number; level: 1 | 2 | 3; verified: boolean; home: boolean; img: string; tags: string[]; }

export const SALONS: Salon[] = [
  { id: "v1", name: "Asha Beauty Lounge", area: "Thamel", city: "Kathmandu", rating: 4.8, reviews: 421, level: 2, verified: true, home: true, img: IMG.salon, tags: ["Bridal", "Hair", "Facial"] },
  { id: "v2", name: "Kasturi Salon & Spa", area: "Lazimpat", city: "Kathmandu", rating: 4.7, reviews: 356, level: 3, verified: true, home: false, img: IMG.salon, tags: ["Spa", "Ayurvedic", "Hair"] },
  { id: "v3", name: "The Glam Room", area: "New Baneshwor", city: "Kathmandu", rating: 4.6, reviews: 289, level: 2, verified: true, home: true, img: IMG.hero, tags: ["Makeup", "Nails", "Lash"] },
  { id: "v4", name: "Parijat Wellness Studio", area: "Jhamsikhel", city: "Lalitpur", rating: 4.9, reviews: 198, level: 3, verified: true, home: true, img: IMG.skincare, tags: ["Ayurvedic", "Facial", "Massage"] },
  { id: "v5", name: "Moonlight Bridal Atelier", area: "Durbar Marg", city: "Kathmandu", rating: 4.9, reviews: 512, level: 3, verified: true, home: true, img: IMG.hero, tags: ["Bridal", "Mehndi", "Events"] },
  { id: "v6", name: "Rhododendron Family Parlour", area: "Lakeside", city: "Pokhara", rating: 4.5, reviews: 167, level: 1, verified: true, home: false, img: IMG.hair, tags: ["Hair", "Facial", "Family"] },
];

export interface Artist { id: string; name: string; spec: string; years: number; rating: number; bookings: number; city: string; home: boolean; initials: string; }

export const ARTISTS: Artist[] = [
  { id: "a1", name: "Sabina Maharjan", spec: "Bridal & HD makeup", years: 9, rating: 4.9, bookings: 1120, city: "Kathmandu", home: true, initials: "SM" },
  { id: "a2", name: "Priya Shrestha", spec: "Hair colour & balayage", years: 7, rating: 4.8, bookings: 860, city: "Kathmandu", home: false, initials: "PS" },
  { id: "a3", name: "Anita Tamang", spec: "Skin & Ayurvedic therapy", years: 6, rating: 4.8, bookings: 740, city: "Lalitpur", home: true, initials: "AT" },
  { id: "a4", name: "Ritu Gurung", spec: "Nail art & extensions", years: 5, rating: 4.7, bookings: 690, city: "Pokhara", home: true, initials: "RG" },
  { id: "a5", name: "Maya K.C.", spec: "Lash, brow & facial", years: 4, rating: 4.6, bookings: 530, city: "Kathmandu", home: true, initials: "MK" },
  { id: "a6", name: "Sunita Rai", spec: "Mehndi & festive art", years: 8, rating: 4.9, bookings: 940, city: "Kathmandu", home: true, initials: "SR" },
];

/* ---------------- live sessions ---------------- */
export interface LiveSession {
  id: string;
  title: string;
  trainer: string;
  initials: string;
  cat: string;
  tier: string;
  img: string;
  status: "live" | "upcoming";
  startedMinAgo?: number;
  durationMin: number;
  viewers: number;
  startsIn?: string;
}

export const LIVE_SESSIONS: LiveSession[] = [
  { id: "ls1", title: "HD Bridal Base — live demo on a real bride", trainer: "Sabina Maharjan", initials: "SM", cat: "Bridal", tier: "Advanced", img: IMG.hero, status: "live", startedMinAgo: 23, durationMin: 90, viewers: 236 },
  { id: "ls2", title: "Balayage sectioning — open student Q&A", trainer: "Rajesh Karki", initials: "RK", cat: "Hair", tier: "Advanced", img: IMG.hair, status: "live", startedMinAgo: 47, durationMin: 120, viewers: 118 },
  { id: "ls3", title: "Gel extension troubleshooting clinic", trainer: "Ritu Gurung", initials: "RG", cat: "Nails", tier: "Basic", img: IMG.nails, status: "live", startedMinAgo: 9, durationMin: 60, viewers: 74 },
  { id: "ls4", title: "Ayurvedic dosha skin typing workshop", trainer: "Baidya R.K. Adhikari", initials: "RA", cat: "Skin", tier: "Advanced", img: IMG.skincare, status: "upcoming", startsIn: "In 40 min", durationMin: 75, viewers: 52 },
  { id: "ls5", title: "Lash lift aftercare masterclass", trainer: "Maya K.C.", initials: "MK", cat: "Skin", tier: "Basic", img: IMG.lash, status: "upcoming", startsIn: "Today 19:00", durationMin: 60, viewers: 91 },
  { id: "ls6", title: "Salon pricing & unit economics", trainer: "Heera B. Bhandari", initials: "HB", cat: "Business", tier: "Diploma", img: IMG.salon, status: "upcoming", startsIn: "Tomorrow 11:00", durationMin: 90, viewers: 143 },
];

/* ---------------- marketplace ---------------- */
export interface Product { id: string; name: string; cat: "Skin" | "Hair" | "Makeup" | "Tools" | "B2B Supplies"; price: number; mrp: number; rating: number; reviews: number; img: string | null; art: "wax" | "towels" | "ring" | null; b2b: boolean; badge?: string; nepali?: boolean; origin?: string; }

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Kumari Glow Vitamin-C Serum", cat: "Skin", price: 2450, mrp: 2900, rating: 4.8, reviews: 342, img: IMG.serum, art: null, b2b: false, badge: "Bestseller" },
  { id: "p2", name: "Rhododendron Rosewater Mist", cat: "Skin", price: 950, mrp: 1200, rating: 4.7, reviews: 218, img: IMG.cream, art: null, b2b: false },
  { id: "p3", name: "Himalayan Clay Face Mask", cat: "Skin", price: 1450, mrp: 1750, rating: 4.6, reviews: 164, img: IMG.cream, art: null, b2b: false, badge: "Organic" },
  { id: "p4", name: "Chiya Green-Tea Shampoo", cat: "Hair", price: 1150, mrp: 1400, rating: 4.5, reviews: 129, img: IMG.serum, art: null, b2b: false, nepali: true, origin: "Ilam tea gardens" },
  { id: "p5", name: "Traditional Ayurvedic Hair Oil", cat: "Hair", price: 850, mrp: 1050, rating: 4.8, reviews: 401, img: IMG.serum, art: null, b2b: false, badge: "Ayurvedic", nepali: true, origin: "Ayurvedic vaidyas, Kathmandu" },
  { id: "p6", name: "Bridal Red Velvet Lipstick", cat: "Makeup", price: 1650, mrp: 2000, rating: 4.7, reviews: 276, img: IMG.lipstick, art: null, b2b: false, badge: "Bridal pick" },
  { id: "p7", name: "Marigold Eyeshadow Palette", cat: "Makeup", price: 2850, mrp: 3400, rating: 4.8, reviews: 198, img: IMG.palette, art: null, b2b: false },
  { id: "p8", name: "Pro Wax Heater Kit (salon)", cat: "B2B Supplies", price: 8500, mrp: 9900, rating: 4.6, reviews: 54, img: null, art: "wax", b2b: true, badge: "Vendor kit" },
  { id: "p9", name: "Salon Towel Set ×12", cat: "B2B Supplies", price: 3200, mrp: 3800, rating: 4.5, reviews: 41, img: null, art: "towels", b2b: true },
  { id: "p10", name: "LED Ring Light Pro 45cm", cat: "Tools", price: 6500, mrp: 7500, rating: 4.7, reviews: 88, img: null, art: "ring", b2b: true, badge: "Creator kit" },
  { id: "p11", name: "Gurans Rhododendron Serum", cat: "Skin", price: 1950, mrp: 2400, rating: 4.9, reviews: 156, img: IMG.serum, art: null, b2b: false, badge: "Made in Nepal", nepali: true, origin: "Rhododendron forests, Kaski" },
  { id: "p12", name: "Timur Citrus Lip Tint", cat: "Makeup", price: 850, mrp: 1050, rating: 4.7, reviews: 203, img: IMG.lipstick, art: null, b2b: false, nepali: true, origin: "Mid-hill timur farms" },
  { id: "p13", name: "Allo Nettle Body Scrub", cat: "Skin", price: 1150, mrp: 1400, rating: 4.6, reviews: 97, img: IMG.cream, art: null, b2b: false, nepali: true, origin: "Bajhang nettle weavers" },
  { id: "p14", name: "Mustang Apple Cider Toner", cat: "Skin", price: 1350, mrp: 1600, rating: 4.8, reviews: 134, img: IMG.serum, art: null, b2b: false, badge: "New harvest", nepali: true, origin: "Mustang apple orchards" },
  { id: "p15", name: "Ilam First-Flush Shampoo", cat: "Hair", price: 980, mrp: 1200, rating: 4.7, reviews: 178, img: IMG.serum, art: null, b2b: false, nepali: true, origin: "Ilam tea gardens" },
  { id: "p16", name: "Dhaka Weave Vanity Pouch", cat: "Tools", price: 1450, mrp: 1750, rating: 4.8, reviews: 76, img: IMG.palette, art: null, b2b: false, badge: "Handwoven", nepali: true, origin: "Palpa dhaka artisans" },
  { id: "p17", name: "Terai Aloe & Neem Pack", cat: "Skin", price: 750, mrp: 900, rating: 4.5, reviews: 112, img: IMG.cream, art: null, b2b: false, nepali: true, origin: "Bardiya aloe farms" },
];

/* ---------------- talent system ---------------- */
export interface Listing { id: string; kind: "internship" | "job"; title: string; org: string; area: string; pay: string; level: string; skills: string[]; }

export const INTERNSHIPS: Listing[] = [
  { id: "i1", kind: "internship", title: "Junior Bridal Assistant", org: "Moonlight Bridal Atelier", area: "Durbar Marg, KTM", pay: "रू 12,000/mo stipend", level: "Diploma graduate", skills: ["HD makeup", "Draping", "Client care"] },
  { id: "i2", kind: "internship", title: "Salon Therapy Trainee", org: "Kasturi Salon & Spa", area: "Lazimpat, KTM", pay: "रू 10,000/mo stipend", level: "Basic tier graduate", skills: ["Facial", "Spa protocol"] },
  { id: "i3", kind: "internship", title: "Nail Art Assistant", org: "The Glam Room", area: "New Baneshwor, KTM", pay: "रू 9,000/mo stipend", level: "Nail cert holder", skills: ["Gel systems", "Art finishing"] },
  { id: "i4", kind: "internship", title: "Hair Colour Assistant", org: "Asha Beauty Lounge", area: "Thamel, KTM", pay: "रू 11,000/mo stipend", level: "Advanced tier", skills: ["Foiling", "Colour mixing"] },
];

export const JOBS: Listing[] = [
  { id: "j1", kind: "job", title: "Senior Hair Stylist", org: "Asha Beauty Lounge", area: "Thamel, KTM", pay: "रू 35,000–50,000/mo", level: "3+ yrs experience", skills: ["Precision cuts", "Balayage"] },
  { id: "j2", kind: "job", title: "Skin Therapist", org: "Parijat Wellness Studio", area: "Jhamsikhel, Lalitpur", pay: "रू 28,000–40,000/mo", level: "Ayurvedic cert", skills: ["Facial systems", "Massage"] },
  { id: "j3", kind: "job", title: "Academy Trainer (CTEVT)", org: "Himalayan Beauty Academy", area: "KTM", pay: "रू 45,000–60,000/mo", level: "Master tier / 5+ yrs", skills: ["Curriculum", "Assessment"] },
  { id: "j4", kind: "job", title: "Bridal Makeup Artist", org: "Junetara Home Services", area: "Valley-wide", pay: "Per-event + commission", level: "Bridal specialist badge", skills: ["HD makeup", "Own kit"] },
];

export interface Trainer { id: string; name: string; spec: string; creds: string; years: number; students: number; rating: number; initials: string; }

export const TRAINERS: Trainer[] = [
  { id: "t1", name: "Sunita Maharjan", spec: "Beauty fundamentals", creds: "CTEVT assessor · Basic & Advanced tiers", years: 12, students: 1240, rating: 4.8, initials: "SM" },
  { id: "t2", name: "Dr. Anisha Shrestha", spec: "Cosmetology & derma", creds: "MBBS + Cosmetology (Seoul) · Master tier", years: 10, students: 92, rating: 4.9, initials: "AS" },
  { id: "t3", name: "Rajesh Karki", spec: "Hair design & colour", creds: "Vidal Sassoon trained · Advanced tier", years: 14, students: 640, rating: 4.8, initials: "RK" },
  { id: "t4", name: "Baidya R.K. Adhikari", spec: "Ayurvedic therapy", creds: "BAMS · Ayurvedic skin certification", years: 20, students: 280, rating: 4.7, initials: "RA" },
];

export const SEED_CERTS = [
  { id: "JG-2026-0147", holder: "Sunita Kumari Tharu", course: "Basic Beautician Foundation", center: "Himalayan Beauty Academy", date: "Jan 2026", hours: 96 },
  { id: "JG-2025-0892", holder: "Prakash Bahadur Lama", course: "Advanced Hair Design & Colour", center: "Everest Aesthetic Institute", date: "Nov 2025", hours: 140 },
  { id: "JG-2025-0310", holder: "Roshani Karki", course: "Bridal Artistry Intensive", center: "Moonlight Bridal Atelier", date: "Aug 2025", hours: 64 },
];

/* ---------------- market intelligence ---------------- */
export const MARKET_SEGMENTS = [
  { label: "Personal care products", usd: "USD 896M", width: 100, cagr: "3.7%" },
  { label: "Skin care", usd: "USD 500M", width: 58, cagr: "3.3%" },
  { label: "Beauty services (salons/spas)", usd: "USD 150–250M", width: 24, cagr: "10–12%" },
  { label: "Cosmetics", usd: "USD 200M", width: 26, cagr: "3.9%" },
  { label: "Equipment & B2B", usd: "USD 30–50M", width: 8, cagr: "8–10%" },
  { label: "Beauty training & education", usd: "USD 15–25M", width: 5, cagr: "15–20%" },
];

export const ECOSYSTEM_LAYERS = [
  { n: "01", title: "Discovery", nep: "खोज", desc: "Search courses, salons, products and artists with GPS, price and rating filters.", icon: "search" },
  { n: "02", title: "Transaction", nep: "कारोबार", desc: "Booking, enrollment and checkout engines with eSewa, Khalti & Fonepay.", icon: "wallet" },
  { n: "03", title: "Fulfillment", nep: "पूर्ति", desc: "Scheduling, vendor management, SMS reminders and delivery logistics.", icon: "truck" },
  { n: "04", title: "Talent System", nep: "प्रतिभा", desc: "Internship matching, trainer database and QR-verified certification.", icon: "cap" },
  { n: "05", title: "Intelligence", nep: "बुद्धि", desc: "Ratings, AI recommendations and seasonal demand prediction.", icon: "pulse" },
];

export const DASHAIN_TARGET = "2026-10-20T00:00:00+05:45"; // Vijaya Dashami 2083

export const FESTIVAL_TICKER = [
  "शुभ दशैं २०८३ · Happy Dashain",
  "DASHAIN25 · 25% off festive bookings",
  "Bridal slots for Dashain week — 71% filled",
  "Mehndi artists fully booked Oct 14–19",
];

export const TICKER_ITEMS = [
  "47 bookings in the last hour",
  "312 artists online now",
  "Live: 3 home-service artists moving in Thamel",
  "Name-your-price bidding now live across the valley",
  "रू 4.2L processed today via eSewa · Khalti · Fonepay",
  "CTEVT spring intake — open",
  "New: Ayurvedic Skin Therapy · Parijat Institute",
  "Internships open at Moonlight Bridal Atelier",
];

export const MARQUEE_ITEMS = [
  "Training", "प्रशिक्षण", "Salon & Home Services", "सेवाहरू", "Marketplace", "बजार",
  "Careers", "अवसर", "Events & Bridal", "विवाह", "Verified by Junetara",
];

export const ROADMAP = [
  { sprint: "Sprint 1", weeks: "Week 1–3", title: "Foundation", desc: "Tech stack, database schema, auth, CI/CD pipeline", focus: "Backend + DevOps" },
  { sprint: "Sprint 2", weeks: "Week 4–6", title: "Core backend", desc: "User, Training & Marketplace microservices, payment integration", focus: "Backend + Integration" },
  { sprint: "Sprint 3", weeks: "Week 7–9", title: "Mobile app v1", desc: "Customer app: browse, search, book, pay · Vendor app: profile, listings", focus: "Flutter + UI/UX" },
  { sprint: "Sprint 4", weeks: "Week 10–11", title: "Admin + polish", desc: "Admin panel, testing, bug fixes, performance optimization", focus: "Full-stack + QA" },
  { sprint: "Sprint 5", weeks: "Week 12–13", title: "Launch prep", desc: "Beta with 10 vendors, store submission, launch marketing", focus: "QA + Marketing" },
];

export const REVENUE_STREAMS = [
  { stream: "Service booking commission", rate: "10–15%", y1: "18–36L" },
  { stream: "Course enrollment commission", rate: "8–12%", y1: "12–24L" },
  { stream: "Product sales commission", rate: "5–10%", y1: "6–12L" },
  { stream: "Vendor premium subscription", rate: "रू 1–5K/mo", y1: "6–12L" },
  { stream: "Featured listings", rate: "रू 500–2K/mo", y1: "3–6L" },
  { stream: "Certification fees", rate: "रू 500–1K/cert", y1: "1.5–3L" },
];

export const TESTIMONIALS = [
  { quote: "I trained at an unverified centre and learned nothing. The Junetara-listed diploma at Himalayan Academy got me hired in Thamel within a month.", name: "Sunita K. Tharu", role: "Diploma graduate · Kathmandu" },
  { quote: "Off-peak chairs sat empty for years. Since joining as a seed vendor, Tuesday afternoons are fully booked.", name: "Asha Bajracharya", role: "Owner · Asha Beauty Lounge" },
  { quote: "Booked a bridal trial at 11 pm from Pokhara, paid on Khalti, artist arrived at my door at 7 am. This is how Nepal should work.", name: "Prakriti Adhikari", role: "Bride · Pokhara" },
  { quote: "My QR certificate was scanned and verified by the salon owner on the spot. No more 'who trained you?' interrogation.", name: "Roshani Karki", role: "Bridal artist · Certified JG-2025-0310" },
];

export const PAYMENT_GATEWAYS = [
  { id: "esewa", name: "eSewa", color: "#3d7d3c" },
  { id: "khalti", name: "Khalti", color: "#5c2d91" },
  { id: "fonepay", name: "Fonepay", color: "#2e3192" },
];

/* ---------------- social hub ---------------- */
export interface SocialComment { id: string; author: string; text: string; }

export interface SocialPost {
  id: string;
  author: string;
  initials: string;
  color: string;
  role: string;
  city: string;
  time: string;
  text: string;
  tags: string[];
  img?: string;
  likes: number;
  comments: SocialComment[];
}

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "sp1", author: "Sabina Maharjan", initials: "SM", color: "#ea5240", role: "Bridal artist", city: "Kathmandu", time: "12m ago",
    text: "Fresh HD bridal base on a real bride — the trick is layering thin and setting with rosewater mist before powder. Full breakdown in tonight's live session! 🪔",
    tags: ["#BridalSeason", "#HDMakeup"], img: IMG.hero, likes: 342,
    comments: [
      { id: "c1", author: "Prakriti A.", text: "Booked my trial for Saturday after watching your last live!" },
      { id: "c2", author: "Moonlight Atelier", text: "Seats filling fast — 4 left for tonight 🙌" },
    ],
  },
  {
    id: "sp2", author: "Parijat Botanics", initials: "PB", color: "#2b52e1", role: "Brand partner", city: "Lalitpur", time: "1h ago",
    text: "Our Gurans rhododendron serum just hit 1,000 bottles sold on the marketplace. Every batch is wild-harvested with the Kaski forest cooperative — thank you for choosing Nepali 🌸",
    tags: ["#MadeInNepal", "#Gurans"], img: IMG.serum, likes: 218,
    comments: [{ id: "c3", author: "Anita Tamang", text: "My clients ask for it by name now. Restock please!" }],
  },
  {
    id: "sp3", author: "Ritu Gurung", initials: "RG", color: "#ffb800", role: "Nail artist", city: "Pokhara", time: "3h ago",
    text: "Lakeside brides want chrome + terracotta this season. Six sets done this week, all booked through Junetara home service. The bid system is magic ✨",
    tags: ["#NailArt", "#Pokhara"], img: IMG.nails, likes: 167,
    comments: [{ id: "c4", author: "Maya K.C.", text: "Same trend hitting KTM! Share your chrome supplier 🙏" }],
  },
  {
    id: "sp4", author: "Himalayan Beauty Academy", initials: "HA", color: "#1a3b8b", role: "Training center", city: "Kathmandu", time: "5h ago",
    text: "Spring '26 Basic Beautician batch — 14 students, 12 already matched to internships through the talent layer. This is what the ecosystem is for. 🎓",
    tags: ["#CTEVT", "#SkillsNepal"], likes: 289,
    comments: [{ id: "c5", author: "Sunita K. Tharu", text: "Proud to be one of those 12. Started today at Asha Lounge!" }],
  },
  {
    id: "sp5", author: "Sunita Rai", initials: "SR", color: "#6483f2", role: "Mehndi artist", city: "Kathmandu", time: "8h ago",
    text: "Dashain bookings opened and my next 3 weeks are FULL. If you're a mehndi artist in Lalitpur or Bhaktapur, Junetara is routing overflow my way — join the network.",
    tags: ["#Dashain2083", "#Mehndi"], likes: 154,
    comments: [{ id: "c6", author: "New artist Priya", text: "Applying tonight. How long did verification take?" }, { id: "c7", author: "Junetara Team", text: "Usually under 48h — docs go through the Partner page 💛" }],
  },
  {
    id: "sp6", author: "Baidya R.K. Adhikari", initials: "RA", color: "#2e6b5c", role: "Ayurvedic trainer", city: "Kathmandu", time: "1d ago",
    text: "Dosha skin-typing workshop recordings are up for enrolled students. Vata skin needs oil FIRST, mist second — most of you had it backwards 😄",
    tags: ["#Ayurveda", "#SkinScience"], img: IMG.skincare, likes: 121,
    comments: [],
  },
];

export const TRENDING_TAGS = [
  { tag: "#Dashain2083", posts: "2.1K posts" },
  { tag: "#MadeInNepal", posts: "1.4K posts" },
  { tag: "#BridalSeason", posts: "986 posts" },
  { tag: "#CTEVT", posts: "640 posts" },
  { tag: "#NailArt", posts: "512 posts" },
];

export const TOP_CREATORS = [
  { name: "Sabina Maharjan", role: "Bridal · KTM", followers: "48.2K", growth: "+12%" },
  { name: "Ritu Gurung", role: "Nails · Pokhara", followers: "21.7K", growth: "+9%" },
  { name: "Parijat Botanics", role: "Brand · Lalitpur", followers: "18.4K", growth: "+21%" },
  { name: "Himalayan Academy", role: "Center · KTM", followers: "15.1K", growth: "+6%" },
];

/* ---------------- events ---------------- */
export interface GlamEvent {
  id: string;
  title: string;
  city: string;
  venue: string;
  date: string;
  day: string;
  month: string;
  time: string;
  price: number;
  seats: number;
  taken: number;
  cat: "Workshop" | "Expo" | "Competition" | "Community" | "Webinar";
  desc: string;
}

export const EVENTS: GlamEvent[] = [
  { id: "e1", title: "Dashain Bridal Showcase '83", city: "Kathmandu", venue: "Durbar Marg Grand Hall", date: "Sat, Sep 26", day: "26", month: "SEP", time: "11:00 – 17:00", price: 0, seats: 300, taken: 214, cat: "Expo", desc: "30 partner salons live-demo festive looks. Free entry, book your seat." },
  { id: "e2", title: "National Nail Art Championship", city: "Kathmandu", venue: "Bhrikutimandap Pavilion", date: "Sun, Oct 4", day: "04", month: "OCT", time: "10:00 – 16:00", price: 1500, seats: 60, taken: 41, cat: "Competition", desc: "Top 60 artists compete; winners get featured listings + रू 50K." },
  { id: "e3", title: "Ayurveda × Modern Skin Workshop", city: "Lalitpur", venue: "Parijat Wellness Studio", date: "Fri, Oct 9", day: "09", month: "OCT", time: "14:00 – 17:00", price: 2500, seats: 25, taken: 19, cat: "Workshop", desc: "Hands-on dosha formulation with Baidya Adhikari. Kit included." },
  { id: "e4", title: "Pokhara Beauty Meetup", city: "Pokhara", venue: "Lakeside Community Hall", date: "Sat, Oct 17", day: "17", month: "OCT", time: "15:00 – 18:00", price: 0, seats: 120, taken: 76, cat: "Community", desc: "Gandaki artists connect, swap kits, and meet the Junetara team." },
  { id: "e5", title: "CTEVT Certification Info Session", city: "Kathmandu", venue: "Online · Zoom", date: "Wed, Oct 21", day: "21", month: "OCT", time: "19:00 – 20:00", price: 0, seats: 500, taken: 342, cat: "Webinar", desc: "Everything about the four tiers, QR certificates and placements." },
  { id: "e6", title: "B2B Salon Supply Fair", city: "Kathmandu", venue: "NCC Trade Centre", date: "Sun, Nov 1", day: "01", month: "NOV", time: "10:00 – 18:00", price: 500, seats: 400, taken: 188, cat: "Expo", desc: "Wholesale pricing from 25 vendors — bring your Junetara vendor ID for 10% off." },
];

/* ---------------- national network ---------------- */
export interface Province {
  id: string;
  name: string;
  nep: string;
  hq: string;
  partners: number;
  status: "live" | "onboarding" | "planned";
  coverage: number;
}

export const PROVINCES: Province[] = [
  { id: "koshi", name: "Koshi", nep: "कोशी", hq: "Biratnagar", partners: 64, status: "live", coverage: 82 },
  { id: "madhesh", name: "Madhesh", nep: "मधेश", hq: "Janakpur", partners: 38, status: "onboarding", coverage: 54 },
  { id: "bagmati", name: "Bagmati", nep: "बागमती", hq: "Kathmandu", partners: 190, status: "live", coverage: 100 },
  { id: "gandaki", name: "Gandaki", nep: "गण्डकी", hq: "Pokhara", partners: 57, status: "live", coverage: 88 },
  { id: "lumbini", name: "Lumbini", nep: "लुम्बिनी", hq: "Butwal", partners: 29, status: "onboarding", coverage: 41 },
  { id: "karnali", name: "Karnali", nep: "कर्णाली", hq: "Birendranagar", partners: 7, status: "planned", coverage: 12 },
  { id: "sudur", name: "Sudurpashchim", nep: "सुदूरपश्चिम", hq: "Dhangadhi", partners: 15, status: "onboarding", coverage: 35 },
];

export interface NetworkCity {
  id: string;
  city: string;
  province: string;
  x: number; // % on map
  y: number;
  vendors: number;
  artists: number;
  centers: number;
  demand: number;
  status: "live" | "onboarding" | "planned";
}

export const NETWORK_CITIES: NetworkCity[] = [
  { id: "ktm", city: "Kathmandu", province: "Bagmati", x: 62, y: 40, vendors: 96, artists: 148, centers: 62, demand: 420, status: "live" },
  { id: "lal", city: "Lalitpur", province: "Bagmati", x: 64, y: 52, vendors: 41, artists: 55, centers: 18, demand: 180, status: "live" },
  { id: "bkt", city: "Bhaktapur", province: "Bagmati", x: 68, y: 46, vendors: 12, artists: 18, centers: 5, demand: 95, status: "live" },
  { id: "bha", city: "Bharatpur", province: "Bagmati", x: 55, y: 56, vendors: 14, artists: 11, centers: 6, demand: 88, status: "onboarding" },
  { id: "het", city: "Hetauda", province: "Bagmati", x: 58, y: 66, vendors: 8, artists: 6, centers: 3, demand: 41, status: "onboarding" },
  { id: "pkr", city: "Pokhara", province: "Gandaki", x: 46, y: 44, vendors: 31, artists: 42, centers: 14, demand: 210, status: "live" },
  { id: "btl", city: "Butwal", province: "Lumbini", x: 34, y: 66, vendors: 12, artists: 9, centers: 5, demand: 62, status: "onboarding" },
  { id: "ngj", city: "Nepalgunj", province: "Lumbini", x: 24, y: 70, vendors: 6, artists: 5, centers: 2, demand: 38, status: "planned" },
  { id: "jnk", city: "Janakpur", province: "Madhesh", x: 70, y: 74, vendors: 10, artists: 8, centers: 4, demand: 55, status: "onboarding" },
  { id: "bir", city: "Biratnagar", province: "Koshi", x: 85, y: 56, vendors: 17, artists: 14, centers: 7, demand: 90, status: "live" },
  { id: "dhr", city: "Dharan", province: "Koshi", x: 82, y: 48, vendors: 8, artists: 6, centers: 3, demand: 44, status: "onboarding" },
  { id: "dhg", city: "Dhangadhi", province: "Sudurpashchim", x: 9, y: 58, vendors: 9, artists: 7, centers: 4, demand: 70, status: "onboarding" },
];

/* ---------------- business management / books ---------------- */
export const LEDGER_ENTITIES = ["Platform (HQ)", "Asha Beauty Lounge", "Chiya Beauty Supplies", "Himalayan Academy"];

export const LEDGER_CATS: Record<"income" | "expense", string[]> = {
  income: ["Commission", "Subscription", "Tuition", "Product sales", "Certification", "Featured listing"],
  expense: ["Salaries", "Marketing", "Cloud / AWS", "Rent", "Vendor payouts", "Supplies", "Misc"],
};

export interface SeedLedgerRow { id: string; entity: string; date: string; type: "income" | "expense"; category: string; note: string; amount: number }

export const SEED_LEDGER: SeedLedgerRow[] = [
  { id: "lg1", entity: "Platform (HQ)", date: "2026-01-08", type: "income", category: "Commission", note: "Jan service commissions (212 bookings)", amount: 186400 },
  { id: "lg2", entity: "Platform (HQ)", date: "2026-01-15", type: "income", category: "Subscription", note: "Premium vendors ×42", amount: 84000 },
  { id: "lg3", entity: "Platform (HQ)", date: "2026-01-20", type: "expense", category: "Salaries", note: "Core team ×6", amount: 210000 },
  { id: "lg4", entity: "Platform (HQ)", date: "2026-01-25", type: "expense", category: "Cloud / AWS", note: "ECS, RDS, CloudFront", amount: 28500 },
  { id: "lg5", entity: "Platform (HQ)", date: "2026-02-06", type: "income", category: "Commission", note: "Feb commissions (268 bookings)", amount: 234800 },
  { id: "lg6", entity: "Platform (HQ)", date: "2026-02-12", type: "income", category: "Certification", note: "QR certificates ×154", amount: 115500 },
  { id: "lg7", entity: "Platform (HQ)", date: "2026-02-18", type: "expense", category: "Marketing", note: "TikTok + influencer wave 2", amount: 145000 },
  { id: "lg8", entity: "Platform (HQ)", date: "2026-02-26", type: "expense", category: "Salaries", note: "Core team ×6", amount: 210000 },
  { id: "lg9", entity: "Platform (HQ)", date: "2026-03-10", type: "income", category: "Commission", note: "Mar commissions (301 bookings)", amount: 276900 },
  { id: "lg10", entity: "Platform (HQ)", date: "2026-03-22", type: "expense", category: "Rent", note: "Sukedhara office · quarterly", amount: 90000 },
  { id: "lg11", entity: "Asha Beauty Lounge", date: "2026-02-14", type: "income", category: "Commission", note: "Valentine bookings (salon + home)", amount: 96500 },
  { id: "lg12", entity: "Asha Beauty Lounge", date: "2026-03-05", type: "expense", category: "Supplies", note: "Colour & keratin restock (Chiya B2B)", amount: 42800 },
  { id: "lg13", entity: "Asha Beauty Lounge", date: "2026-03-28", type: "income", category: "Commission", note: "Pre-Dashain bridal packages ×9", amount: 148000 },
  { id: "lg14", entity: "Chiya Beauty Supplies", date: "2026-02-20", type: "income", category: "Product sales", note: "Retail + salon wholesale", amount: 205300 },
  { id: "lg15", entity: "Chiya Beauty Supplies", date: "2026-03-15", type: "expense", category: "Vendor payouts", note: "Ilam & Bhaktapur suppliers", amount: 118600 },
  { id: "lg16", entity: "Himalayan Academy", date: "2026-02-02", type: "income", category: "Tuition", note: "Spring intake · Basic + Advanced tiers", amount: 486000 },
  { id: "lg17", entity: "Himalayan Academy", date: "2026-03-08", type: "expense", category: "Salaries", note: "Trainer panel ×6", amount: 174000 },
  { id: "lg18", entity: "Himalayan Academy", date: "2026-03-30", type: "income", category: "Certification", note: "Diploma certificates ×38", amount: 30400 },
];

/* ---------------- brand collabs & promotions ---------------- */
export interface Brand { id: string; name: string; cat: string; origin: string; since: number; color: string; initials: string; deal: string; }

export const BRANDS: Brand[] = [
  { id: "b1", name: "Kumari Cosmetics", cat: "Makeup", origin: "Kathmandu", since: 2024, color: "#ea5240", initials: "KC", deal: "Dashain Glow Fest · 25% off" },
  { id: "b2", name: "Parijat Botanics", cat: "Organic skincare", origin: "Lalitpur", since: 2024, color: "#2b52e1", initials: "PB", deal: "Buy 2 get 1 · all mists" },
  { id: "b3", name: "Chiya Beauty Co.", cat: "Haircare", origin: "Ilam", since: 2025, color: "#ffb800", initials: "CB", deal: "15% off B2B restocks" },
  { id: "b4", name: "EverGlow Labs", cat: "Professional skin", origin: "Kathmandu", since: 2025, color: "#1a3b8b", initials: "EG", deal: "Academy kit sponsor" },
  { id: "b5", name: "Rhodo Organics", cat: "Ayurvedic", origin: "Pokhara", since: 2025, color: "#6483f2", initials: "RO", deal: "New: herbal hair oils" },
  { id: "b6", name: "Himal Aura", cat: "Body & fragrance", origin: "Bhaktapur", since: 2026, color: "#7a5c9e", initials: "HA", deal: "Spa ritual bundles" },
  { id: "b7", name: "GlowTheory Pro", cat: "Salon equipment", origin: "Kathmandu", since: 2026, color: "#4a5d23", initials: "GT", deal: "Vendor kit financing" },
  { id: "b8", name: "Luna & Lace", cat: "Bridal accessories", origin: "Kathmandu", since: 2026, color: "#b0763f", initials: "LL", deal: "Bridal week showcase" },
];

export interface Promo { brand: string; title: string; off: string; code: string; ends: string; tag: string; desc: string; }

export const PROMOTIONS: Promo[] = [
  { brand: "Kumari Cosmetics", title: "Dashain Glow Fest", off: "25% OFF", code: "DASHAIN25", ends: "2026-12-20", tag: "Festive", desc: "Bridal & party makeup kits, palettes and velvet lipsticks." },
  { brand: "Parijat Botanics", title: "Botanic Skin Week", off: "15% OFF", code: "JG-BOTANIC", ends: "2026-11-30", tag: "Skincare", desc: "Rosewater mists, clay masks and organic serums." },
  { brand: "Chiya Beauty Co.", title: "Salon Restock Days", off: "15% OFF B2B", code: "JG-RESTOCK", ends: "2026-11-15", tag: "Wholesale", desc: "Tea-oil haircare cases for salons and academies." },
  { brand: "Junetara Glam", title: "Welcome Glow", off: "10% OFF", code: "JG-WELCOME10", ends: "2099-12-31", tag: "New users", desc: "Your first marketplace order, on us. Always on." },
];

export const PROMOS: { code: string; pct: number }[] = [
  { code: "DASHAIN25", pct: 25 },
  { code: "JG-BOTANIC", pct: 15 },
  { code: "JG-RESTOCK", pct: 15 },
  { code: "JG-WELCOME10", pct: 10 },
];

export const COLLAB_TYPES = [
  { n: "01", title: "Marketplace placement", desc: "Featured shelves, kit bundles and B2B wholesale listings — with sales analytics back to your brand team.", metric: "5–10% commission" },
  { n: "02", title: "Festival campaigns", desc: "Dashain & Tihar Glow Fests, wedding-season takeovers and co-branded promo codes tracked end-to-end.", metric: "2–4× campaign ROI" },
  { n: "03", title: "Academy sponsorship", desc: "Brand your curriculum module: sponsored student kits, certified-by-brand diplomas, campus activations.", metric: "500+ students/yr reach" },
  { n: "04", title: "Artist collective", desc: "40+ verified Junetara artists demo and retail your products in salons and home services nationwide.", metric: "312 artists online" },
];

/* ---------------- affiliate program ---------------- */
export const AFFILIATE_TIERS = [
  { tier: "Creator", req: "1K+ social followers", rate: "5%", payout: "Monthly · eSewa" },
  { tier: "Academy partner", req: "Registered training centre", rate: "6%", payout: "Monthly · bank" },
  { tier: "Salon chain", req: "3+ outlets", rate: "8%", payout: "Monthly · bank" },
];

export const LEADERBOARD = [
  { name: "Priya K.", channel: "TikTok · 210K", clicks: 4820, conv: 143, earn: 86400 },
  { name: "Sabina M.", channel: "Instagram · 95K", clicks: 3110, conv: 104, earn: 61200 },
  { name: "Glow with Ritu", channel: "YouTube · 64K", clicks: 2540, conv: 71, earn: 42800 },
  { name: "Anita T.", channel: "Reels · 38K", clicks: 1480, conv: 52, earn: 30100 },
  { name: "Everest Academy", channel: "Partner · KTM", clicks: 1120, conv: 47, earn: 28900 },
];

/* ---------------- service provider (salon) dashboard ---------------- */
export const SALON_SCHEDULE = [
  { time: "10:00", service: "Haircut & Styling", artist: "Priya", status: "done" },
  { time: "11:30", service: "Gold Radiance Facial", artist: "Maya", status: "done" },
  { time: "13:00", service: "Bridal Trial — package", artist: "Sabina", status: "in-chair" },
  { time: "15:00", service: "Mehndi consult", artist: "Sunita", status: "confirmed" },
  { time: "17:30", service: "Hair Colour / Balayage", artist: "Priya", status: "confirmed" },
];

export const SALON_RATINGS = [
  { dim: "Quality", pct: 98 },
  { dim: "Hygiene", pct: 96 },
  { dim: "Punctuality", pct: 92 },
  { dim: "Value", pct: 90 },
];

export const SALON_REVENUE = [
  { m: "Mon", v: 1.1 }, { m: "Tue", v: 0.8 }, { m: "Wed", v: 1.4 }, { m: "Thu", v: 1.9 },
  { m: "Fri", v: 2.6 }, { m: "Sat", v: 3.4 }, { m: "Sun", v: 1.2 },
];

/* ---------------- product vendor dashboard ---------------- */
export const INVENTORY = [
  { name: "Kumari Glow Vitamin-C Serum", sku: "KC-SER-01", stock: 142, cap: 200, price: 2450 },
  { name: "Rhododendron Rosewater Mist", sku: "PB-MST-04", stock: 18, cap: 100, price: 950 },
  { name: "Traditional Ayurvedic Hair Oil", sku: "CB-OIL-02", stock: 6, cap: 80, price: 850 },
  { name: "Bridal Red Velvet Lipstick", sku: "KC-LIP-11", stock: 88, cap: 120, price: 1650 },
  { name: "Marigold Eyeshadow Palette", sku: "KC-PAL-07", stock: 34, cap: 120, price: 2850 },
  { name: "Pro Wax Heater Kit", sku: "GT-WAX-03", stock: 51, cap: 60, price: 8500 },
  { name: "Salon Towel Set ×12", sku: "GT-TWL-09", stock: 9, cap: 60, price: 3200 },
  { name: "LED Ring Light Pro 45cm", sku: "GT-RNG-05", stock: 27, cap: 40, price: 6500 },
];

export const VENDOR_ORDERS = [
  { id: "ORD-1042", buyer: "Asha Beauty Lounge", type: "B2B", items: 6, total: 24800, status: "Processing" },
  { id: "ORD-1039", buyer: "Roshani Karki", type: "B2C", items: 2, total: 3400, status: "Processing" },
  { id: "ORD-1031", buyer: "Kasturi Salon & Spa", type: "B2B", items: 12, total: 51200, status: "Shipped" },
  { id: "ORD-1027", buyer: "Prakriti A.", type: "B2C", items: 1, total: 2450, status: "Delivered" },
  { id: "ORD-1019", buyer: "The Glam Room", type: "B2B", items: 4, total: 18900, status: "Delivered" },
];

export const VENDOR_SALES = [
  { m: "W1", v: 2.2 }, { m: "W2", v: 2.8 }, { m: "W3", v: 2.5 }, { m: "W4", v: 3.6 }, { m: "W5", v: 4.1 }, { m: "W6", v: 3.9 },
];

/* ============================================================
   LIVE LAYER — InDrive-style realtime tracking & bidding
   ============================================================ */

export type SpotKind = "center" | "salon" | "artist";

export interface LiveSpot {
  id: string;
  kind: SpotKind;
  name: string;
  x: number; // % on valley map (0-100)
  y: number; // % on valley map (0-100)
  status: "online" | "busy" | "moving";
  detail: string;
}

export const SPOT_META: Record<SpotKind, { label: string; nep: string; color: string }> = {
  center: { label: "Training Center", nep: "प्रशिक्षण केन्द्र", color: "#2b52e1" },
  salon: { label: "Salon / Spa", nep: "सलून", color: "#ffb800" },
  artist: { label: "Home-Service Artist", nep: "घरेलु कलाकार", color: "#ff7a68" },
};

export const LIVE_SPOTS: LiveSpot[] = [
  { id: "ls1", kind: "center", name: "Everest Aesthetic Institute", x: 48, y: 21, status: "online", detail: "Advanced Hair & Colour · 10 seats left" },
  { id: "ls2", kind: "salon", name: "Kasturi Salon & Spa", x: 55, y: 28, status: "busy", detail: "4.7★ · Spa from रू 3,500 · 2 chairs free" },
  { id: "ls3", kind: "salon", name: "Asha Beauty Lounge", x: 44, y: 37, status: "online", detail: "4.8★ · Bridal & Facial · walk-in OK" },
  { id: "ls4", kind: "center", name: "Himalayan Beauty Academy", x: 47, y: 34, status: "online", detail: "CTEVT · Basic Beautician · 14 seats" },
  { id: "ls5", kind: "artist", name: "Sabina Maharjan", x: 58, y: 39, status: "moving", detail: "Bridal artist · 2.1 km · ~12 min away" },
  { id: "ls6", kind: "salon", name: "Moonlight Bridal Atelier", x: 52, y: 43, status: "busy", detail: "4.9★ · Bridal package रू 25,000" },
  { id: "ls7", kind: "salon", name: "The Glam Room", x: 67, y: 47, status: "online", detail: "4.6★ · Nails & Lash · home service" },
  { id: "ls8", kind: "artist", name: "Ritu Gurung", x: 39, y: 51, status: "moving", detail: "Nail art · 3.4 km · ~18 min away" },
  { id: "ls9", kind: "center", name: "Parijat Wellness Institute", x: 37, y: 58, status: "online", detail: "Ayurvedic Skin Therapy · 10 seats" },
  { id: "ls10", kind: "artist", name: "Maya K.C.", x: 62, y: 57, status: "moving", detail: "Lash & facial · 1.2 km · ~8 min away" },
  { id: "ls11", kind: "center", name: "Lalitpur Skill & Beauty Center", x: 49, y: 65, status: "online", detail: "Master Cosmetology · 6 seats" },
  { id: "ls12", kind: "salon", name: "Patan Heritage Parlour", x: 44, y: 71, status: "online", detail: "4.5★ · Family salon · facial रू 1,200" },
];

/* name-your-price bidding simulation rules */
export const OFFER_RULES = {
  minPct: 55,
  maxPct: 140,
  acceptAt: 90, // accept if offer >= 90% of base
  counterFloor: 70, // counter if 70-90%
};

/* ============================================================
   ROLE DASHBOARDS — Training Center & Admin data
   ============================================================ */

export interface CenterStudent {
  id: string;
  name: string;
  course: string;
  tier: string;
  progress: number;
  status: "active" | "at-risk" | "completed";
  feePaid: number;
}

export const CENTER_STUDENTS: CenterStudent[] = [
  { id: "st1", name: "Sunita K. Tharu", course: "Basic Beautician Foundation", tier: "Basic", progress: 86, status: "active", feePaid: 18000 },
  { id: "st2", name: "Prakash B. Lama", course: "Advanced Hair Design & Colour", tier: "Advanced", progress: 100, status: "completed", feePaid: 45000 },
  { id: "st3", name: "Roshani Karki", course: "Bridal Artistry Intensive", tier: "Advanced", progress: 62, status: "active", feePaid: 42000 },
  { id: "st4", name: "Anisha Tamang", course: "Basic Beautician Foundation", tier: "Basic", progress: 28, status: "at-risk", feePaid: 18000 },
  { id: "st5", name: "Bikash Shah", course: "Salon Business & Management", tier: "Diploma", progress: 74, status: "active", feePaid: 40000 },
  { id: "st6", name: "Maya Gurung", course: "Nail Art & Extensions Pro", tier: "Advanced", progress: 45, status: "active", feePaid: 35000 },
];

export const CENTER_REVENUE = [
  { m: "Nov", v: 2.1 }, { m: "Dec", v: 2.6 }, { m: "Jan", v: 3.4 },
  { m: "Feb", v: 3.1 }, { m: "Mar", v: 4.2 }, { m: "Apr", v: 4.8 },
];

export const ADMIN_REVENUE = [
  { m: "Nov", v: 4.5 }, { m: "Dec", v: 6.2 }, { m: "Jan", v: 8.1 },
  { m: "Feb", v: 9.4 }, { m: "Mar", v: 12.8 }, { m: "Apr", v: 15.2 },
];

export interface VendorApplication {
  id: string;
  name: string;
  type: string;
  city: string;
  docs: boolean;
  date: string;
}

export const SEED_VENDOR_QUEUE: VendorApplication[] = [
  { id: "va1", name: "Rhododendron Family Parlour", type: "Salon", city: "Pokhara", docs: true, date: "Apr 18" },
  { id: "va2", name: "Sunita Rai (Mehndi)", type: "Freelance Artist", city: "Kathmandu", docs: true, date: "Apr 19" },
  { id: "va3", name: "Everest Nail Studio", type: "Salon", city: "Bharatpur", docs: false, date: "Apr 20" },
  { id: "va4", name: "Gorkha Beauty Academy", type: "Training Center", city: "Kathmandu", docs: true, date: "Apr 20" },
];

export interface Dispute {
  id: string;
  booking: string;
  parties: string;
  amount: number;
  reason: string;
  date: string;
}

export const SEED_DISPUTES: Dispute[] = [
  { id: "dp1", booking: "BK-88213", parties: "Customer vs Asha Beauty Lounge", amount: 1200, reason: "Service rescheduled without notice", date: "Apr 19" },
  { id: "dp2", booking: "BK-87990", parties: "Customer vs Maya K.C.", amount: 2500, reason: "Home artist arrived 40 min late", date: "Apr 20" },
];
