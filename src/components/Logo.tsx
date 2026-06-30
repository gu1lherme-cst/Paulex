/* Logo Paulex (fundo removido). variant controla tamanho/opacidade via CSS. */
export function Logo({ variant = "light" }: { variant?: "light" | "muted" }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}img/paulex-logo.png`}
      alt="Paulex"
      className={`px-logo px-logo--${variant}`}
      width={260}
      height={154}
      loading={variant === "muted" ? "lazy" : "eager"}
      decoding="async"
    />
  );
}
