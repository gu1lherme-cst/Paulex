import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, productById, type Product } from "../data/catalog";

export type Fulfillment = "retirada" | "entrega";
type Line = { id: string; qty: number };
export type DetailedLine = Product & { qty: number; lineTotal: number };

const CART_KEY = "paulex:carrinho";
const MAX_QTY = 99;
const validIds = new Set(PRODUCTS.map((p) => p.id));

function loadCart(): Line[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is Line =>
          x && typeof x.id === "string" && validIds.has(x.id) && Number.isFinite(x.qty) && x.qty > 0
      )
      .map((x) => ({ id: x.id, qty: Math.min(MAX_QTY, Math.floor(x.qty)) }));
  } catch {
    return [];
  }
}

type CartValue = {
  lines: DetailedLine[];
  count: number;
  total: number;
  isOpen: boolean;
  fulfillment: Fulfillment;
  add: (id: string, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  buyNow: (id: string, qty?: number) => void;
  setFulfillment: (f: Fulfillment) => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("retirada");

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* localStorage indisponível (modo privado): ignora */
    }
  }, [items]);

  const add = useCallback((id: string, qty = 1) => {
    if (!validIds.has(id)) return;
    setItems((prev) => {
      const ex = prev.find((i) => i.id === id);
      if (ex) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i
        );
      }
      return [...prev, { id, qty: Math.min(MAX_QTY, qty) }];
    });
  }, []);

  const inc = useCallback((id: string) => add(id, 1), [add]);

  const dec = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const buyNow = useCallback(
    (id: string, qty = 1) => {
      add(id, qty);
      setIsOpen(true);
    },
    [add]
  );

  const lines = useMemo<DetailedLine[]>(
    () =>
      items
        .map((i) => {
          const p = productById(i.id);
          return p ? { ...p, qty: i.qty, lineTotal: p.priceNum * i.qty } : null;
        })
        .filter((x): x is DetailedLine => x !== null),
    [items]
  );
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((s, l) => s + l.lineTotal, 0), [lines]);

  const value = useMemo<CartValue>(
    () => ({
      lines, count, total, isOpen, fulfillment,
      add, inc, dec, remove, clear, open, close, buyNow, setFulfillment,
    }),
    [lines, count, total, isOpen, fulfillment, add, inc, dec, remove, clear, open, close, buyNow]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
