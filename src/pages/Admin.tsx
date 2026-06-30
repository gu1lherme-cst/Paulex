import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { href } from "../lib/router";
import { useProducts } from "../lib/products";
import {
  CATEGORIES, PRODUCT_ICONS, TONES, sanitizeProduct, fmtBRL, type Product,
} from "../data/catalog";

type Draft = {
  id: string; sku: string; name: string; category: string;
  priceNum: string; oldPriceNum: string; wholesalePrice: string; wholesaleMin: string;
  stock: string; icon: string; tone: string; tags: string; installment: string;
};

const EMPTY: Draft = {
  id: "", sku: "", name: "", category: CATEGORIES[0], priceNum: "", oldPriceNum: "",
  wholesalePrice: "", wholesaleMin: "", stock: "0", icon: "stack", tone: "blue", tags: "", installment: "",
};

const toDraft = (p: Product): Draft => ({
  id: p.id, sku: p.sku, name: p.name, category: p.category,
  priceNum: String(p.priceNum), oldPriceNum: p.oldPriceNum ? String(p.oldPriceNum) : "",
  wholesalePrice: p.wholesalePrice ? String(p.wholesalePrice) : "",
  wholesaleMin: p.wholesaleMin ? String(p.wholesaleMin) : "",
  stock: String(p.stock), icon: p.icon, tone: p.tone,
  tags: (p.tags ?? []).join(", "), installment: p.installment,
});

const num = (s: string) => Number(s.replace(",", ".").trim());

export function Admin() {
  const { products, isCustom, upsert, remove, replaceAll, reset } = useProducts();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const editing = !!draft.id && products.some((p) => p.id === draft.id);

  const set = (k: keyof Draft) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDraft((d) => ({ ...d, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = sanitizeProduct({
      id: draft.id || undefined,
      sku: draft.sku || undefined,
      name: draft.name,
      category: draft.category,
      priceNum: num(draft.priceNum),
      oldPriceNum: draft.oldPriceNum ? num(draft.oldPriceNum) : undefined,
      wholesalePrice: draft.wholesalePrice ? num(draft.wholesalePrice) : undefined,
      wholesaleMin: draft.wholesaleMin ? num(draft.wholesaleMin) : undefined,
      stock: num(draft.stock),
      icon: draft.icon,
      tone: draft.tone,
      tags: draft.tags ? draft.tags.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      installment: draft.installment || undefined,
    });
    if (!p) { setMsg("Preencha nome, categoria e um preço válido (maior que zero)."); return; }
    upsert(p);
    setMsg(editing ? `Produto "${p.name}" atualizado.` : `Produto "${p.name}" cadastrado.`);
    setDraft(EMPTY);
  };

  const onEdit = (p: Product) => {
    setDraft(toDraft(p));
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = (p: Product) => {
    if (window.confirm(`Excluir "${p.name}"?`)) {
      remove(p.id);
      if (draft.id === p.id) setDraft(EMPTY);
      setMsg(`Produto "${p.name}" excluído.`);
    }
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paulex-catalogo.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const ok = replaceAll(JSON.parse(String(reader.result)));
        setMsg(ok ? "Catálogo importado com sucesso." : "Arquivo sem produtos válidos.");
      } catch {
        setMsg("Arquivo JSON inválido.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const onReset = () => {
    if (window.confirm("Restaurar o catálogo padrão? As alterações locais serão perdidas.")) {
      reset();
      setDraft(EMPTY);
      setMsg("Catálogo padrão restaurado.");
    }
  };

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
          <p className="px-listing__count">
            {products.length} produtos {isCustom ? "· catálogo personalizado (salvo neste navegador)" : "· catálogo padrão"}
          </p>
        </div>
        <div className="px-admin__actions">
          <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={onExport}>Exportar JSON</button>
          <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => fileRef.current?.click()}>Importar JSON</button>
          <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={onReset}>Restaurar padrão</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
        </div>
      </div>

      <p className="px-admin__note">
        <Icon name="shield" size={15} />
        As alterações aparecem na loja na hora e ficam salvas neste navegador (localStorage) — ótimo para protótipo. Próximo passo: trocar a fonte por um backend real.
      </p>

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
            <select value={draft.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="px-field">
            <span>Preço (R$) *</span>
            <input value={draft.priceNum} onChange={set("priceNum")} inputMode="decimal" required placeholder="29,90" />
          </label>
          <label className="px-field">
            <span>Preço antigo (R$)</span>
            <input value={draft.oldPriceNum} onChange={set("oldPriceNum")} inputMode="decimal" placeholder="39,90" />
          </label>
          <label className="px-field">
            <span>Estoque *</span>
            <input value={draft.stock} onChange={set("stock")} inputMode="numeric" placeholder="20" />
          </label>
          <label className="px-field">
            <span>Preço atacado (R$)</span>
            <input value={draft.wholesalePrice} onChange={set("wholesalePrice")} inputMode="decimal" placeholder="25,90" />
          </label>
          <label className="px-field">
            <span>Qtd. mín. atacado</span>
            <input value={draft.wholesaleMin} onChange={set("wholesaleMin")} inputMode="numeric" placeholder="6" />
          </label>
          <label className="px-field">
            <span>Parcelamento</span>
            <input value={draft.installment} onChange={set("installment")} placeholder="em 3x sem juros" />
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
            <span>Tags (separadas por vírgula)</span>
            <input value={draft.tags} onChange={set("tags")} placeholder="escola, caderno" />
          </label>
        </div>
        <div className="px-admin__formactions">
          <button type="submit" className="px-btn px-btn--primary px-btn--sm">
            {editing ? "Salvar alterações" : "Cadastrar produto"}
          </button>
          {(draft.id || draft.name) && (
            <button type="button" className="px-btn px-btn--ghost px-btn--sm" onClick={() => { setDraft(EMPTY); setMsg(null); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="px-admin__list">
        {products.map((p) => (
          <div className="px-admin__row" key={p.id}>
            <span className={`px-admin__icon px-cat__icon--${p.tone}`}><Icon name={p.icon} size={18} /></span>
            <div className="px-admin__rowinfo">
              <strong>{p.name}</strong>
              <small>{p.category} · {p.sku} · {fmtBRL(p.priceNum)} · estoque {p.stock}</small>
            </div>
            <div className="px-admin__rowactions">
              <button type="button" onClick={() => onEdit(p)} aria-label={`Editar ${p.name}`}>Editar</button>
              <button type="button" className="px-admin__del" onClick={() => onDelete(p)} aria-label={`Excluir ${p.name}`}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
