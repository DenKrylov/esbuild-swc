import { formatUserName, sum } from './utils';
import { loadRoute, RouteKey } from './routes';

const root = document.getElementById('app');

const userName = formatUserName({
  first: 'Имя',
  last: 'Фамилия',
});

const numbers = [1, 2, 3, 4];
const total = sum(numbers);

if (root) {
  root.innerHTML = `
    <main>
      <h1>Добро пожаловать, ${userName}</h1>
      <p>Всего: ${total}</p>
      <nav>
        <button data-route="home">Главная</button>
        <button data-route="about">О проекте</button>
      </nav>
      <section id="route-view"></section>
    </main>
  `;
}

const routeView = document.getElementById('route-view');

async function renderRoute(route: RouteKey) {
  const module = await loadRoute(route);
  module.render?.(routeView);
}

function bootstrapRouting() {
  const buttons = root?.querySelectorAll<HTMLButtonElement>('button[data-route]');
  buttons?.forEach((button) => {
    button.addEventListener('click', () => {
      const route = (button.dataset.route ?? 'home') as RouteKey;
      renderRoute(route).catch((error) => {
        console.error('Не удалось отобразить маршрут', route, error);
      });
    });
  });

  const routeFromHash = (window.location.hash.replace('#', '') ||
    'home') as RouteKey;

  renderRoute(routeFromHash).catch((error) => {
    console.error('Не удалось инициализировать маршрутизацию', error);
  });
}

bootstrapRouting();
