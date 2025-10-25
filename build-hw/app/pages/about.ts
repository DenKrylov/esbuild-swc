export function render(root: HTMLElement | null): void {
  if (!root) return;
  root.innerHTML = `
    <section>
      <h1>О проекте</h1>
      <p>Эта страница «О проекте» вынесена в отдельный чанк.</p>
    </section>
  `;
}
