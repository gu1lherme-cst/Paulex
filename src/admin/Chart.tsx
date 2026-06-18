interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  format?: (v: number) => string;
}

/** Gráfico de barras leve em SVG — sem dependências externas. */
export function BarChart({ data, height = 180, format }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const gap = 10;
  const barW = 100 / data.length;

  return (
    <div className="chart">
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="chart-svg">
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 26);
          const x = i * barW + gap / 2;
          const w = barW - gap;
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - 18 - h}
                width={w}
                height={Math.max(0, h)}
                rx={2}
                className="chart-bar"
              />
            </g>
          );
        })}
      </svg>
      <div className="chart-labels">
        {data.map((d, i) => (
          <span key={i} title={format ? format(d.value) : String(d.value)}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
