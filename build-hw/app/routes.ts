type RouteModule = typeof import('./pages/home');

export const routes = {
  home: () => import('./pages/home'),
  about: () => import('./pages/about'),
};

export type RouteKey = keyof typeof routes;

export async function loadRoute(
  route: RouteKey,
): Promise<RouteModule> {
  const loader = routes[route] ?? routes.home;
  return loader();
}
