import { useMemo, useState } from "react";
import { useApp } from "../context";
import { PRODUCTS, PROMOS, npr } from "../data";
import { Bag, Check, Flower, Minus, Plus, Trash, Truck, X } from "./Icons";
import { GatewayChips } from "./ui";
import { ProductArt } from "./Market";

const FREE_SHIP = 3000;

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart, cartCount, checkout, go, toast } = useApp();
  const [gateway, setGateway] = useState("eSewa");
  const [placed, setPlaced] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);

  const applyPromo = () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    const found = PROMOS.find((p) => p.code === c);
    if (!found) {
      toast(`Code “${c}” not recognized — live codes are on the Collaborate page`);
      return;
    }
    setApplied(found);
    toast(`${found.code} applied — ${found.pct}% off your glow`);
  };

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? { product, qty } : null;
        })
        .filter((x): x is { product: (typeof PRODUCTS)[number]; qty: number } => x !== null),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_SHIP ? 0 : 150;
  const discount = applied ? Math.round((subtotal * applied.pct) / 100) : 0;
  const total = Math.max(0, subtotal + delivery - discount);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIP) * 100));

  const close = () => {
    setCartOpen(false);
    setTimeout(() => {
      setPlaced(null);
      setApplied(null);
      setCode("");
    }, 400);
  };

  const placeOrder = () => {
    const orderId = `ORD-${Date.now().toString().slice(-5)}`;
    checkout(gateway, total);
    setPlaced(orderId);
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button className="absolute inset-0 bg-pine/75 backdrop-blur-sm" onClick={close} aria-label="Close bag" />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 bg-sand/70 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-crimson">Junetara marketplace</p>
            <h2 className="font-display text-2xl italic text-pine">Your bag · {cartCount}</h2>
          </div>
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:bg-crimson hover:text-ivory" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {placed ? (
          <div className="fade-in flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-forest text-sun"><Check className="h-9 w-9" /></span>
            <h3 className="mt-6 font-display text-3xl italic text-pine">Order confirmed!</h3>
            <p className="mt-2 font-mono text-sm font-bold tracking-wider text-crimson">{placed}</p>
            <p className="mt-3 max-w-xs text-[14px] text-ink/60">
              Payment via <strong className="text-pine">{gateway}</strong> received. Your order ships from Kathmandu in 24–48h —
              track it in My Space.
            </p>
            <div className="mt-7 flex gap-3">
              <button onClick={() => { close(); go("space"); }} className="rounded-full bg-pine px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-marigold transition hover:bg-forest">
                Track in My Space
              </button>
              <button onClick={close} className="rounded-full border border-ink/20 px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                Keep shopping
              </button>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-marigold"><Bag className="h-9 w-9" /></span>
            <h3 className="mt-5 font-display text-2xl italic text-pine">Your bag is empty</h3>
            <p className="mt-2 max-w-xs text-[13.5px] text-ink/55">Serums, bridal kits, salon supplies — the bazaar is one tap away.</p>
            <button onClick={() => { close(); go("market"); }} className="mt-6 rounded-full bg-crimson px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-pine">
              Browse the marketplace
            </button>
          </div>
        ) : (
          <>
            {/* free delivery meter */}
            <div className="shrink-0 border-b border-ink/10 bg-white/60 px-6 py-3.5">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-ink/65">
                <Truck className="h-4 w-4 text-crimson" />
                {delivery === 0 ? (
                  <span className="text-forest">Free delivery unlocked ✓</span>
                ) : (
                  <span>Add <strong className="text-crimson">{npr(FREE_SHIP - subtotal)}</strong> more for free delivery</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-gradient-to-r from-marigold to-crimson transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {lines.map(({ product, qty }) => (
                  <div key={product.id} className="flex gap-4 rounded-xl border border-ink/10 bg-white/70 p-3.5">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                      {product.img ? (
                        <img src={product.img} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        product.art && <ProductArt kind={product.art} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-display text-[15.5px] text-pine">{product.name}</h3>
                        <button onClick={() => removeFromCart(product.id)} className="shrink-0 text-ink/35 transition hover:text-crimson" aria-label={`Remove ${product.name}`}>
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11.5px] text-ink/50">{product.cat}{product.b2b && " · wholesale"}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center text-ink/60 transition hover:text-crimson" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-7 text-center text-[13px] font-bold text-pine">{qty}</span>
                          <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center text-ink/60 transition hover:text-forest" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="font-display text-[17px] text-crimson">{npr(product.price * qty)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-ink/10 bg-sand/70 px-6 py-5">
              {/* promo code */}
              <div className="mb-3.5">
                {applied ? (
                  <div className="flex items-center justify-between rounded-lg border border-dashed border-forest/60 bg-forest/10 px-4 py-2.5">
                    <span className="flex items-center gap-2 font-mono text-[12.5px] font-bold tracking-widest text-forest">
                      <Check className="h-4 w-4" /> {applied.code} · −{applied.pct}%
                    </span>
                    <button onClick={() => { setApplied(null); setCode(""); }} className="text-ink/45 transition hover:text-crimson" aria-label="Remove promo code">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="Promo code · try DASHAIN25"
                      className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 font-mono text-[12.5px] font-bold uppercase tracking-widest text-pine placeholder:font-body placeholder:font-semibold placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35 outline-none transition focus:border-crimson"
                      aria-label="Promo code"
                    />
                    <button onClick={applyPromo} className="shrink-0 rounded-lg bg-pine px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-marigold transition hover:bg-crimson hover:text-ivory">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-[13.5px]">
                <div className="flex justify-between text-ink/65"><span>Subtotal</span><span className="font-semibold text-pine">{npr(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between font-semibold text-forest"><span>Brand discount ({applied?.code})</span><span>−{npr(discount)}</span></div>
                )}
                <div className="flex justify-between text-ink/65"><span>Delivery</span><span className="font-semibold text-pine">{delivery === 0 ? "Free" : npr(delivery)}</span></div>
                <div className="flex justify-between border-t border-dashed border-ink/20 pt-2 font-display text-xl"><span className="italic">Total</span><span className="text-crimson">{npr(total)}</span></div>
              </div>
              <p className="mt-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink/50">Pay with</p>
              <div className="mt-1.5"><GatewayChips value={gateway} onChange={setGateway} /></div>
              <button onClick={placeOrder} className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-crimson py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-ivory transition-all hover:bg-pine">
                <Flower className="h-4 w-4 text-marigold transition-transform group-hover:rotate-90" />
                Pay {npr(total)} via {gateway}
              </button>
              <p className="mt-2.5 text-center text-[11px] text-ink/45">Regulated payment gateways · refunds within 48h · vendor commission 5–10%</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
