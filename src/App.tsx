import { useEffect } from "react";
import { CartProvider } from "./lib/cart";
import { WishlistProvider } from "./lib/wishlist";
import { useRoute, href, type Route } from "./lib/router";
import { useReveal } from "./lib/useReveal";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { Icon } from "./components/Icon";
import { Home } from "./pages/Home";
import { Listing } from "./pages/Listing";
import { Product } from "./pages/Product";
import { Favorites } from "./pages/Favorites";
import { categoryFromSlug, productById } from "./data/catalog";
import "./styles.css";

const BRAND = "Paulex Armarinho";
const DEFAULT_DESC =
  "Papelaria, utilidades, descartáveis, brinquedos, cosméticos e informática em um só lugar. Há mais de 40 anos com você. Enviamos para todo o Rio de Janeiro.";

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/* SEO técnico por rota: title + meta description (Cap 51). */
function applySEO(route: Route) {
  let title = `${BRAND} | Papelaria, utilidades e muito mais`;
  let desc = DEFAULT_DESC;
  switch (route.name) {
    case "produtos":
      title = `Todos os produtos | ${BRAND}`;
      desc = "Veja todos os produtos da Paulex Armarinho: papelaria, utilidades, brinquedos, cosméticos, informática, acessórios, casa e descartáveis.";
      break;
    case "ofertas":
      title = `Ofertas | ${BRAND}`;
      desc = "Ofertas da semana na Paulex Armarinho: até 40% de desconto em papelaria, informática, utilidades e muito mais.";
      break;
    case "favoritos":
      title = `Meus favoritos | ${BRAND}`;
      desc = "Seus produtos favoritos na Paulex Armarinho.";
      break;
    case "categoria": {
      const c = categoryFromSlug(route.slug);
      title = `${c ?? "Categoria"} | ${BRAND}`;
      desc = c ? `Produtos de ${c} na Paulex Armarinho, com preço justo e entrega para todo o Rio de Janeiro.` : DEFAULT_DESC;
      break;
    }
    case "busca":
      title = `Busca: ${route.query} | ${BRAND}`;
      desc = `Resultados da busca por "${route.query}" na Paulex Armarinho.`;
      break;
    case "produto": {
      const p = productById(route.id);
      if (p) {
        title = `${p.name} | ${BRAND}`;
        desc = `${p.name} por ${p.price} na Paulex Armarinho. ${p.category} com retirada na loja ou entrega para todo o Rio de Janeiro.`;
      }
      break;
    }
  }
  document.title = title;
  setMeta("description", desc);
}

function NotFound() {
  return (
    <main className="px-section px-listing" id="topo">
      <div className="px-empty">
        <span className="px-empty__icon"><Icon name="search" size={30} /></span>
        <p>Página não encontrada.</p>
        <a href={href("/")} className="px-btn px-btn--primary px-btn--sm">Voltar para a Home</a>
      </div>
    </main>
  );
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home": return <Home />;
    case "produto": return <Product id={route.id} />;
    case "favoritos": return <Favorites />;
    case "produtos":
    case "ofertas":
    case "categoria":
    case "busca":
      return <Listing route={route} />;
    default: return <NotFound />;
  }
}

export default function App() {
  const route = useRoute();
  const key = JSON.stringify(route);

  useEffect(() => {
    window.scrollTo(0, 0);
    applySEO(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useReveal(key);

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="px-root">
          <Header />
          <Page route={route} />
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}
