/* Avaliação em estrelas (decorativa + texto acessível) */
export function Stars({ n, reviews }: { n: number; reviews: string }) {
  return (
    <div className="px-stars">
      <span className="px-stars__row" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < n ? "#F5A623" : "#E2E4E8"}>
            <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
          </svg>
        ))}
      </span>
      <span className="px-stars__count">
        <span className="px-sr-only">{n} de 5 estrelas, </span>({reviews})
      </span>
    </div>
  );
}
