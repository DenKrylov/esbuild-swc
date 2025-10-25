export function render(root: HTMLElement | null): void {
  if (!root) return;
  root.innerHTML = `
    <section>
      <h1>Главная</h1>
      <p>Маршрут «Главная» был загружен динамически.</p>
    </section>
  `;
}
