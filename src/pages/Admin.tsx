import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { href } from "../lib/router";
import { useAuth } from "../lib/auth";
import { useProducts } from "../lib/products";
import { useCategories } from "../lib/categories";
import { fmtBRL, slugify, PRODUCT_ICONS, TONES, type IconName } from "../data/catalog";
import {
  listAllCategories, createCategory, updateCategory, setCategoryActive, type CategoryInput,
} from "../services/categoriesService";
import {
  listAllProducts, createProduct, updateProduct, setProductActive,
  listProductImages, addProductImage, deleteProductImage, setMainProductImage,
  type AdminProductRow, type ProductInput,
} from "../services/productsService";
import {
  listAllBrands, createBrand, updateBrand, setBrandActive, type BrandInput,
} from "../services/brandsService";
import {
  listAllCoupons, createCoupon, updateCoupon, setCouponActive, type CouponInput,
} from "../services/couponsService";
import { getStoreSettings, updateStoreSettings } from "../services/settingsService";
import { listMovements, registerMovement } from "../services/inventoryService";
import { listOrders, updateOrderStatus } from "../services/ordersService";
import type {
  BrandRow, CategoryRow, CouponRow, InventoryMovementRow, InventoryMovementType,
  OrderStatus, OrderWithItems, PaymentMethod, ProductImageRow, StoreSettingsRow,
} from "../services/types";

/* ----------------------------------------------------------------------------
 * Painel administrativo: login por magic link + gestão completa da loja
 * (produtos, imagens, categorias, marcas, estoque, pedidos, cupons e
 * configurações), tudo falando direto com o Supabase (src/services/*).
 * ------------------------------------------------------------------------- */

type Tab = "produtos" | "categorias" | "marcas" | "estoque" | "pedidos" | "cupons" | "loja";

const TABS: { id: Tab; label: string }[] = [
  { id: "produtos", label: "Produtos" },
  { id: "categorias", label: "Categorias" },
  { id: "marcas", label: "Marcas" },
  { id: "estoque", label: "Estoque" },
  { id: "pedidos", label: "Pedidos" },
  { id: "cupons", label: "Cupons" },
  { id: "loja", label: "Loja" },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_preparo: "Em preparo",
  pronto_retirada: "Pronto p/ retirada",
  a_caminho: "A caminho",
  entregue: "Entregue",
  cancelado: "Cancelado",
};
const STATUS_OPTIONS = Object.keys(STATUS_LABEL) as OrderStatus[];

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  cartao: "Cartão",
  a_combinar: "A combinar",
};

const MOVEMENT_LABEL: Record<InventoryMovementType, string> = {
  in: "Entrada",
  out: "Saída",
  adjustment: "Ajuste",
};

const num = (s: string) => Number(s.replace(",", ".").trim());

/* Aceita só URLs http(s) (espelha o CHECK do banco em 06_secure_orders.sql). */
const isHttpUrl = (s: string) => /^https?:\/\//i.test(s.trim());

export function Admin() {
  const { session, isAdmin, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <main className="px-section px-admin" id="topo">
        <p className="px-listing__count">Carregando…</p>
      </main>
    );
  }

  if (!session) return <AdminLogin login={login} />;
  if (!isAdmin) return <AdminForbidden logout={logout} email={session.user.email ?? ""} />;

  return <AdminPanel email={session.user.email ?? ""} logout={logout} />;
}

/* -------------------------------- Login ----------------------------------- */

