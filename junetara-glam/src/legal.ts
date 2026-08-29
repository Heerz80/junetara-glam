/* ============================================================
   JUNETARA GLAM — Legal Centre
   Canonical document texts · serializers · file helpers
   Hosted plain-text copies live in /public/legal/ and deploy to
   junetaraglam.com/legal/JG-LGL-00X-*.txt on Vercel.
   ============================================================ */

export interface LegalDoc {
  id: string;
  code: string;
  file: string; // hosted under /legal/
  title: string;
  nep: string;
  kind: "Agreement" | "Policy";
  signable: boolean;
  audience: string;
  version: string;
  updated: string;
  summary: string;
  intro: string;
  sections: { h: string; b: string }[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "lgl-001",
    code: "JG-LGL-001",
    file: "JG-LGL-001-service-provider-agreement.txt",
    title: "Service Provider Agreement",
    nep: "सेवा प्रदायक सम्झौता",
    kind: "Agreement",
    signable: true,
    audience: "Salons · home-service artists · event teams",
    version: "v1.2",
    updated: "12 Apr 2026",
    summary: "The master contract for every salon and artist on Junetara — commission, settlement, quality standards and dispute resolution.",
    intro:
      "This Agreement is entered into between Junetara Glam Pvt. Ltd. (the “Company”, in registration), with offices at Sukedhara-4, Kathmandu and Dhangadhi-1, Kailali, and the Service Provider identified in the signature block (the “Provider”), effective as of the date of digital execution.",
    sections: [
      { h: "1. Scope of engagement", b: "The Provider lists beauty services (salon, home-service and event) on the Junetara Glam platform. The Company provides discovery, booking, payment collection, scheduling and SMS notification infrastructure." },
      { h: "2. Onboarding & verification", b: "The Provider submits a valid PAN, business registration (or freelancer declaration) and portfolio material. Verification completes within 7 working days; the ‘Junetara Verified’ badge is granted only after verification." },
      { h: "3. Commission schedule", b: "Salon bookings: 10–15% (level-based). Home services: 12%. Event/bridal teams: 15%. Seed partners onboarded in the first 90 days enjoy 0% commission for 6 months. Featured listings: NPR 500–2,000 per month." },
      { h: "4. Payments & settlement", b: "Customers pay via eSewa, Khalti or Fonepay. The Company deducts applicable commission and remits the balance to the Provider's registered merchant account within T+7 days, with a monthly payout statement." },
      { h: "5. Bookings, slots & cancellations", b: "Slots are held for 10 minutes during checkout. The Provider confirms requests within 15 minutes. Customer cancellation is free 24+ hours prior. Provider no-shows forfeit 50% of the booking value as customer credit." },
      { h: "6. Quality standards & ratings", b: "Multi-dimensional ratings (quality, hygiene, punctuality, value) are public. A sustained rating below 4.0 for 60 days triggers suspension pending review. Mystery-shopper audits may occur without notice." },
      { h: "7. Customer data & non-circumvention", b: "Customer data is used solely for service delivery, in line with the Privacy Act 2075 (2018). The Provider shall not divert platform-acquired customers off-platform for 12 months." },
      { h: "8. Insurance & liability", b: "The Provider maintains its own liability cover for treatments performed. The Company is a marketplace intermediary and is not liable for service outcomes; the Provider indemnifies the Company against misconduct claims." },
      { h: "9. Term & termination", b: "Initial term 12 months, auto-renewing. Either party may terminate with 30 days' written notice; termination is immediate for fraud, safety violations or forged documents." },
      { h: "10. Dispute resolution & governing law", b: "Parties negotiate in good faith for 15 days; unresolved disputes proceed to arbitration at NEPCA, Kathmandu. This Agreement is governed by the laws of Nepal." },
    ],
  },
  {
    id: "lgl-002",
    code: "JG-LGL-002",
    file: "JG-LGL-002-training-center-agreement.txt",
    title: "Training Center Agreement",
    nep: "प्रशिक्षण केन्द्र सम्झौता",
    kind: "Agreement",
    signable: true,
    audience: "CTEVT-affiliated & independent academies",
    version: "v1.1",
    updated: "12 Apr 2026",
    summary: "Curriculum standards, tuition handling, commission and QR-certificate obligations for listed training centers.",
    intro:
      "This Agreement is entered into between Junetara Glam Pvt. Ltd. (the “Company”) and the Training Center identified in the signature block (the “Center”), effective as of the date of digital execution.",
    sections: [
      { h: "1. Scope of engagement", b: "The Center lists CTEVT-aligned courses on the platform. The Company provides the enrollment engine, installment payment handling, student roster tools and QR-verified digital certificates." },
      { h: "2. Curriculum standards", b: "Courses follow the four-tier structure (Basic 3 months → Master Specialist 18–24 months) with published syllabi, minimum logged practical hours, and a student-to-trainer ratio of no more than 8:1 for practical sessions." },
      { h: "3. Fees & commission", b: "Tuition is collected by the platform; commission is 8–12% by tier. The Company bears installment-processing risk and remits to the Center per schedule. Certification fees (NPR 500–1,000) split 60/40 Company/Center." },
      { h: "4. Trainer credentials", b: "All trainers are listed in the verified trainer database with checkable credentials. Master-tier content is taught only by credentialed Master Specialists." },
      { h: "5. Certificates & verification", b: "The Center attests logged practical hours before certificate issuance. Each certificate carries a unique QR for employer verification. Forgery or falsified hours result in immediate termination and de-listing." },
      { h: "6. Student refunds", b: "Full refund before course start; pro-rated refund within the first 14 days; thereafter per the Center's published policy. Disputes route through the platform dispute queue." },
      { h: "7. Student data & placement", b: "Student data is shared for internship matching only with explicit consent, in compliance with the Privacy Act 2075 (2018)." },
      { h: "8. Marketing & listings", b: "The Center may purchase featured listings; top-rated Centers may be featured by the Company at no charge. The Center shall not advertise a lower fee off-platform for identical courses." },
      { h: "9. Audit rights", b: "The Company may audit attendance and assessment records quarterly with 7 days' notice." },
      { h: "10. Term & disputes", b: "Initial term 12 months, auto-renewing; 30 days' notice to terminate; NEPCA arbitration, Kathmandu; laws of Nepal govern." },
    ],
  },
  {
    id: "lgl-003",
    code: "JG-LGL-003",
    file: "JG-LGL-003-marketplace-vendor-agreement.txt",
    title: "Marketplace Vendor Agreement",
    nep: "बजार विक्रेता सम्झौता",
    kind: "Agreement",
    signable: true,
    audience: "Product brands · wholesalers · B2B suppliers",
    version: "v1.0",
    updated: "12 Apr 2026",
    summary: "Listing standards, B2C/B2B commission, delivery SLAs and settlement terms for product vendors.",
    intro:
      "This Agreement is entered into between Junetara Glam Pvt. Ltd. (the “Company”) and the product vendor identified in the signature block (the “Vendor”), effective as of the date of digital execution.",
    sections: [
      { h: "1. Scope", b: "The Vendor lists products for retail (B2C) and wholesale (B2B) sale on the marketplace, including salon supplies and equipment." },
      { h: "2. Listing standards", b: "Descriptions must be accurate and complete, including expiry dates and MRP. Counterfeit goods, unlicensed imports and expired stock are prohibited and lead to immediate de-listing." },
      { h: "3. Commission & subscription", b: "Retail: 5–10% by category. Wholesale B2B: 3–5%. Vendors may subscribe at NPR 1,000–5,000/month for reduced commission tiers and priority placement." },
      { h: "4. Fulfillment & delivery", b: "Kathmandu Valley orders ship within 48 hours; national orders via partner couriers with tracking shared to the platform." },
      { h: "5. Returns & warranty", b: "Customers receive 7-day returns; defective items are the Vendor's cost. Refunds issue through the original payment gateway within 48 hours to 7 days." },
      { h: "6. Settlement", b: "Weekly settlement cycle, T+7 days. Chargebacks and verified refunds are deducted from the next payout with itemised statements." },
      { h: "7. Brand & IP", b: "The Vendor warrants it holds rights to sell all listed brands and grants the Company a license to use product imagery on the platform." },
      { h: "8. Data sharing", b: "Demand analytics are shared with the Vendor; the Vendor shall not harvest customer contact data for off-platform marketing." },
      { h: "9. Term & disputes", b: "12-month auto-renewing term; 30 days' notice to terminate; NEPCA arbitration, Kathmandu; laws of Nepal govern." },
    ],
  },
  {
    id: "lgl-004",
    code: "JG-LGL-004",
    file: "JG-LGL-004-terms-of-service.txt",
    title: "Terms of Service",
    nep: "सेवाका सर्तहरू",
    kind: "Policy",
    signable: false,
    audience: "All platform users",
    version: "v1.3",
    updated: "12 Apr 2026",
    summary: "The rules of using Junetara Glam — accounts, payments, conduct, liability and jurisdiction.",
    intro:
      "These Terms of Service (“Terms”) govern access to and use of the Junetara Glam website and mobile applications operated by Junetara Glam Pvt. Ltd. By creating an account you agree to these Terms.",
    sections: [
      { h: "1. Eligibility & accounts", b: "You must be at least 16 years old (or act through a guardian) and provide accurate registration details. OTP-verified phone numbers are required for bookings and payments." },
      { h: "2. Nature of service", b: "Junetara Glam is a marketplace connecting students, customers and verified providers. The Company is an intermediary and is not itself the provider of training, salon services or goods." },
      { h: "3. Payments", b: "All payments process through eSewa, Khalti or Fonepay. Prices are in NPR and include applicable taxes unless stated. Promo codes apply as published and may be withdrawn." },
      { h: "4. Bookings & cancellations", b: "Service policies are set by each provider within the platform Refund & Cancellation Policy. No-shows may incur fees as published." },
      { h: "5. Enrollments & certificates", b: "Course enrollments are governed by the Training Center Agreement and Refund Policy. Certificates are QR-verified; misuse of a certificate voids it." },
      { h: "6. User conduct", b: "You agree not to commit fraud, harass others, post false reviews, or circumvent the platform to avoid commissions." },
      { h: "7. Content & IP", b: "You grant the Company a license to display content you post (reviews, photos). The Junetara Glam brand and software remain the Company's property." },
      { h: "8. Limitation of liability", b: "To the maximum extent permitted by law, liability is capped at the value of the transaction giving rise to the claim; indirect damages are excluded." },
      { h: "9. Suspension & termination", b: "Accounts violating these Terms may be suspended or terminated with notice where lawful." },
      { h: "10. Changes & jurisdiction", b: "We may amend these Terms with in-app notice. Disputes are subject to the jurisdiction of the courts of Kathmandu, Nepal." },
    ],
  },
  {
    id: "lgl-005",
    code: "JG-LGL-005",
    file: "JG-LGL-005-privacy-policy.txt",
    title: "Privacy Policy",
    nep: "गोपनीयता नीति",
    kind: "Policy",
    signable: false,
    audience: "All platform users",
    version: "v1.2",
    updated: "12 Apr 2026",
    summary: "What we collect, why, who we share it with, and your rights under Nepal's Privacy Act 2075.",
    intro:
      "Junetara Glam Pvt. Ltd. (“we”) processes personal data in accordance with the Individual Privacy Act 2075 (2018) and the Privacy Regulation 2075. This policy explains our practices for the website and apps.",
    sections: [
      { h: "1. Data controller", b: "Junetara Glam Pvt. Ltd., Sukedhara-4, Kathmandu · Dhangadhi-1, Kailali. Data protection contact: heerabohara80@gmail.com." },
      { h: "2. Data we collect", b: "Account data (name, phone, email), precise or approximate location for discovery and home services, transaction records, device data, and content you post (reviews, photos)." },
      { h: "3. Legal basis", b: "Consent, performance of contract, and legitimate interest — as recognised under the Individual Privacy Act 2075." },
      { h: "4. How we use it", b: "Service delivery, provider matching, payment processing, SMS/email notifications (Sparrow SMS, SendGrid), analytics, fraud prevention and regulatory compliance." },
      { h: "5. Sharing", b: "With the provider/center fulfilling your booking, payment gateways (eSewa, Khalti, Fonepay), delivery partners and competent authorities. We do not sell personal data." },
      { h: "6. Retention", b: "Account data is retained for the life of the account plus 3 years; transaction records 7 years for tax compliance." },
      { h: "7. Your rights", b: "Access, correction, deletion and portability of your data; withdrawal of consent at any time; complaint to the National Information Commission." },
      { h: "8. Security", b: "Encryption in transit, role-based internal access, and breach notification within 72 hours where required." },
      { h: "9. Cookies & analytics", b: "Essential cookies for sessions; analytics cookies only with consent; you may opt out via device settings." },
      { h: "10. Children", b: "The platform is not directed at users under 16 without a guardian's verified consent." },
    ],
  },
  {
    id: "lgl-006",
    code: "JG-LGL-006",
    file: "JG-LGL-006-refund-cancellation-policy.txt",
    title: "Refund & Cancellation Policy",
    nep: "रिफन्ड तथा रद्द गर्ने नीति",
    kind: "Policy",
    signable: false,
    audience: "Customers & providers",
    version: "v1.1",
    updated: "12 Apr 2026",
    summary: "Clear timelines for service cancellations, course refunds and product returns — refunds via original gateway.",
    intro:
      "This policy sets the refund and cancellation rules across services, course enrollments and marketplace products on Junetara Glam. Refunds are always issued to the original payment gateway (eSewa, Khalti or Fonepay).",
    sections: [
      { h: "1. Service bookings", b: "Free cancellation 24+ hours before the slot. Within 24 hours: 50% refund. Customer no-show: no refund. Provider no-show: 100% refund plus NPR 200 platform credit." },
      { h: "2. Course enrollments", b: "Full refund before the course start date. Pro-rated refund within the first 14 days of attendance. Opened training kits are non-refundable." },
      { h: "3. Marketplace products", b: "7-day returns on unopened items; 14-day replacement on defects. Refunds process within 48 hours to 7 days through the original gateway." },
      { h: "4. Promo codes & discounts", b: "Codes are not refundable. On partial refunds, discounts are retained proportionally." },
      { h: "5. Disputes", b: "Raise a dispute within 48 hours of the transaction from My Space. The platform mediates within 3 working days; unresolved matters proceed to NEPCA arbitration." },
      { h: "6. Gateway failures", b: "Failed but debited transactions auto-reverse within 72 hours. Contact support with the transaction ID for expedited handling." },
    ],
  },
];

