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
  type AdminProductRow, type ProductInput,
} from "../services/productsService";
import { listOrders, updateOrderStatus } from "../services/ordersService";
import type { CategoryRow, OrderStatus, OrderWithItems, PaymentMethod } from "../services/types";

/* ----------------------------------------------------------------------------
 * Painel administrativo: login por magic link + CRUD de produtos/categorias +
 * gestão de pedidos, todos falando direto com o Supabase (src/services/*).
 * ------------------------------------------------------------------------- */

type Tab = "produtos" | "categorias" | "pedidos";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_preparo: "Em preparo",
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
        <button type="button" role="listitem" className={`px-chip${tab === "produtos" ? " px-chip--on" : ""}`} onClick={() => setTab("produtos")}>Produtos</button>
        <button type="button" role="listitem" className={`px-chip${tab === "categorias" ? " px-chip--on" : ""}`} onClick={() => setTab("categorias")}>Categorias</button>
        <button type="button" role="listitem" className={`px-chip${tab === "pedidos" ? " px-chip--on" : ""}`} onClick={() => setTab("pedidos")}>Pedidos</button>
      </div>

      {tab === "produtos" && <ProdutosTab onChanged={onDataChanged} />}
      {tab === "categorias" && <CategoriasTab onChanged={onDataChanged} />}
      {tab === "pedidos" && <PedidosTab />}
    </main>
  );
}

/* -------------------------------- Produtos --------------------------------- */

type ProductDraft = {
  id: string; name: string; slug: string; description: string; sku: string; categoryId: string;
  price: string; promotionalPrice: string; stockQuantity: string;
  wholesalePrice: string; wholesaleMinQty: string; installmentLabel: string;
  icon: string; tone: string; imageUrl: string; isFeatured: boolean; isActive: boolean;
};

const EMPTY_PRODUCT: ProductDraft = {
  id: "", name: "", slug: "", description: "", sku: "", categoryId: "",
  price: "", promotionalPrice: "", stockQuantity: "0",
  wholesalePrice: "", wholesaleMinQty: "", installmentLabel: "à vista",
  icon: "stack", tone: "blue", imageUrl: "", isFeatured: false, isActive: true,
};

const toProductDraft = (p: AdminProductRow): ProductDraft => ({
  id: p.id, name: p.name, slug: p.slug, description: p.description ?? "", sku: p.sku ?? "",
  categoryId: p.category_id ?? "",
  price: String(p.price), promotionalPrice: p.promotional_price != null ? String(p.promotional_price) : "",
  stockQuantity: String(p.stock_quantity),
  wholesalePrice: p.wholesale_price != null ? String(p.wholesale_price) : "",
  wholesaleMinQty: p.wholesale_min_qty != null ? String(p.wholesale_min_qty) : "",
  installmentLabel: p.installment_label, icon: p.icon, tone: p.tone,
  imageUrl: p.image_url ?? "", isFeatured: p.is_featured, isActive: p.is_active,
});

const num = (s: string) => Number(s.replace(",", ".").trim());

function ProdutosTab({ onChanged }: { onChanged: () => void }) {
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_PRODUCT);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editing = !!draft.id;

  const load = useCallback(() => {
    listAllProducts().then(setProducts).catch(() => setMsg("Erro ao carregar produtos."));
    listAllCategories().then(setCategories).catch(() => {});
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
    const input: ProductInput = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      description: draft.description.trim() || null,
      price: num(draft.price),
      promotional_price: draft.promotionalPrice ? num(draft.promotionalPrice) : null,
      category_id: draft.categoryId,
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
            <span>URL da foto (opcional)</span>
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
                {o.customer_address && <small>Entrega: {o.customer_address}</small>}
              </div>
              <small>{new Date(o.created_at).toLocaleString("pt-BR")}</small>
            </div>
            <ul className="px-admin__orderitems">
              {o.order_items.map((it) => (
                <li key={it.id}>
                  <span>{it.quantity}× {it.product_name}</span>
                  <span>{fmtBRL(it.subtotal)}</span>
                </li>
              ))}
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
