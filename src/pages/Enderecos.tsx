import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import type { Address } from "../types";

const EMPTY: Address = { nome: "", cep: "", rua: "", bairro: "" };

export function Enderecos() {
  const { logged } = useAuth();
  const { addrs, saveAddr, deleteAddr, makeMainAddr } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Address>(EMPTY);

  if (!logged) return <Navigate to="/login" replace />;

  const openForm = (i: number) => {
    setEditing(i);
    setForm(i >= 0 ? addrs[i] : EMPTY);
  };

  const cepLookup = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (d.erro) return;
      setForm((f) => ({
        ...f,
        rua: f.rua || d.logradouro || "",
        bairro: `${d.bairro ? d.bairro + " · " : ""}${d.localidade}, ${d.uf}`,
      }));
    } catch {
      /* ignora falha de rede */
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddr(
      {
        nome: form.nome.trim(),
        cep: form.cep.trim(),
        rua: form.rua.trim(),
        bairro: form.bairro.trim(),
      },
      editing ?? -1,
    );
    setEditing(null);
    setForm(EMPTY);
    toast("Endereço salvo!");
  };

  return (
    <section className="screen active">
      <TopBar
        title="Meus Endereços"
        showCart={false}
        right={
          <button className="icon-btn" aria-label="Adicionar endereço" onClick={() => openForm(-1)}>
            <Icon path={ICONS.plus} />
          </button>
        }
      />
      <div className="wrap narrow">
        {addrs.length === 0 && editing === null && (
          <div className="empty orders-zero">
            <p>Nenhum endereço salvo ainda.</p>
            <button className="pill pill-blue" onClick={() => openForm(-1)}>
              Adicionar endereço
            </button>
          </div>
        )}

        <div className="addresses">
          {addrs.map((a, i) => (
            <div className="address" key={i}>
              <div>
                <strong>
                  {a.nome} {i === 0 && <span className="chip">Principal</span>}
                </strong>
                <small>
                  {a.rua}
                  <br />
                  {a.bairro}
                  <br />
                  CEP {a.cep || "—"}
                </small>
                {i > 0 && (
                  <button className="link addr-main" onClick={() => makeMainAddr(i)}>
                    Tornar principal
                  </button>
                )}
              </div>
              <div className="address-actions">
                <button className="icon-btn" aria-label="Editar" onClick={() => openForm(i)}>
                  <Icon path={ICONS.edit} />
                </button>
                <button
                  className="icon-btn"
                  aria-label="Excluir"
                  onClick={() => confirm(`Excluir o endereço "${a.nome}"?`) && deleteAddr(i)}
                >
                  <Icon path={ICONS.trash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {editing !== null && (
          <form className="form addr-form" onSubmit={submit}>
            <label className="field">
              <input
                placeholder="Nome do endereço (ex.: Casa)"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <input
                placeholder="CEP"
                inputMode="numeric"
                maxLength={9}
                value={form.cep}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
                onBlur={cepLookup}
              />
            </label>
            <label className="field">
              <input
                placeholder="Rua e número"
                value={form.rua}
                onChange={(e) => setForm({ ...form, rua: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <input
                placeholder="Bairro e cidade"
                value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                required
              />
            </label>
            <button className="pill pill-blue pill-lg" type="submit">
              Salvar endereço
            </button>
            <button
              className="pill pill-outline pill-lg"
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY);
              }}
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
