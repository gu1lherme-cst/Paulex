import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { TopBar } from "../components/Layout";
import { Icon, ICONS } from "../components/Icon";
import { openWhatsApp } from "../lib/whatsapp";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"entrar" | "cadastrar">("entrar");

  const [loginUser, setLoginUser] = useState("");
  const [cadNome, setCadNome] = useState("");
  const [cadEmail, setCadEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let nome = "";
    let email = "";
    if (tab === "cadastrar") {
      nome = cadNome.trim();
      email = cadEmail.trim();
    } else {
      const u = loginUser.trim();
      if (u.includes("@")) {
        email = u;
        nome = u.split("@")[0];
      } else {
        nome = u;
      }
    }
    if (!nome && !email) return;
    const user = login({ nome, email });
    toast(user.nome ? `Bem-vindo, ${user.nome.split(" ")[0]}!` : "Bem-vindo à Paulex!");
    navigate(user.admin ? "/admin" : "/conta");
  };

  return (
    <section className="screen active">
      <TopBar title="Bem-vindo à Paulex" showCart={false} />
      <p className="center muted">Faça login para continuar</p>
      <div className="wrap narrow">
        <div className="tabs">
          <button
            className={"tab" + (tab === "entrar" ? " active" : "")}
            onClick={() => setTab("entrar")}
          >
            Entrar
          </button>
          <button
            className={"tab" + (tab === "cadastrar" ? " active" : "")}
            onClick={() => setTab("cadastrar")}
          >
            Cadastrar
          </button>
        </div>

        {tab === "entrar" ? (
          <form className="form" onSubmit={submit}>
            <label className="field">
              <Icon path={ICONS.search} />
              <input
                type="text"
                placeholder="E-mail ou nome"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <Icon path={ICONS.shield} />
              <input type="password" placeholder="Senha" required />
            </label>
            <button
              type="button"
              className="link right"
              onClick={() =>
                openWhatsApp("Olá, Paulex! Esqueci minha senha do site e preciso de ajuda.")
              }
            >
              Esqueceu sua senha?
            </button>
            <button className="pill pill-blue pill-lg" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={submit}>
            <label className="field">
              <input
                type="text"
                placeholder="Nome completo"
                value={cadNome}
                onChange={(e) => setCadNome(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <input
                type="email"
                placeholder="E-mail"
                value={cadEmail}
                onChange={(e) => setCadEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <input type="password" placeholder="Crie uma senha" required />
            </label>
            <button className="pill pill-blue pill-lg" type="submit">
              Criar conta
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
