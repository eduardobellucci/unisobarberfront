export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

export function formatDateLabel(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(parsed);
}

export function formatFullDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function isUpcoming(date: string, time: string) {
  return parseDateTime(date, time).getTime() >= new Date().getTime();
}

