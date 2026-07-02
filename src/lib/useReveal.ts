import { useEffect } from "react";

/* Anima elementos [data-reveal] ao entrarem na viewport. Reexecuta a cada
   mudança de `key` (ex.: rota) e também observa elementos adicionados
   DEPOIS (ex.: produtos que chegam do banco e substituem o skeleton). */
export function useReveal(key?: unknown) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.px-in)")
        .forEach((el) => el.classList.add("px-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("px-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.px-in):not([data-reveal-watched])")
        .forEach((el) => {
          el.setAttribute("data-reveal-watched", "");
          io.observe(el);
        });
    };

    observeAll();

    /* Conteúdo assíncrono (Supabase) monta depois do primeiro passe. */
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      /* permite reobservar na próxima rota */
      document
        .querySelectorAll<HTMLElement>("[data-reveal-watched]")
        .forEach((el) => el.removeAttribute("data-reveal-watched"));
    };
  }, [key]);
}
