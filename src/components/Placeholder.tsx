import { Icon } from "./Icon";
import type { IconName, Tone } from "../data/catalog";

/* Placeholder visual de imagem (ícone + cor). Troque por <img> quando houver fotos. */
export function Placeholder({
  label,
  icon,
  tone = "soft",
  className,
}: {
  label: string;
  icon: IconName;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`px-ph px-ph--${tone}${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={label}
    >
      <span className="px-ph__icon">
        <Icon name={icon} size={34} />
      </span>
      <span className="px-ph__label">{label}</span>
    </div>
  );
}
