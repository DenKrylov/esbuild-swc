export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function average(values: number[]): number {
  if (values.length === 0) {
    throw new Error('Невозможно вычислить среднее значение пустого массива');
  }

  const total = values.reduce((acc, value) => acc + value, 0);
  return total / values.length;
}
