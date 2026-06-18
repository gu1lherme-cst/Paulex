import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useToast } from "../context/ToastContext";
import { CATEGORIES } from "../data/catalog";
import { money } from "../lib/format";
import { Icon, ICONS } from "../components/Icon";
import type { CategoryId, Product } from "../types";

const BLANK: Product = {
  id: "",
  nome: "",
  unidade: "Unidade",
  preco: 0,
  cat: "papelaria",
  desc: "",
  specs: [],
  art: '<rect x="14" y="12" width="36" height="40" rx="4" fill="#DEE8FB"/>',
  rating: 4.5,
  avaliacoes: 0,
  estoque: 0,
};

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function AdminProdutos() {
  const { products, upsertProduct, deleteProduct, resetProducts } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filter, setFilter] = useState("");

  const list = products.filter((p) =>
    p.nome.toLowerCase().includes(filter.trim().toLowerCase()),
  );

  const open = (p: Product | null) => {
    if (p) {
      setEditing({ ...p });
      setIsNew(false);
    } else {
      setEditing({ ...BLANK });
      setIsNew(true);
    }
  };

  const save = () => {
    if (!editing) return;
    const nome = editing.nome.trim();
    if (!nome) {
      toast("Informe o nome do produto");
      return;
    }
    const id = isNew ? slug(nome) || `prod-${Date.now()}` : editing.id;
    if (isNew && products.some((p) => p.id === id)) {
      toast("Já existe um produto com esse nome");
      return;
    }
    upsertProduct({ ...editing, id, nome });
    toast(isNew ? "Produto criado!" : "Produto atualizado!");
    setEditing(null);
  };

  const remove = (p: Product) => {
    if (confirm(`Excluir "${p.nome}"?`)) {
      deleteProduct(p.id);
      toast("Produto removido");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-head">
        <div>
          <h1>Produtos</h1>
          <p className="muted">{products.length} itens no catálogo.</p>
        </div>
        <div className="admin-head-actions">
          <button className="pill pill-outline" onClick={() => {
            if (confirm("Restaurar o catálogo padrão? Suas edições serão perdidas.")) {
              resetProducts();
              toast("Catálogo restaurado");
            }
          }}>
            Restaurar padrão
          </button>
          <button className="pill pill-blue" onClick={() => open(null)}>
            <Icon path={ICONS.plus} /> Novo produto
          </button>
        </div>
      </header>

      <div className="search admin-search">
        <Icon path={ICONS.search} />
        <input
          placeholder="Buscar produto..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Destaques</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{CATEGORIES.find((c) => c.id === p.cat)?.nome}</td>
                <td>{money(p.preco)}</td>
                <td className={p.estoque < 50 ? "low" : ""}>{p.estoque}</td>
                <td>
                  {p.promo && <span className="chip red">Oferta</span>}
                  {p.novidade && <span className="chip">Novo</span>}
                  {p.maisVendido && <span className="chip green">Top</span>}
                </td>
                <td className="row-actions">
                  <button className="icon-btn" aria-label="Editar" onClick={() => open(p)}>
                    <Icon path={ICONS.edit} />
                  </button>
                  <button className="icon-btn" aria-label="Excluir" onClick={() => remove(p)}>
                    <Icon path={ICONS.trash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isNew ? "Novo produto" : "Editar produto"}</h3>
            <div className="modal-grid">
              <label className="field wide">
                <input
                  placeholder="Nome do produto"
                  value={editing.nome}
                  onChange={(e) => setEditing({ ...editing, nome: e.target.value })}
                />
              </label>
              <label className="field">
                <select
                  value={editing.cat}
                  onChange={(e) =>
                    setEditing({ ...editing, cat: e.target.value as CategoryId })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <input
                  placeholder="Unidade"
                  value={editing.unidade}
                  onChange={(e) => setEditing({ ...editing, unidade: e.target.value })}
                />
              </label>
              <label className="field">
                <span className="field-pre">R$ Preço</span>
                <input
                  type="number"
                  step="0.01"
                  value={editing.preco}
                  onChange={(e) =>
                    setEditing({ ...editing, preco: parseFloat(e.target.value) || 0 })
                  }
                />
              </label>
              <label className="field">
                <span className="field-pre">Estoque</span>
                <input
                  type="number"
                  value={editing.estoque}
                  onChange={(e) =>
                    setEditing({ ...editing, estoque: parseInt(e.target.value) || 0 })
                  }
                />
              </label>
              <label className="field wide">
                <textarea
                  placeholder="Descrição"
                  rows={3}
                  value={editing.desc}
                  onChange={(e) => setEditing({ ...editing, desc: e.target.value })}
                />
              </label>
              <div className="modal-checks wide">
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.promo}
                    onChange={(e) => setEditing({ ...editing, promo: e.target.checked })}
                  />
                  Oferta
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.novidade}
                    onChange={(e) => setEditing({ ...editing, novidade: e.target.checked })}
                  />
                  Novidade
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={!!editing.maisVendido}
                    onChange={(e) =>
                      setEditing({ ...editing, maisVendido: e.target.checked })
                    }
                  />
                  Mais vendido
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="pill pill-outline" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button className="pill pill-blue" onClick={save}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
