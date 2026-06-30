import { useSyncExternalStore } from "react";

/* ----------------------------------------------------------------------------
 * Roteamento por hash (sem dependências, compatível com GitHub Pages).
 * Rotas:
 *   #/                       → home
 *   #/produtos               → todos os produtos
 *   #/ofertas                → ofertas
 *   #/categoria/<slug>       → categoria
 *   #/busca/<query>          → resultados de busca
 *   #/produto/<id>           → produto
 * ------------------------------------------------------------------------- */

export type Route =
  | { name: "home" }
  | { name: "produtos" }
  | { name: "ofertas" }
  | { name: "categoria"; slug: string }
  | { name: "busca"; query: string }
  | { name: "produto"; id: string }
  | { name: "404" };

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "");
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return { name: "home" };
  switch (seg[0]) {
    case "produtos":
      return { name: "produtos" };
    case "ofertas":
      return { name: "ofertas" };
    case "categoria":
      return seg[1] ? { name: "categoria", slug: decodeURIComponent(seg[1]) } : { name: "produtos" };
    case "busca":
      return { name: "busca", query: seg[1] ? decodeURIComponent(seg[1]) : "" };
    case "produto":
      return seg[1] ? { name: "produto", id: decodeURIComponent(seg[1]) } : { name: "404" };
    default:
      return { name: "404" };
  }
}

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getSnapshot = () => window.location.hash || "#/";

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getSnapshot, () => "#/");
  return parseRoute(hash);
}

/** Caminho ("/ofertas") → href de âncora ("#/ofertas") para usar em <a href>. */
export const href = (to: string) => (to.startsWith("#") ? to : "#" + to);

/** Navega programaticamente para um caminho ("/produto/px-b1"). */
export function navigate(to: string) {
  const target = href(to);
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = target;
  }
}
