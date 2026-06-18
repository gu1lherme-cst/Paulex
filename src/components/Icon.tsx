interface IconProps {
  /** conteúdo interno do SVG (paths) */
  path: string;
  className?: string;
  size?: number;
}

/** Ícone de linha 24x24 (mesma identidade visual do site original). */
export function Icon({ path, className, size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

export const ICONS = {
  cart: '<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  home: '<path d="M4 11 12 4l8 7v9h-5v-6h-6v6H4v-9z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  crown: '<path d="M4 8l4 4 4-7 4 7 4-4-1 11H5L4 8z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/>',
  heart: '<path d="M12 20s-7-4.5-9-9c-1.2-2.8.6-6 3.8-6C9 5 10.5 6.5 12 8.5 13.5 6.5 15 5 17.2 5c3.2 0 5 3.2 3.8 6-2 4.5-9 9-9 9z"/>',
  whatsapp: '<path d="M21 12a9 9 0 1 0-3.5 7.1L21 21l-1-3.4A8.9 8.9 0 0 0 21 12z"/>',
  box: '<path d="M4 8l8-4 8 4v9l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v9"/>',
  pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="m9 12 2 2 4-4"/>',
  logout: '<path d="M9 4H5v16h4M14 8l4 4-4 4M18 12H9"/>',
  edit: '<path d="M5 19l1-4L16 5l3 3L9 18l-4 1z"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/>',
  tag: '<path d="M4 4h7l9 9-7 7-9-9V4z"/><circle cx="8" cy="8" r="1.4"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
  store: '<path d="M4 9h16v11H4zM2 9l2-4h16l2 4M9 13h6"/>',
  star: '<path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9L6.5 20l1-6.1L3 9.5l6.3-.9L12 3z"/>',
} as const;
