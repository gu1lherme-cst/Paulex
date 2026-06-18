import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Address, CartMap, Order, OrderStatus, Product } from "../types";
import { PRODUCTS, CUPONS } from "../data/catalog";
import { KEYS, load, remove, save } from "../lib/db";
import { unitPrice } from "../lib/pricing";

interface StoreCtx {
  products: Product[];
  cart: CartMap;
  favs: Set<string>;
  orders: Order[];
  addrs: Address[];
  cupom: string;
  recent: string[];
  cartCount: number;
  // catálogo (admin)
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  // carrinho
  addToCart: (id: string, qty?: number) => void;
  setCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  // favoritos
  toggleFav: (id: string) => boolean;
  // cupom
  applyCupom: (code: string) => boolean;
  removeCupom: () => void;
  // recentes
  pushRecent: (id: string) => void;
  // pedidos
  placeOrder: (order: Order) => void;
  setOrderStatus: (numero: string, status: OrderStatus) => void;
  // endereços
  saveAddr: (addr: Address, index: number) => void;
  deleteAddr: (index: number) => void;
  makeMainAddr: (index: number) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    load<Product[]>(KEYS.products, PRODUCTS),
  );
  const [cart, setCart] = useState<CartMap>(() => load<CartMap>(KEYS.cart, {}));
  const [favs, setFavs] = useState<Set<string>>(
    () => new Set(load<string[]>(KEYS.favs, [])),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    load<Order[]>(KEYS.orders, []),
  );
  const [addrs, setAddrs] = useState<Address[]>(() =>
    load<Address[]>(KEYS.addrs, []),
  );
  const [cupom, setCupom] = useState<string>(() => {
    const c = load<string>(KEYS.cupom, "");
    return CUPONS[c] ? c : "";
  });
  const [recent, setRecent] = useState<string[]>(() =>
    load<string[]>(KEYS.recent, []),
  );

  useEffect(() => save(KEYS.cart, cart), [cart]);
  useEffect(() => save(KEYS.favs, [...favs]), [favs]);
  useEffect(() => save(KEYS.orders, orders), [orders]);
  useEffect(() => save(KEYS.addrs, addrs), [addrs]);
  useEffect(() => save(KEYS.recent, recent), [recent]);

  /* ---------- catálogo ---------- */
  const upsertProduct = useCallback((p: Product) => {
    setProducts((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      const list = i >= 0 ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
      save(KEYS.products, list);
      return list;
    });
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const list = prev.filter((x) => x.id !== id);
      save(KEYS.products, list);
      return list;
    });
  }, []);
  const resetProducts = useCallback(() => {
    remove(KEYS.products);
    setProducts(PRODUCTS);
  }, []);

  /* ---------- carrinho ---------- */
  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  }, []);
  const setCartQty = useCallback((id: string, delta: number) => {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }, []);
  const clearCart = useCallback(() => setCart({}), []);

  /* ---------- favoritos ---------- */
  const toggleFav = useCallback((id: string) => {
    let added = false;
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        added = true;
      }
      return next;
    });
    return added;
  }, []);

  /* ---------- cupom ---------- */
  const applyCupom = useCallback((code: string) => {
    const cod = code.trim().toUpperCase();
    if (!CUPONS[cod]) return false;
    setCupom(cod);
    save(KEYS.cupom, cod);
    return true;
  }, []);
  const removeCupom = useCallback(() => {
    setCupom("");
    remove(KEYS.cupom);
  }, []);

  /* ---------- recentes ---------- */
  const pushRecent = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  /* ---------- pedidos ---------- */
  const placeOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    // baixa de estoque
    setProducts((prev) => {
      const list = prev.map((p) => {
        const it = order.itens.find((i) => i.id === p.id);
        return it ? { ...p, estoque: Math.max(0, p.estoque - it.qty) } : p;
      });
      save(KEYS.products, list);
      return list;
    });
    setCart({});
    removeCupom();
  }, [removeCupom]);

  const setOrderStatus = useCallback((numero: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.numero === numero ? { ...o, status } : o)),
    );
  }, []);

  /* ---------- endereços ---------- */
  const saveAddr = useCallback((addr: Address, index: number) => {
    setAddrs((prev) => {
      if (index >= 0) return prev.map((a, i) => (i === index ? addr : a));
      return [...prev, addr];
    });
  }, []);
  const deleteAddr = useCallback((index: number) => {
    setAddrs((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const makeMainAddr = useCallback((index: number) => {
    setAddrs((prev) => {
      const next = [...prev];
      const [a] = next.splice(index, 1);
      next.unshift(a);
      return next;
    });
  }, []);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      products,
      cart,
      favs,
      orders,
      addrs,
      cupom,
      recent,
      cartCount,
      upsertProduct,
      deleteProduct,
      resetProducts,
      addToCart,
      setCartQty,
      clearCart,
      toggleFav,
      applyCupom,
      removeCupom,
      pushRecent,
      placeOrder,
      setOrderStatus,
      saveAddr,
      deleteAddr,
      makeMainAddr,
    }),
    [
      products,
      cart,
      favs,
      orders,
      addrs,
      cupom,
      recent,
      cartCount,
      upsertProduct,
      deleteProduct,
      resetProducts,
      addToCart,
      setCartQty,
      clearCart,
      toggleFav,
      applyCupom,
      removeCupom,
      pushRecent,
      placeOrder,
      setOrderStatus,
      saveAddr,
      deleteAddr,
      makeMainAddr,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return ctx;
}

/* utilidades de pedido reaproveitadas em telas */
export function nextOrderNumber(orders: Order[]): string {
  return String(1001 + orders.length);
}

export function orderItemsFromCart(
  cart: CartMap,
  products: Product[],
): Order["itens"] {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      if (!p) return null;
      return { id, nome: p.nome, qty, valor: unitPrice(p, qty) * qty };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