function AdminLogin({ login }: { login: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setMsg(null);
    try {
      await login(email.trim());
      setMsg("Link de acesso enviado! Verifique seu e-mail e clique no link para entrar.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Não foi possível enviar o link. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="px-section px-admin" id="topo">
      <nav className="px-crumb" aria-label="Você está em">
        <a href={href("/")}>Início</a>
        <Icon name="chevronR" size={13} />
        <span aria-current="page">Painel administrativo</span>
      </nav>
      <div className="px-admin__form px-admin__login">
        <h1 className="px-admin__formtitle">Acesso do administrador</h1>
        <p className="px-admin__note"><Icon name="shield" size={15} />Digite seu e-mail cadastrado como administrador para receber um link de acesso — sem senha.</p>
        <form onSubmit={onSubmit}>
          <label className="px-field">
            <span>E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="voce@paulex.com.br" autoComplete="email" />
          </label>
          <button type="submit" className="px-btn px-btn--primary" disabled={sending}>
            {sending ? "Enviando…" : "Enviar link de acesso"}
          </button>
        </form>
        {msg && <p className="px-admin__msg" role="status">{msg}</p>}
      </div>
    </main>
  );
}

function AdminForbidden({ logout, email }: { logout: () => Promise<void>; email: string }) {
  return (
    <main className="px-section px-admin" id="topo">
      <div className="px-empty">
        <span className="px-empty__icon"><Icon name="shield" size={30} /></span>
        <p>A conta <strong>{email}</strong> não tem acesso ao painel administrativo.</p>
        <button type="button" className="px-btn px-btn--primary px-btn--sm" onClick={() => logout()}>Sair</button>
      </div>
    </main>
  );
}

/* --------------------------------- Painel ---------------------------------- */

function AdminPanel({ email, logout }: { email: string; logout: () => Promise<void> }) {
  const [tab, setTab] = useState<Tab>("produtos");
  const { reload: reloadStoreProducts } = useProducts();
  const { reload: reloadStoreCategories } = useCategories();

  const onDataChanged = useCallback(() => {
    reloadStoreProducts();
    reloadStoreCategories();
  }, [reloadStoreProducts, reloadStoreCategories]);

  return (
    <main className="px-section px-admin" id="topo">
      <nav className="px-crumb" aria-label="Você está em">
        <a href={href("/")}>Início</a>
        <Icon name="chevronR" size={13} />
        <span aria-current="page">Painel administrativo</span>
      </nav>

      <div className="px-admin__head">
        <div>
          <h1 className="px-listing__title">Painel administrativo</h1>
          <p className="px-listing__count">Logado como {email}</p>
        </div>
        <div className="px-admin__actions">
          <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => logout()}>Sair</button>
        </div>
      </div>

      <div className="px-chips px-admin__tabs" role="list">
        {TABS.map((t) => (
          <button
            key={t.id} type="button" role="listitem"
            className={`px-chip${tab === t.id ? " px-chip--on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "produtos" && <ProdutosTab onChanged={onDataChanged} />}
      {tab === "categorias" && <CategoriasTab onChanged={onDataChanged} />}
      {tab === "marcas" && <MarcasTab />}
      {tab === "estoque" && <EstoqueTab onChanged={onDataChanged} />}
      {tab === "pedidos" && <PedidosTab />}
      {tab === "cupons" && <CuponsTab />}
      {tab === "loja" && <LojaTab />}
    </main>
  );
}

/* -------------------------------- Produtos --------------------------------- */

type ProductDraft = {
  id: string; name: string; slug: string; description: string; sku: string;
  categoryId: string; brandId: string;
  price: string; promotionalPrice: string; stockQuantity: string;
  wholesalePrice: string; wholesaleMinQty: string; installmentLabel: string;
  icon: string; tone: string; imageUrl: string; isFeatured: boolean; isActive: boolean;
};

const EMPTY_PRODUCT: ProductDraft = {
  id: "", name: "", slug: "", description: "", sku: "", categoryId: "", brandId: "",
  price: "", promotionalPrice: "", stockQuantity: "0",
  wholesalePrice: "", wholesaleMinQty: "", installmentLabel: "à vista",
  icon: "stack", tone: "blue", imageUrl: "", isFeatured: false, isActive: true,
};

const toProductDraft = (p: AdminProductRow): ProductDraft => ({
  id: p.id, name: p.name, slug: p.slug, description: p.description ?? "", sku: p.sku ?? "",
  categoryId: p.category_id ?? "", brandId: p.brand_id ?? "",
  price: String(p.price), promotionalPrice: p.promotional_price != null ? String(p.promotional_price) : "",
  stockQuantity: String(p.stock_quantity),
  wholesalePrice: p.wholesale_price != null ? String(p.wholesale_price) : "",
  wholesaleMinQty: p.wholesale_min_qty != null ? String(p.wholesale_min_qty) : "",
  installmentLabel: p.installment_label, icon: p.icon, tone: p.tone,
  imageUrl: p.image_url ?? "", isFeatured: p.is_featured, isActive: p.is_active,
});

function ProdutosTab({ onChanged }: { onChanged: () => void }) {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_PRODUCT);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editing = !!draft.id;

  const load = useCallback(() => {
    listAllProducts().then(setProducts).catch(() => setMsg("Erro ao carregar produtos."));
    listAllCategories().then(setCategories).catch(() => {});
    listAllBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof ProductDraft) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDraft((d) => {
      const next = { ...d, [k]: value } as ProductDraft;
      if (k === "name" && !editing) next.slug = slugify(String(value));
      return next;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.categoryId || !(num(draft.price) > 0)) {
      setMsg("Preencha nome, categoria e um preço válido (maior que zero).");
      return;
    }
    if (draft.imageUrl.trim() && !isHttpUrl(draft.imageUrl)) {
      setMsg("A URL da foto deve começar com http:// ou https://.");
      return;
    }
    const input: ProductInput = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      description: draft.description.trim() || null,
      price: num(draft.price),
      promotional_price: draft.promotionalPrice ? num(draft.promotionalPrice) : null,
      category_id: draft.categoryId,
      brand_id: draft.brandId || null,
      image_url: draft.imageUrl.trim() || null,
      stock_quantity: Math.max(0, Math.floor(num(draft.stockQuantity) || 0)),
      sku: draft.sku.trim() || null,
      is_featured: draft.isFeatured,
      is_active: draft.isActive,
      icon: draft.icon,
      tone: draft.tone,
      installment_label: draft.installmentLabel.trim() || "à vista",
      wholesale_price: draft.wholesalePrice ? num(draft.wholesalePrice) : null,
      wholesale_min_qty: draft.wholesaleMinQty ? Math.floor(num(draft.wholesaleMinQty)) : null,
    };
    setSaving(true);
    try {
      if (editing) await updateProduct(draft.id, input);
      else await createProduct(input);
      setMsg(editing ? `Produto "${input.name}" atualizado.` : `Produto "${input.name}" cadastrado.`);
      setDraft(EMPTY_PRODUCT);
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (p: AdminProductRow) => {
    setDraft(toProductDraft(p));
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onToggleActive = async (p: AdminProductRow) => {
    try {
      await setProductActive(p.id, !p.is_active);
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao atualizar produto.");
    }
  };

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />{products.length} produtos cadastrados. Produtos inativos não aparecem na loja.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">{editing ? "Editar produto" : "Novo produto"}</h2>
        <div className="px-admin__grid">
          <label className="px-field px-field--wide">
            <span>Nome *</span>
            <input value={draft.name} onChange={set("name")} required placeholder="Ex.: Caderno universitário" />
          </label>
          <label className="px-field">
            <span>SKU</span>
            <input value={draft.sku} onChange={set("sku")} placeholder="PAP-010" />
          </label>
          <label className="px-field">
            <span>Categoria *</span>
            <select value={draft.categoryId} onChange={set("categoryId")} required>
              <option value="">Selecione…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Marca</span>
            <select value={draft.brandId} onChange={set("brandId")}>
              <option value="">Sem marca</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Preço (R$) *</span>
            <input value={draft.price} onChange={set("price")} inputMode="decimal" required placeholder="29,90" />
          </label>
          <label className="px-field">
            <span>Preço promocional (R$)</span>
            <input value={draft.promotionalPrice} onChange={set("promotionalPrice")} inputMode="decimal" placeholder="24,90" />
          </label>
          <label className="px-field">
            <span>Estoque *</span>
            <input value={draft.stockQuantity} onChange={set("stockQuantity")} inputMode="numeric" placeholder="20" />
          </label>
          <label className="px-field">
            <span>Preço atacado (R$)</span>
            <input value={draft.wholesalePrice} onChange={set("wholesalePrice")} inputMode="decimal" placeholder="25,90" />
          </label>
          <label className="px-field">
            <span>Qtd. mín. atacado</span>
            <input value={draft.wholesaleMinQty} onChange={set("wholesaleMinQty")} inputMode="numeric" placeholder="6" />
          </label>
          <label className="px-field">
            <span>Parcelamento</span>
            <input value={draft.installmentLabel} onChange={set("installmentLabel")} placeholder="em 3x sem juros" />
          </label>
          <label className="px-field">
            <span>Ícone (sem foto)</span>
            <select value={draft.icon} onChange={set("icon")}>
              {PRODUCT_ICONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Cor (sem foto)</span>
            <select value={draft.tone} onChange={set("tone")}>
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="px-field px-field--wide">
            <span>URL da foto de capa (opcional)</span>
            <input value={draft.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
          </label>
          <label className="px-field px-field--wide">
            <span>Descrição</span>
            <input value={draft.description} onChange={set("description")} placeholder="Descrição curta do produto" />
          </label>
          <label className="px-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.isFeatured} onChange={set("isFeatured")} style={{ height: "auto" }} />
            <span>Produto em destaque</span>
          </label>
          <label className="px-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.isActive} onChange={set("isActive")} style={{ height: "auto" }} />
            <span>Ativo na loja</span>
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm" disabled={saving}>
            {saving ? "Salvando…" : editing ? "Salvar alterações" : "Cadastrar produto"}
          </button>
          {(draft.id || draft.name) && (
            <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => { setDraft(EMPTY_PRODUCT); setMsg(null); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {editing && <ImagensDoProduto productId={draft.id} onChanged={onChanged} />}

      <div className="px-admin__list">
        {products.map((p) => (
          <div className="px-admin__row" key={p.id}>
            <span className={`px-admin__icon px-cat__icon--${p.tone}`}><Icon name={(p.icon as IconName) || "stack"} size={18} /></span>
            <div className="px-admin__rowinfo">
              <strong>{p.name}{!p.is_active && " (inativo)"}</strong>
              <small>{p.categories?.name ?? "sem categoria"} · {p.sku ?? "—"} · {fmtBRL(p.promotional_price ?? p.price)} · estoque {p.stock_quantity}</small>
            </div>
            <div className="px-admin__rowactions">
              <button type="button" onClick={() => onEdit(p)} aria-label={`Editar ${p.name}`}>Editar</button>
              <button type="button" onClick={() => onToggleActive(p)} aria-label={`${p.is_active ? "Desativar" : "Ativar"} ${p.name}`}>
                {p.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* Galeria de imagens do produto em edição */
function ImagensDoProduto({ productId, onChanged }: { productId: string; onChanged: () => void }) {
  const [images, setImages] = useState<ProductImageRow[]>([]);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    listProductImages(productId).then(setImages).catch(() => setMsg("Erro ao carregar imagens."));
  }, [productId]);

  useEffect(() => { load(); }, [load]);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (!isHttpUrl(url)) { setMsg("A URL da imagem deve começar com http:// ou https://."); return; }
    try {
      await addProductImage({
        product_id: productId,
        image_url: url.trim(),
        alt_text: alt.trim() || null,
        sort_order: images.length,
        is_main: images.length === 0,
      });
      setUrl("");
      setAlt("");
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao adicionar imagem.");
    }
  };

  const onSetMain = async (img: ProductImageRow) => {
    try { await setMainProductImage(productId, img.id); load(); onChanged(); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Erro ao definir imagem principal."); }
  };

  const onDelete = async (img: ProductImageRow) => {
    try { await deleteProductImage(img.id); load(); onChanged(); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Erro ao remover imagem."); }
  };

  return (
    <div className="px-admin__form">
      <h2 className="px-admin__formtitle">Fotos deste produto</h2>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}
      <form onSubmit={onAdd} className="px-admin__grid">
        <label className="px-field px-field--wide">
          <span>URL da imagem</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        </label>
        <label className="px-field">
          <span>Texto alternativo</span>
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Descrição da foto" />
        </label>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm">Adicionar foto</button>
        </div>
      </form>
      <div className="px-admin__list" style={{ marginTop: 14 }}>
        {images.length === 0 && <p className="px-listing__count">Nenhuma foto na galeria (a loja usa o ícone colorido ou a foto de capa).</p>}
        {images.map((img) => (
          <div className="px-admin__row" key={img.id}>
            <img src={img.image_url} alt={img.alt_text ?? ""} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
            <div className="px-admin__rowinfo">
              <strong>{img.is_main ? "★ Principal" : "Foto"}</strong>
              <small>{img.image_url}</small>
            </div>
            <div className="px-admin__rowactions">
              {!img.is_main && <button type="button" onClick={() => onSetMain(img)}>Tornar principal</button>}
              <button type="button" className="px-admin__del" onClick={() => onDelete(img)}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Categorias -------------------------------- */

type CategoryDraft = { id: string; name: string; slug: string; description: string; icon: string; tone: string; isActive: boolean };
const EMPTY_CATEGORY: CategoryDraft = { id: "", name: "", slug: "", description: "", icon: "stack", tone: "blue", isActive: true };

const toCategoryDraft = (c: CategoryRow): CategoryDraft => ({
  id: c.id, name: c.name, slug: c.slug, description: c.description ?? "", icon: c.icon, tone: c.tone, isActive: c.is_active,
});

function CategoriasTab({ onChanged }: { onChanged: () => void }) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [draft, setDraft] = useState<CategoryDraft>(EMPTY_CATEGORY);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editing = !!draft.id;

  const load = useCallback(() => {
    listAllCategories().then(setCategories).catch(() => setMsg("Erro ao carregar categorias."));
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof CategoryDraft) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDraft((d) => {
      const next = { ...d, [k]: value } as CategoryDraft;
      if (k === "name" && !editing) next.slug = slugify(String(value));
      return next;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) { setMsg("Preencha o nome da categoria."); return; }
    const input: CategoryInput = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      description: draft.description.trim() || null,
      icon: draft.icon,
      tone: draft.tone,
      is_active: draft.isActive,
    };
    setSaving(true);
    try {
      if (editing) await updateCategory(draft.id, input);
      else await createCategory(input);
      setMsg(editing ? `Categoria "${input.name}" atualizada.` : `Categoria "${input.name}" cadastrada.`);
      setDraft(EMPTY_CATEGORY);
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar categoria.");
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (c: CategoryRow) => {
    try {
      await setCategoryActive(c.id, !c.is_active);
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao atualizar categoria.");
    }
  };

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />{categories.length} categorias cadastradas. Categorias inativas somem da loja (e dos produtos ligados a elas).</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">{editing ? "Editar categoria" : "Nova categoria"}</h2>
        <div className="px-admin__grid">
          <label className="px-field px-field--wide">
            <span>Nome *</span>
            <input value={draft.name} onChange={set("name")} required placeholder="Ex.: Papelaria" />
          </label>
          <label className="px-field">
            <span>Ícone</span>
            <select value={draft.icon} onChange={set("icon")}>
              {PRODUCT_ICONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Cor</span>
            <select value={draft.tone} onChange={set("tone")}>
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="px-field px-field--wide">
            <span>Descrição</span>
            <input value={draft.description} onChange={set("description")} placeholder="Cadernos, canetas e material escolar" />
          </label>
          <label className="px-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.isActive} onChange={set("isActive")} style={{ height: "auto" }} />
            <span>Ativa na loja</span>
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm" disabled={saving}>
            {saving ? "Salvando…" : editing ? "Salvar alterações" : "Cadastrar categoria"}
          </button>
          {(draft.id || draft.name) && (
            <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => { setDraft(EMPTY_CATEGORY); setMsg(null); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="px-admin__list">
        {categories.map((c) => (
          <div className="px-admin__row" key={c.id}>
            <span className={`px-admin__icon px-cat__icon--${c.tone}`}><Icon name={(c.icon as IconName) || "stack"} size={18} /></span>
            <div className="px-admin__rowinfo">
              <strong>{c.name}{!c.is_active && " (inativa)"}</strong>
              <small>{c.description || "sem descrição"}</small>
            </div>
            <div className="px-admin__rowactions">
              <button type="button" onClick={() => { setDraft(toCategoryDraft(c)); setMsg(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar</button>
              <button type="button" onClick={() => onToggleActive(c)}>{c.is_active ? "Desativar" : "Ativar"}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------- Marcas ----------------------------------- */

type BrandDraft = { id: string; name: string; slug: string; logoUrl: string; isActive: boolean };
const EMPTY_BRAND: BrandDraft = { id: "", name: "", slug: "", logoUrl: "", isActive: true };

function MarcasTab() {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [draft, setDraft] = useState<BrandDraft>(EMPTY_BRAND);
  const [msg, setMsg] = useState<string | null>(null);
  const editing = !!draft.id;

  const load = useCallback(() => {
    listAllBrands().then(setBrands).catch(() => setMsg("Erro ao carregar marcas."));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) { setMsg("Preencha o nome da marca."); return; }
    if (draft.logoUrl.trim() && !isHttpUrl(draft.logoUrl)) {
      setMsg("A URL do logo deve começar com http:// ou https://.");
      return;
    }
    const input: BrandInput = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      logo_url: draft.logoUrl.trim() || null,
      is_active: draft.isActive,
    };
    try {
      if (editing) await updateBrand(draft.id, input);
      else await createBrand(input);
      setMsg(editing ? `Marca "${input.name}" atualizada.` : `Marca "${input.name}" cadastrada.`);
      setDraft(EMPTY_BRAND);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar marca.");
    }
  };

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />{brands.length} marcas cadastradas. Vincule a marca ao produto na aba Produtos.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">{editing ? "Editar marca" : "Nova marca"}</h2>
        <div className="px-admin__grid">
          <label className="px-field px-field--wide">
            <span>Nome *</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value, slug: editing ? d.slug : slugify(e.target.value) }))}
              required placeholder="Ex.: Faber-Castell"
            />
          </label>
          <label className="px-field px-field--wide">
            <span>URL do logo (opcional)</span>
            <input value={draft.logoUrl} onChange={(e) => setDraft((d) => ({ ...d, logoUrl: e.target.value }))} placeholder="https://…" />
          </label>
          <label className="px-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} style={{ height: "auto" }} />
            <span>Ativa</span>
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm">
            {editing ? "Salvar alterações" : "Cadastrar marca"}
          </button>
          {(draft.id || draft.name) && (
            <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => { setDraft(EMPTY_BRAND); setMsg(null); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="px-admin__list">
        {brands.map((b) => (
          <div className="px-admin__row" key={b.id}>
            <span className="px-admin__icon px-cat__icon--blue"><Icon name="medal" size={18} /></span>
            <div className="px-admin__rowinfo">
              <strong>{b.name}{!b.is_active && " (inativa)"}</strong>
              <small>{b.slug}</small>
            </div>
            <div className="px-admin__rowactions">
              <button type="button" onClick={() => { setDraft({ id: b.id, name: b.name, slug: b.slug, logoUrl: b.logo_url ?? "", isActive: b.is_active }); setMsg(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar</button>
              <button type="button" onClick={async () => { await setBrandActive(b.id, !b.is_active); load(); }}>
                {b.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------- Estoque ---------------------------------- */

function EstoqueTab({ onChanged }: { onChanged: () => void }) {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [movements, setMovements] = useState<InventoryMovementRow[]>([]);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<InventoryMovementType>("in");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    listAllProducts().then(setProducts).catch(() => setMsg("Erro ao carregar produtos."));
    listMovements().then(setMovements).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const qty = Math.floor(num(quantity));
    if (!productId || !(qty >= 0)) { setMsg("Escolha um produto e uma quantidade válida."); return; }
    setSaving(true);
    try {
      await registerMovement({ productId, type, quantity: qty, reason: reason.trim() || undefined });
      setMsg("Movimentação registrada.");
      setQuantity("");
      setReason("");
      load();
      onChanged();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao registrar movimentação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />Entrada soma ao estoque, Saída subtrai, Ajuste define o valor exato. Pedidos da loja dão baixa automática.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">Nova movimentação</h2>
        <div className="px-admin__grid">
          <label className="px-field px-field--wide">
            <span>Produto *</span>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              <option value="">Selecione…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} (estoque atual: {p.stock_quantity})</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Tipo *</span>
            <select value={type} onChange={(e) => setType(e.target.value as InventoryMovementType)}>
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
              <option value="adjustment">Ajuste (define o valor)</option>
            </select>
          </label>
          <label className="px-field">
            <span>Quantidade *</span>
            <input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="numeric" required placeholder="10" />
          </label>
          <label className="px-field px-field--wide">
            <span>Motivo</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex.: compra do fornecedor, avaria, inventário…" />
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm" disabled={saving}>
            {saving ? "Registrando…" : "Registrar movimentação"}
          </button>
        </div>
      </form>

      <div className="px-admin__list">
        {movements.map((m) => (
          <div className="px-admin__row" key={m.id}>
            <span className={`px-admin__icon px-cat__icon--${m.type === "in" ? "teal" : m.type === "out" ? "red" : "amber"}`}>
              <Icon name="boxes" size={18} />
            </span>
            <div className="px-admin__rowinfo">
              <strong>{MOVEMENT_LABEL[m.type]} · {m.quantity} un. · {m.products?.name ?? "produto removido"}</strong>
              <small>
                {new Date(m.created_at).toLocaleString("pt-BR")}
                {m.reason ? ` · ${m.reason}` : ""}
                {m.created_by ? ` · por ${m.created_by}` : ""}
              </small>
            </div>
          </div>
        ))}
        {movements.length === 0 && <p className="px-listing__count">Nenhuma movimentação registrada ainda.</p>}
      </div>
    </>
  );
}

/* --------------------------------- Pedidos ---------------------------------- */

function PedidosTab() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listOrders()
      .then(setOrders)
      .catch(() => setMsg("Erro ao carregar pedidos."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onStatusChange = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao atualizar status do pedido.");
      load();
    }
  };

  if (loading) return <p className="px-listing__count">Carregando pedidos…</p>;

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />{orders.length} pedidos recebidos.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      {orders.length === 0 ? (
        <div className="px-empty">
          <span className="px-empty__icon"><Icon name="box" size={30} /></span>
          <p>Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        orders.map((o) => (
          <div className="px-admin__order" key={o.id}>
            <div className="px-admin__orderhead">
              <div>
                <strong>{o.customer_name}</strong>
                <div>
                  <small>{o.customer_phone}{o.customer_email ? ` · ${o.customer_email}` : ""}</small>
                </div>
                <small>{o.fulfillment === "entrega" ? `Entrega${o.customer_address ? `: ${o.customer_address}` : ""}` : "Retirada na loja"}</small>
              </div>
              <small>{new Date(o.created_at).toLocaleString("pt-BR")}</small>
            </div>
            <ul className="px-admin__orderitems">
              {o.order_items.map((it) => (
                <li key={it.id}>
                  <span>{it.quantity}× {it.product_name}{it.variant_name ? ` (${it.variant_name})` : ""}</span>
                  <span>{fmtBRL(it.subtotal)}</span>
                </li>
              ))}
              {o.discount_amount > 0 && (
                <li><span>Desconto{o.coupon_code ? ` (${o.coupon_code})` : ""}</span><span>- {fmtBRL(o.discount_amount)}</span></li>
              )}
              {o.shipping_fee > 0 && (
                <li><span>Frete</span><span>{fmtBRL(o.shipping_fee)}</span></li>
              )}
            </ul>
            {o.notes && <p className="px-admin__note">{o.notes}</p>}
            <div className="px-admin__orderfoot">
              <strong>{fmtBRL(o.total_amount)} · {PAYMENT_LABEL[o.payment_method]}</strong>
              <select value={o.status} onChange={(e) => onStatusChange(o.id, e.target.value as OrderStatus)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>
          </div>
        ))
      )}
    </>
  );
}

/* --------------------------------- Cupons ----------------------------------- */

type CouponDraft = {
  id: string; code: string; type: "percentage" | "fixed"; value: string;
  minOrderAmount: string; expiresAt: string; usageLimit: string; isActive: boolean;
};
const EMPTY_COUPON: CouponDraft = {
  id: "", code: "", type: "percentage", value: "", minOrderAmount: "", expiresAt: "", usageLimit: "", isActive: true,
};

function CuponsTab() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [draft, setDraft] = useState<CouponDraft>(EMPTY_COUPON);
  const [msg, setMsg] = useState<string | null>(null);
  const editing = !!draft.id;

  const load = useCallback(() => {
    listAllCoupons().then(setCoupons).catch(() => setMsg("Erro ao carregar cupons."));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.code.trim() || !(num(draft.value) > 0)) {
      setMsg("Preencha o código e um valor de desconto maior que zero.");
      return;
    }
    const input: CouponInput = {
      code: draft.code.trim().toUpperCase(),
      type: draft.type,
      value: num(draft.value),
      min_order_amount: draft.minOrderAmount ? num(draft.minOrderAmount) : 0,
      expires_at: draft.expiresAt ? new Date(`${draft.expiresAt}T23:59:59`).toISOString() : null,
      usage_limit: draft.usageLimit ? Math.floor(num(draft.usageLimit)) : null,
      is_active: draft.isActive,
    };
    try {
      if (editing) await updateCoupon(draft.id, input);
      else await createCoupon(input);
      setMsg(editing ? `Cupom ${input.code} atualizado.` : `Cupom ${input.code} criado.`);
      setDraft(EMPTY_COUPON);
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar cupom.");
    }
  };

  const toDraft = (c: CouponRow): CouponDraft => ({
    id: c.id, code: c.code, type: c.type, value: String(c.value),
    minOrderAmount: c.min_order_amount ? String(c.min_order_amount) : "",
    expiresAt: c.expires_at ? c.expires_at.slice(0, 10) : "",
    usageLimit: c.usage_limit != null ? String(c.usage_limit) : "",
    isActive: c.is_active,
  });

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />{coupons.length} cupons. O cliente digita o código no carrinho; o desconto é validado direto no banco.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">{editing ? "Editar cupom" : "Novo cupom"}</h2>
        <div className="px-admin__grid">
          <label className="px-field">
            <span>Código *</span>
            <input value={draft.code} onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value.toUpperCase() }))} required placeholder="PAULEX10" />
          </label>
          <label className="px-field">
            <span>Tipo *</span>
            <select value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as "percentage" | "fixed" }))}>
              <option value="percentage">Percentual (%)</option>
              <option value="fixed">Valor fixo (R$)</option>
            </select>
          </label>
          <label className="px-field">
            <span>{draft.type === "percentage" ? "Desconto (%) *" : "Desconto (R$) *"}</span>
            <input value={draft.value} onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))} inputMode="decimal" required placeholder={draft.type === "percentage" ? "10" : "5,00"} />
          </label>
          <label className="px-field">
            <span>Pedido mínimo (R$)</span>
            <input value={draft.minOrderAmount} onChange={(e) => setDraft((d) => ({ ...d, minOrderAmount: e.target.value }))} inputMode="decimal" placeholder="0" />
          </label>
          <label className="px-field">
            <span>Validade (até)</span>
            <input type="date" value={draft.expiresAt} onChange={(e) => setDraft((d) => ({ ...d, expiresAt: e.target.value }))} />
          </label>
          <label className="px-field">
            <span>Limite de usos</span>
            <input value={draft.usageLimit} onChange={(e) => setDraft((d) => ({ ...d, usageLimit: e.target.value }))} inputMode="numeric" placeholder="Ilimitado" />
          </label>
          <label className="px-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} style={{ height: "auto" }} />
            <span>Ativo</span>
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm">
            {editing ? "Salvar alterações" : "Criar cupom"}
          </button>
          {(draft.id || draft.code) && (
            <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => { setDraft(EMPTY_COUPON); setMsg(null); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="px-admin__list">
        {coupons.map((c) => (
          <div className="px-admin__row" key={c.id}>
            <span className="px-admin__icon px-cat__icon--amber"><Icon name="tag" size={18} /></span>
            <div className="px-admin__rowinfo">
              <strong>{c.code}{!c.is_active && " (inativo)"}</strong>
              <small>
                {c.type === "percentage" ? `${c.value}% off` : `${fmtBRL(c.value)} off`}
                {c.min_order_amount > 0 && ` · mín. ${fmtBRL(c.min_order_amount)}`}
                {c.expires_at && ` · até ${new Date(c.expires_at).toLocaleDateString("pt-BR")}`}
                {` · usado ${c.used_count}×${c.usage_limit != null ? ` de ${c.usage_limit}` : ""}`}
              </small>
            </div>
            <div className="px-admin__rowactions">
              <button type="button" onClick={() => { setDraft(toDraft(c)); setMsg(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar</button>
              <button type="button" onClick={async () => { await setCouponActive(c.id, !c.is_active); load(); }}>
                {c.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ----------------------------------- Loja ----------------------------------- */

function LojaTab() {
  const [settings, setSettings] = useState<StoreSettingsRow | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings).catch(() => setMsg("Erro ao carregar configurações."));
  }, []);

  if (!settings) return <p className="px-listing__count">Carregando configurações…</p>;

  const set = (k: keyof StoreSettingsRow) => (e: ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => (s ? { ...s, [k]: e.target.value } : s));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStoreSettings({
        whatsapp_number: String(settings.whatsapp_number).replace(/\D/g, ""),
        address: settings.address || null,
        opening_hours: settings.opening_hours || null,
        delivery_fee: Number(String(settings.delivery_fee).replace(",", ".")) || 0,
        min_order_amount: Number(String(settings.min_order_amount).replace(",", ".")) || 0,
      });
      setMsg("Configurações salvas. Elas valem imediatamente para novos pedidos.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <p className="px-admin__note"><Icon name="shield" size={15} />Estas configurações controlam o WhatsApp do checkout, a taxa de entrega e o pedido mínimo da loja.</p>
      {msg && <p className="px-admin__msg" role="status">{msg}</p>}

      <form className="px-admin__form" onSubmit={onSubmit}>
        <h2 className="px-admin__formtitle">Configurações da loja</h2>
        <div className="px-admin__grid">
          <label className="px-field px-field--wide">
            <span>WhatsApp (só números, com DDI/DDD)</span>
            <input value={settings.whatsapp_number} onChange={set("whatsapp_number")} inputMode="tel" placeholder="5521987578187" />
          </label>
          <label className="px-field px-field--wide">
            <span>Endereço da loja</span>
            <input value={settings.address ?? ""} onChange={set("address")} placeholder="Rua…, nº — bairro, Rio de Janeiro" />
          </label>
          <label className="px-field px-field--wide">
            <span>Horário de funcionamento</span>
            <input value={settings.opening_hours ?? ""} onChange={set("opening_hours")} placeholder="Seg a Sáb, 8h às 18h" />
          </label>
          <label className="px-field">
            <span>Taxa de entrega (R$)</span>
            <input value={String(settings.delivery_fee)} onChange={set("delivery_fee")} inputMode="decimal" placeholder="0" />
          </label>
          <label className="px-field">
            <span>Pedido mínimo (R$)</span>
            <input value={String(settings.min_order_amount)} onChange={set("min_order_amount")} inputMode="decimal" placeholder="0" />
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm" disabled={saving}>
            {saving ? "Salvando…" : "Salvar configurações"}
          </button>
        </div>
      </form>
    </>
  );
}
