import Jatek from "./jatek.ts";

const rootDiv = document.querySelector<HTMLDivElement>("#root");

const navBarItems = document.querySelectorAll<HTMLAnchorElement>('a[data-href]');

const PAGES = '/pages/';

interface Route {
  page: string;
  code: any;
}

const routes: Record<string, Route> = {
  '/':          { page: 'jatek.html', code: Jatek },
  '/rolunk':    { page: 'about.html', code: null },
}

const loadPage = async (page: string): Promise<string> => {
  const response = await fetch(PAGES + page);
  const resHtml = await response.text();
  return resHtml;
}

const dynamicClass = (code: any) => {
  if (code != null) {
    const dynamicClass = eval(code);
    new dynamicClass();
  }
}

const onNavClick = async (event: MouseEvent) => {
  event.preventDefault();
  const target = event.target as HTMLAnchorElement;
  const pathName = target.dataset.href!;
  window.history.pushState({}, '', pathName);
  const data = await loadPage(routes[pathName].page);
  if (rootDiv) {
    rootDiv.innerHTML = data;
  }
  dynamicClass(routes[pathName].code);
}

window.addEventListener('load', async () => {
  const pathName = window.location.pathname;
  const data = await loadPage(routes[pathName].page);
  if (rootDiv) {
    rootDiv.innerHTML = data;
  }
  dynamicClass(routes[pathName].code);
});

window.addEventListener('popstate', async () => {
  const pathName = window.location.pathname;
  const data = await loadPage(routes[pathName].page);
  if (rootDiv) {
    rootDiv.innerHTML = data;
  }
  dynamicClass(routes[pathName].code);
});

navBarItems.forEach(navItem => {
  navItem.addEventListener('click', onNavClick);
});