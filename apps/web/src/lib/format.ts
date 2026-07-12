export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: amount >= 100_000 ? 'compact' : 'standard',
    maximumFractionDigits: amount >= 100_000 ? 1 : 2,
  }).format(amount);
}

export function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number) as [number, number];
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}
