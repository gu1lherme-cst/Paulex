const curiosidades = [
  "O coração de uma baleia-azul pode pesar mais de 180 kg.",
  "Polvos possuem três corações e sangue azul.",
  "Um dia em Vênus é maior que um ano no planeta.",
  "Cleópatra viveu mais perto do iPhone do que das pirâmides.",
  "Algumas árvores se comunicam por redes subterrâneas de fungos.",
  "O cérebro humano consome cerca de 20% da energia do corpo.",
  "A água quente pode congelar mais rápido que a fria em certas condições.",
  "O mel pode durar anos sem estragar quando bem armazenado."
];

const curiosidadeTexto = document.getElementById("curiosidade-texto");
const botaoCuriosidade = document.getElementById("nova-curiosidade");

if (botaoCuriosidade && curiosidadeTexto) {
  botaoCuriosidade.addEventListener("click", () => {
    const indiceAleatorio = Math.floor(Math.random() * curiosidades.length);
    curiosidadeTexto.textContent = curiosidades[indiceAleatorio];
  });
}

/* FILTROS + BUSCA */
const botoesFiltro = document.querySelectorAll(".filtro-btn");
const cards = document.querySelectorAll(".card");
const campoBusca = document.getElementById("campo-busca");
const mensagemSemResultado = document.getElementById("mensagem-sem-resultado");

let filtroAtual = "todos";

function aplicarFiltrosEBusca() {
  const termoBusca = campoBusca ? campoBusca.value.toLowerCase().trim() : "";
  let visiveis = 0;

  cards.forEach((card) => {
    const categoria = card.getAttribute("data-categoria").toLowerCase();
    const titulo = card.querySelector("h3").textContent.toLowerCase();
    const texto = card.querySelector("p").textContent.toLowerCase();

    const passaFiltro = filtroAtual === "todos" || categoria === filtroAtual;
    const passaBusca =
      titulo.includes(termoBusca) ||
      texto.includes(termoBusca) ||
      categoria.includes(termoBusca);

    if (passaFiltro && passaBusca) {
      card.classList.remove("oculto");
      visiveis++;
    } else {
      card.classList.add("oculto");
    }
  });

  if (mensagemSemResultado) {
    mensagemSemResultado.textContent =
      visiveis === 0 ? "Nenhuma curiosidade encontrada." : "";
  }
}

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach((btn) => btn.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtroAtual = botao.getAttribute("data-filtro");
    aplicarFiltrosEBusca();
  });
});

if (campoBusca) {
  campoBusca.addEventListener("input", aplicarFiltrosEBusca);
}

/* NEWSLETTER */
const formNewsletter = document.getElementById("form-newsletter");
const emailInput = document.getElementById("email");
const mensagemForm = document.getElementById("mensagem-form");

if (formNewsletter && emailInput && mensagemForm) {
  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
      mensagemForm.textContent = "Digite um e-mail válido.";
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      mensagemForm.textContent = "Digite um e-mail válido.";
      return;
    }

    mensagemForm.textContent = "Cadastro realizado com sucesso!";
    emailInput.value = "";
  });
}

/* TEMA CLARO / ESCURO */
const temaBtn = document.getElementById("tema-btn");

function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem("tema-site");

  if (temaSalvo === "claro") {
    document.body.classList.add("tema-claro");
    if (temaBtn) temaBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("tema-claro");
    if (temaBtn) temaBtn.textContent = "🌙";
  }
}

if (temaBtn) {
  aplicarTemaSalvo();

  temaBtn.addEventListener("click", () => {
    document.body.classList.toggle("tema-claro");

    const temaAtual = document.body.classList.contains("tema-claro")
      ? "claro"
      : "escuro";

    localStorage.setItem("tema-site", temaAtual);
    temaBtn.textContent = temaAtual === "claro" ? "☀️" : "🌙";
  });
}

/* ANIMAÇÃO NO SCROLL */
const elementosReveal = document.querySelectorAll(".reveal");

function mostrarElementos() {
  const alturaJanela = window.innerHeight;

  elementosReveal.forEach((elemento) => {
    const topoElemento = elemento.getBoundingClientRect().top;

    if (topoElemento < alturaJanela - 80) {
      elemento.classList.add("visivel");
    }
  });
}

window.addEventListener("scroll", mostrarElementos);
window.addEventListener("load", () => {
  aplicarFiltrosEBusca();
  aplicarTemaSalvo();
  mostrarElementos();
});