/* ---------- serializers ---------- */
export function docToText(d: LegalDoc): string {
  const L: string[] = [
    "JUNETARA GLAM PVT. LTD. (in registration)",
    "Sukedhara-4, Kathmandu · Dhangadhi-1, Kailali · heerabohara80@gmail.com",
    "".padEnd(72, "="),
    `${d.code} · ${d.title.toUpperCase()} (${d.nep})`,
    `${d.kind} · ${d.version} · Updated ${d.updated}`,
    "Applies to: " + d.audience,
    "".padEnd(72, "="),
    "",
    d.intro,
    "",
  ];
  d.sections.forEach((s) => {
    L.push(s.h.toUpperCase());
    L.push(s.b);
    L.push("");
  });
  L.push("".padEnd(72, "-"));
  L.push("Reference copy. The executed version with signature block is generated in-app.");
  return L.join("\n");
}

export function executedCopy(
  d: LegalDoc,
  a: { ref: string; party: string; org: string; city: string; signedAt: string }
): string {
  return [
    docToText(d),
    "",
    "".padEnd(72, "="),
    "EXECUTION BLOCK — DIGITALLY SIGNED ON JUNETARA GLAM",
    "".padEnd(72, "="),
    `Reference        : ${a.ref}`,
    `Signed on        : ${a.signedAt}`,
    `Party            : ${a.party}`,
    `Organization     : ${a.org || "—"}`,
    `City             : ${a.city}`,
    `Platform         : Junetara Glam (junetaraglam.com)`,
    "",
    "By signing, the party confirms having read and accepted the full text",
    "above. This electronic record is issued under the platform's records",
    "and is admissible per the Electronic Transactions Act 2063 (2008).",
  ].join("\n");
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob(["\uFEFF" + text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const el = document.createElement("a");
  el.href = url;
  el.download = filename;
  document.body.appendChild(el);
  el.click();
  el.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
