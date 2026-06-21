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

/* Aplicativo instalável (PWA) */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
