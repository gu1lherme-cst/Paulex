import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PRODUCTS, COUPONS, productById, unitPriceFor, type Product,
} from "../data/catalog";

export type Fulfillment = "retirada" | "entrega";
export type Customer = { name: string; phone: string };
type Line = { id: string; qty: number };
export type DetailedLine = Product & {
  qty: number;
  unit: number;
  lineTotal: number;
  wholesaleApplied: boolean;
};

const CART_KEY = "paulex:carrinho";
const COUPON_KEY = "paulex:cupom";
const CUSTOMER_KEY = "paulex:cliente";
const MAX_QTY = 99;
const validIds = new Set(PRODUCTS.map((p) => p.id));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadCart(): Line[] {
  const parsed = load<unknown>(CART_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (x): x is Line =>
        !!x && typeof (x as Line).id === "string" && validIds.has((x as Line).id) &&
        Number.isFinite((x as Line).qty) && (x as Line).qty > 0
    )
    .map((x) => ({ id: x.id, qty: Math.min(MAX_QTY, Math.floor(x.qty)) }));
}

/** Quantidade permitida considerando o estoque do produto. */
function capToStock(id: string, qty: number): number {
  const p = productById(id);
  const stock = p ? p.stock : 0;
  return Math.max(0, Math.min(MAX_QTY, stock, qty));
}

type CartValue = {
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  isOpen: boolean;
  fulfillment: Fulfillment;
  couponCode: string;
  couponLabel: string | null;
  customer: Customer;
  add: (id: string, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  buyNow: (id: string, qty?: number) => void;
  setFulfillment: (f: Fulfillment) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setCustomer: (c: Partial<Customer>) => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("retirada");
  const [couponCode, setCouponCode] = useState<string>(() => {
    const c = load<string>(COUPON_KEY, "");
    return typeof c === "string" && COUPONS[c] ? c : "";
  });
  const [customer, setCustomerState] = useState<Customer>(() => {
    const c = load<Customer>(CUSTOMER_KEY, { name: "", phone: "" });
    return { name: c?.name ?? "", phone: c?.phone ?? "" };
  });

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* modo privado */ }
  }, [items]);
  useEffect(() => {
    try { localStorage.setItem(COUPON_KEY, JSON.stringify(couponCode)); } catch { /* modo privado */ }
  }, [couponCode]);
  useEffect(() => {
    try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer)); } catch { /* modo privado */ }
  }, [customer]);

  const add = useCallback((id: string, qty = 1) => {
    if (!validIds.has(id)) return;
    setItems((prev) => {
      const ex = prev.find((i) => i.id === id);
      const target = capToStock(id, (ex?.qty ?? 0) + qty);
      if (target <= 0) return prev;
      if (ex) return prev.map((i) => (i.id === id ? { ...i, qty: target } : i));
      return [...prev, { id, qty: target }];
    });
  }, []);

  const inc = useCallback((id: string) => add(id, 1), [add]);

  const dec = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const buyNow = useCallback((id: string, qty = 1) => { add(id, qty); setIsOpen(true); }, [add]);

  const applyCoupon = useCallback((code: string) => {
    const c = code.trim().toUpperCase();
    if (COUPONS[c]) { setCouponCode(c); return true; }
    return false;
  }, []);
  const removeCoupon = useCallback(() => setCouponCode(""), []);
  const setCustomer = useCallback((c: Partial<Customer>) => {
    setCustomerState((prev) => ({ ...prev, ...c }));
  }, []);

  const lines = useMemo<DetailedLine[]>(
    () =>
      items
        .map((i) => {
          const p = productById(i.id);
          if (!p) return null;
          const unit = unitPriceFor(p, i.qty);
          return { ...p, qty: i.qty, unit, lineTotal: unit * i.qty, wholesaleApplied: unit < p.priceNum };
        })
        .filter((x): x is DetailedLine => x !== null),
    [items]
  );

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.lineTotal, 0), [lines]);
  const coupon = couponCode ? COUPONS[couponCode] : null;
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const value = useMemo<CartValue>(
    () => ({
      lines, count, subtotal, discount, total, isOpen, fulfillment,
      couponCode, couponLabel: coupon?.label ?? null, customer,
      add, inc, dec, remove, clear, open, close, buyNow,
      setFulfillment, applyCoupon, removeCoupon, setCustomer,
    }),
    [lines, count, subtotal, discount, total, isOpen, fulfillment, couponCode, coupon, customer,
      add, inc, dec, remove, clear, open, close, buyNow, applyCoupon, removeCoupon, setCustomer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
