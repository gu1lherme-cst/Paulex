import { Icon } from "./Icon";
import type { IconName, Tone } from "../data/catalog";

/* Placeholder visual (ícone + cor) usado quando o produto não tem foto
   cadastrada. Quando `imageUrl` é informado, mostra a foto real no lugar. */
export function Placeholder({
  label,
  icon,
  tone = "soft",
  imageUrl,
  className,
}: {
  label: string;
  icon: IconName;
  tone?: Tone;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`px-ph px-ph--img${className ? ` ${className}` : ""}`}>
        <img src={imageUrl} alt={label} loading="lazy" decoding="async" />
      </div>
    );
  }

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
