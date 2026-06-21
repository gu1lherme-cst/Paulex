/* ============================================================
   Px — landing EdTech · interações leves
   ============================================================ */

/* Header: sombra ao rolar */
const nav = document.getElementById("top");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Menu mobile */
const toggle = document.getElementById("nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // Fecha ao clicar em um link
  document.querySelectorAll(".nav-links a, .nav-actions a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* Revelação suave ao rolar */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

/* Pomodoro de demonstração (mockup) */
(function pomodoro() {
  const timeEl = document.getElementById("pomo-time");
  const btn = document.getElementById("pomo-btn");
  const ring = document.getElementById("pomo-ring-fg");
  if (!timeEl || !btn || !ring) return;

  const TOTAL = 25 * 60;          // 25:00
  const CIRC = 2 * Math.PI * 52;  // circunferência do anel
  ring.style.strokeDasharray = CIRC.toFixed(1);

  let left = TOTAL;
  let timer = null;

  function paint() {
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    timeEl.textContent = `${m}:${s}`;
    ring.style.strokeDashoffset = (CIRC * (1 - left / TOTAL)).toFixed(1);
  }

  function stop(label) {
    clearInterval(timer);
    timer = null;
    btn.textContent = label;
  }

  btn.addEventListener("click", () => {
    if (timer) { stop("Continuar"); return; }
    if (left === 0) left = TOTAL;
    btn.textContent = "Pausar";
    timer = setInterval(() => {
      left--;
      paint();
      if (left <= 0) stop("Iniciar");
    }, 1000);
  });

  paint();
})();

/* Ano dinâmico no rodapé (se houver) */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
}

/* ---------- Modal de autenticação ---------- */
const modal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSub = document.getElementById("auth-sub");
const authSubmit = document.getElementById("auth-submit");
const fieldNome = document.getElementById("field-nome");
let lastFocus = null;

function setAuthMode(mode) {
  const signup = mode !== "login";
  document.querySelectorAll(".auth-tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === (signup ? "signup" : "login"))
  );
  if (fieldNome) fieldNome.style.display = signup ? "" : "none";
  authTitle.textContent = signup ? "Crie sua conta gratuita" : "Bem-vindo de volta";
  authSub.textContent = signup
    ? "Comece a organizar seus estudos em menos de 1 minuto."
    : "Entre para continuar de onde parou.";
  authSubmit.textContent = signup ? "Começar gratuitamente" : "Entrar";
}

function openAuth(mode) {
  if (!modal) return;
  lastFocus = document.activeElement;
  setAuthMode(mode);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  const first = modal.querySelector('input[name="email"]');
  setTimeout(() => first && first.focus(), 60);
}

function closeAuth() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocus) lastFocus.focus();
}

if (modal) {
  // Abrir pelos CTAs (#cta e o botão final que aponta para #top)
  document.querySelectorAll('a[href="#cta"], .cta-final a[href="#top"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth(/entrar/i.test(a.textContent) ? "login" : "signup");
    });
  });
  // Trocar abas
  document.querySelectorAll(".auth-tabs button").forEach((b) =>
    b.addEventListener("click", () => setAuthMode(b.dataset.tab))
  );
  // Fechar
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeAuth)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeAuth();
  });
  // Enviar (demo)
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = authForm.email;
    const senha = authForm.senha;
    let ok = true;
    [email, senha].forEach((inp) => {
      const valid = inp.value.trim() && inp.checkValidity();
      inp.classList.toggle("err", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { toast("Confira o e-mail e a senha (mín. 6 caracteres)."); return; }
    const signup = authSubmit.textContent.includes("Começar");
    closeAuth();
    authForm.reset();
    toast(signup ? "Conta criada! Bem-vindo à Px 🎉 (demonstração)" : "Login efetuado! (demonstração)");
  });
}

/* Botões de comunidade / outros CTAs sem destino: feedback amigável */
document.querySelectorAll('a[href="#"]').forEach((a) => {
  a.addEventListener("click", (e) => { e.preventDefault(); toast("Em breve! 🚀"); });
});

/* Aplicativo instalável (PWA) */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
