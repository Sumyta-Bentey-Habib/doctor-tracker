export function getDashboardInitials(name?: string): string {
  if (!name) return 'AD';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function formatDashboardDate(date?: string): string {
  if (!date) return '—';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function getSafeObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function getSafeArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(getSafeObject) : [];
}

