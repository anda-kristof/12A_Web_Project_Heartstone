import Jatek from "./jatek_test.ts";
import Kartya from "./kartya_test.ts";

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

function loadData(): Promise<string> {
  return new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.open("GET", "kartyak.json");

      xhr.onload = (): void => {
          if (xhr.status === 200) {
              resolve(xhr.responseText);
          } else {
              reject(`Hiba: ${xhr.statusText} - ${xhr.status}`);
          }
      };

      xhr.onerror = (): void => {
          reject("Hálózati hiba!");
      };

      xhr.send();
  });
}
function kartyakFeltolt(kartyak: any[]): Kartya[] {
        let vissza: Kartya[] = [];
        let seged1: number = 0;
        
        kartyak.forEach(k => {
            const ujKartya: Kartya = new Kartya(
                k.nev,
                k.kepURL,
                k.mana,
                k.sebzes,
                 k.hp,
                 seged1, 
                k.rarity)
            

            seged1++;

            vissza.push(ujKartya);
        });

        return vissza;
    }
    let kartyakLista: any[];
loadData()
        .then((data: string) => {
            kartyakLista = JSON.parse(data).kartyak;
        })
        .catch((error: unknown) => {
            console.log(String(error));
        });

let jatek = new Jatek(30, kartyakFeltolt(kartyakLista))