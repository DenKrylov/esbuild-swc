export type FullName = {
  first: string;
  last: string;
};

export function formatUserName({ first, last }: FullName): string {
  return `${first} ${last}`.trim();
}

export function formatInitials({ first, last }: FullName): string {
  return `${first[0]?.toUpperCase() ?? ''}${last[0]?.toUpperCase() ?? ''}`;
}

export function makeDebugLabel(name: string): string {
  const timestamp = new Date().toISOString();
  return `${name}@${timestamp}`;
}

export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}
