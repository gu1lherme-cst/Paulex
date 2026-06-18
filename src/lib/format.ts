export const money = (v: number): string =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const num = (v: number): string => v.toLocaleString("pt-BR");

export const plural = (n: number, singular: string, plural: string): string =>
  `${n} ${n === 1 ? singular : plural}`;
