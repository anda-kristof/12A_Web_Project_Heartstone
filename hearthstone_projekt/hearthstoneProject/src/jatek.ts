//------todo list-------
//github repo

//kártyák a json fáljba
//pakli-randomizálás
//húzás (konkrét kártya)
//kezdőhand (konkrét kártyák)
//special ability-k

//coin
//esetleg spellek
//redesing (+rarity)
//------------------------

//egyéb
let aktJatekos: number = 1;

//kéz
// const hand : HTMLDivElement | null = document.querySelector("#hand");

//1. játékos
let manaP1: number = 0;
let aktManaP1: number = 0;
let hpP1: number = 30;
let kartyakP1: number[];
let pakliSorrendP1: number[];
let huzasIndexP1: number = 3;

//2.játékos
let manaP2: number = 0;
let aktManaP2: number = 0;
let hpP2: number = 30;
let kartyakP2: number[];
let pakliSorrendP2: number[];
let huzasIndexP2: number = 3;

//kártyák
interface Kartya {
    nev: string;
    kepURL: string;
    mana: number;
    sebzes: number;
    hp: number;
    kartyaSzam: number;
    rarity: string;
}


export default class Jatek{
    private jatekDiv: HTMLDivElement | null;
    private ujJatekGomb: HTMLButtonElement | null;
    private korVegeGomb: HTMLButtonElement | null;
    private kartyakLista: Kartya[] | null = [];
    private hand : HTMLDivElement | null;
    private turnInfo : HTMLDivElement | null;
    private p1Mana : HTMLDivElement | null;
    private p2Mana : HTMLDivElement | null;
    private p1Row: HTMLDivElement | null;
    private p2Row: HTMLDivElement | null;
    private p1Bar: HTMLDivElement | null;
    private p2Bar: HTMLDivElement | null;
    private gameEndText: HTMLDivElement | null;
    private palya: HTMLDivElement | null;

    constructor(){
        this.jatekDiv = document.querySelector("#gameDiv");

        this.ujJatekGomb = document.querySelector("#newGameBtn");
        this.ujJatekGomb?.addEventListener("click", this.ujJatek.bind(this));

        this.korVegeGomb = document.querySelector("#roundEndBtn");
        this.korVegeGomb?.addEventListener("click", this.korVege.bind(this));

        this.loadData()
        .then((data: string) => {
            this.kartyakLista = this.kartyakFeltolt(JSON.parse(data).kartyak);
        })
        .catch((error: unknown) => {
            console.log(String(error));
        });

        this.hand = document.querySelector("#hand");
        this.turnInfo = document.querySelector("#turnInfo");
        this.p1Mana = document.querySelector("#p1_mana");
        this.p2Mana = document.querySelector("#p2_mana");
        this.p1Row = document.querySelector("#player1_row");
        this.p2Row = document.querySelector("#player2_row");
        this.p1Bar = document.querySelector("#player1_bar");
        this.p2Bar = document.querySelector("#player2_bar");
        this.gameEndText = document.querySelector("#gameEndText");
        this.palya = document.querySelector("#palya");
    }

    private loadData(): Promise<string> {
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

    private pakliSorsol(): number[]{
        //12 -> 1 lega, 2-3 epic, 4-5-6 rare, 7-8-9-10-11-12 common esélyek
        //15 kártya
        //json fájlban -> 1-2-3lega, 4-5-6epic, 7-8-9-10rare, 11-12-13-14-15common
        let vissza: number[] = [];
        for(let i = 0; i < 60; i++){
            let raritySorsol = Math.floor(Math.random()*11) + 1;
            let kartyaIndex = 0;

            //lega
            if(raritySorsol == 1){
                kartyaIndex = Math.floor(Math.random()*2) + 1;
            }
            //epic
            if(raritySorsol > 1 && raritySorsol < 4) kartyaIndex = Math.floor(Math.random()*2) + 4;
            //rare
            if(raritySorsol > 3 && raritySorsol < 7) kartyaIndex = Math.floor(Math.random()*3) + 7;
            //common
            if(raritySorsol > 6) kartyaIndex = Math.floor(Math.random()*4) + 11;

            vissza.push(kartyaIndex-1);
        }
        return vissza;
    }

    private kartyakFeltolt(kartyak: any[]): Kartya[] {
        let vissza: Kartya[] = [];
        let seged1: number = 0;
        
        kartyak.forEach(k => {
            const ujKartya: Kartya = {
                nev: k.nev,
                kepURL: k.kepURL,
                mana:k.mana,
                sebzes: k.sebzes,
                hp: k.hp,
                kartyaSzam: seged1,
                rarity: k.rarity
            };

            seged1++;

            vissza.push(ujKartya);
        });

        return vissza;
    }

    private ujJatek(): void {
        this.gameEndText!.style.display = "none";
        this.ujJatekGomb!.style.display = "none";
        this.jatekDiv!.style.display = "inline";

        //kártyák kisorsolása
        pakliSorrendP1 = this.pakliSorsol();
        pakliSorrendP2 = this.pakliSorsol();

        //kártyák kiosztása (todo: ki kell sorsolni)
        kartyakP1 = [pakliSorrendP1[0],pakliSorrendP1[1],pakliSorrendP1[2]];
        kartyakP2 = [pakliSorrendP1[0],pakliSorrendP1[1],pakliSorrendP1[2]];


        //checkforActive
        //checkforCards

        this.ujKor();
    }

    private ujKor(): void{
        this.turnInfo!.innerHTML = `${aktJatekos}. játékos jön!`;

        this.kartyaHuz();

        if(aktJatekos == 1) {
            this.kartyaOszt(kartyakP1);
            if(manaP1 < 10) manaP1++;
            this.p1Mana!.innerHTML = `Mana: ${manaP1}`;
            aktManaP1 = manaP1;
            this.playerBarUpdate();
        }
        else {
            this.kartyaOszt(kartyakP2);
            if(manaP2 < 10) manaP2++;
            this.p2Mana!.innerHTML = `Mana: ${manaP2}`;
            aktManaP2 = manaP2;
            this.playerBarUpdate();
        }

        this.checkForCard();
        this.checkForActive();
    }

    private checkForActive(): void{
        for (let i = 1; i < 8; i++) {
            let aktKartya: HTMLElement = document.querySelector(`#p${aktJatekos}_c${i}`) as HTMLElement;

            if(aktKartya.className == "active"){
                aktKartya.style.boxShadow = "0 0 15px 5px lightgreen";

                const aktKep: HTMLImageElement = document.querySelector(`#p${aktJatekos}_c${i} .cardImage`) as HTMLImageElement;
                //át kell dolgozni
                const aktKartyaAdatok: Kartya = {
                    nev: document.querySelector(`#p${aktJatekos}_c${i} .cardName`)!.innerHTML,
                    kepURL: aktKep.src,
                    mana: Number(document.querySelector(`#p${aktJatekos}_c${i} .CS_Mana`)!.innerHTML),
                    sebzes: Number(document.querySelector(`#p${aktJatekos}_c${i} .CS_Attack`)!.innerHTML),
                    hp: Number(document.querySelector(`#p${aktJatekos}_c${i} .CS_HP`)!.innerHTML),
                    kartyaSzam: Number(document.querySelector(`#p${aktJatekos}_c${i} .cardNumber`)!.innerHTML),
                    rarity: document.querySelector(`#p${aktJatekos}_c${i} .cardRarity`)!.innerHTML
                };

                aktKartya.addEventListener("click", () => this.kartyaTamadas(aktKartyaAdatok, i));
            }
        }
    }

    private checkForCard(): void{
        for (let i = 1; i < 8; i++) {
            let aktKartya: HTMLElement = document.querySelector(`#p${aktJatekos}_c${i}`) as HTMLElement;

            if(aktKartya.innerHTML != ""){
                aktKartya.className = "active";
            }
        }
    }

    private kartyaTamadas(aktKartya: Kartya, kartyaIndex: number){
        this.noBoxShadow();

        let ellenfel = 1;
        if(aktJatekos == 1) ellenfel = 2;
        //targeting
        const ellenfelFace = document.querySelector(`#player${ellenfel}_face`) as HTMLElement;
        const aktKartyaElement = document.querySelector(`#p${aktJatekos}_c${kartyaIndex}`) as HTMLElement;

        //minion támadás
        for (let i = 1; i < 8; i++) {
            const aktKartyaHely = document.querySelector(`#p${ellenfel}_c${i}`) as HTMLElement;
            if(aktKartyaHely!.innerHTML != ""){
                aktKartyaHely.style.boxShadow = "0 0 15px 5px yellow";
                //át kell dolgozni
                const ellenfelKartyaAdatok: Kartya = {
                    nev: "",
                    kepURL: "",
                    mana: 0,
                    sebzes: Number(document.querySelector(`#p${ellenfel}_c${i} .CS_Attack`)!.innerHTML),
                    hp: Number(document.querySelector(`#p${ellenfel}_c${i} .CS_HP`)!.innerHTML),
                    kartyaSzam: Number(document.querySelector(`#p${ellenfel}_c${i} .cardNumber`)!.innerHTML),
                    rarity: document.querySelector(`#p${ellenfel}_c${i} .cardRarity`)!.innerHTML
                };
                aktKartyaHely.addEventListener("click", () => this.tamadasMinion(aktKartya, ellenfelKartyaAdatok, kartyaIndex, i));
            }
        }
        //face támadás
        ellenfelFace.style.boxShadow = "0 0 15px 5px yellow";
        ellenfelFace.addEventListener("click", () => this.tamadasFace(aktKartya.sebzes, kartyaIndex))

        aktKartyaElement.style.boxShadow = "0 0 15px 5px yellow";
    }

    private tamadasFace(sebzes: number, kartyaIndex: number):void{
        const aktKartyaElement = document.querySelector(`#p${aktJatekos}_c${kartyaIndex}`) as HTMLElement;

        if(aktJatekos == 1) hpP2 -= sebzes;
        else hpP1 -= sebzes;

        aktKartyaElement.className = "";

        this.noBoxShadow();

        //jatek vege check
        if(hpP1 <= 0){
            this.ujJatekGomb!.style.display = "inline";
            this.jatekDiv!.style.display = "none";
            this.gameEndText!.innerHTML = `${aktJatekos}. Játékos nyert!`;
            this.gameEndText!.style.display = "inline";
        }
        if(hpP2 <= 0){
            this.ujJatekGomb!.style.display = "inline";
            this.jatekDiv!.style.display = "none";
            this.gameEndText!.innerHTML = `${aktJatekos}. Játékos nyert!`;
            this.gameEndText!.style.display = "inline";
        }
    }

    private tamadasMinion(tamadoKartya: Kartya, targetKartya: Kartya, kartyaIndex: number, ellenfelINdex: number):void{
        let ellenfel = 1;
        if(aktJatekos == 1) ellenfel = 2;
        const aktKartyaElement = document.querySelector(`#p${aktJatekos}_c${kartyaIndex}`) as HTMLElement;
        const targetKartyaElement = document.querySelector(`#p${ellenfel}_c${ellenfelINdex}`) as HTMLElement;

        document.querySelector(`#p${ellenfel}_c${ellenfelINdex} .CS_HP`)!.innerHTML = String(Number(document.querySelector(`#p${ellenfel}_c${ellenfelINdex} .CS_HP`)!.innerHTML) - tamadoKartya.sebzes);
        document.querySelector(`#p${aktJatekos}_c${kartyaIndex} .CS_HP`)!.innerHTML = String(Number(document.querySelector(`#p${aktJatekos}_c${kartyaIndex} .CS_HP`)!.innerHTML) - targetKartya.sebzes);
        if(Number(document.querySelector(`#p${ellenfel}_c${ellenfelINdex} .CS_HP`)!.innerHTML) <= 0) {
            targetKartyaElement.innerHTML = "";
            targetKartyaElement.className = "";
        }
        if(Number(document.querySelector(`#p${aktJatekos}_c${kartyaIndex} .CS_HP`)!.innerHTML) <= 0) {
            aktKartyaElement.innerHTML = "";
            aktKartyaElement.className = "";
        }

        aktKartyaElement.className = "";

        this.noBoxShadow();
    }

    private kartyaHuz(): void{
        //todo sorsolás
        if(aktJatekos == 1){
            if(kartyakP1.length < 7){
                kartyakP1.push(pakliSorrendP1[huzasIndexP1]);
            }
            huzasIndexP1++;
        }
        else{
            if(kartyakP2.length < 7){
                kartyakP2.push(pakliSorrendP1[huzasIndexP2]);
            } 
            huzasIndexP2++;
        }
    }

    private kartyaOszt(aktKartyak: number[]){
        let handText: HTMLElement = document.createElement("h2");
        if(aktJatekos == 1) handText!.style.backgroundColor = "dodgerblue";
        else handText!.style.backgroundColor = "red";

        handText!.innerHTML = `${aktJatekos}. Játékos kártyái`

        this.hand!.innerHTML = "";
        this.hand?.appendChild(handText);

        let seged: number = 0;

        aktKartyak.forEach(k => {
            let szin = "";
            let aktRarity = this.kartyakLista![k].rarity;
            if(aktRarity == "legendary") szin = "orange";
            else if(aktRarity == "epic") szin = "darkorchid";
            else if(aktRarity == "rare") szin = "blue";
            else if(aktRarity == "common") szin = "white";
            this.hand!.innerHTML += `
                    <div class="cardInHand card${seged}">
                        <div class="cardImage">
                            <img class="card${seged}-img" src="${this.kartyakLista![k].kepURL}" alt="card_image">
                        </div>
                        <div class="cardStats">
                            <img src="/images/Health_value_back.webp" alt="hp">
                            <img src="/images/manaHatterNelkul.png" alt="mana">
                            <img src="/images/Attack_value_back.webp" alt="attack">
                        </div>
                        <div class="cardStats">
                            <h2 class="CS_HP card${seged}-hp">${this.kartyakLista![k].hp}</h2>
                            <h2 class="CS_Mana card${seged}-mana">${this.kartyakLista![k].mana}</h2>
                            <h2 class="CS_Attack card${seged}-attack">${this.kartyakLista![k].sebzes}</h2>
                        </div>
                        <div class="cardName card${seged}-name">${this.kartyakLista![k].nev}</div>
                        <div class="cardNumber card${seged}-number">${k}</div>
                        <div class="cardRarity card${seged}-rarity" style="color:${szin};">${aktRarity}</div>
                    </div>
            `;
            seged++;
        })

        document.querySelectorAll(".cardInHand").forEach(ke => {
            ke.addEventListener("click", () => this.kartyaLerakas(ke.classList[1]));
        })
    }

    private kartyaLerakas(kIndex: string): void{
        const aktKartya = document.querySelector(`.${kIndex}`) as HTMLElement;
        const aktKep: HTMLImageElement = document.querySelector(`.${kIndex}-img`) as HTMLImageElement;
        //át kell dolgozni
        const aktKartyaAdatok: Kartya = {
            nev: document.querySelector(`.${kIndex}-name`)!.innerHTML,
            kepURL: aktKep.src,
            mana: Number(document.querySelector(`.${kIndex}-mana`)!.innerHTML),
            sebzes: Number(document.querySelector(`.${kIndex}-attack`)!.innerHTML),
            hp: Number(document.querySelector(`.${kIndex}-hp`)!.innerHTML),
            kartyaSzam: Number(document.querySelector(`.${kIndex}-number`)!.innerHTML),
            rarity: document.querySelector(`.${kIndex}-rarity`)!.innerHTML
        };

        //megnézi hogy van-e elég mana
        if((aktJatekos == 1 && aktManaP1 >= aktKartyaAdatok.mana) || (aktJatekos == 2 && aktManaP2 >= aktKartyaAdatok.mana)){
            //boxshadow-ok és eseménykezelők eltűntetése
            this.noBoxShadow();


            //boxshadowok és eseménykezelők létrehozása
            aktKartya.style.boxShadow = "0 0 15px 5px yellow";
            for (let i = 1; i < 8; i++) {
                const aktKartyaHely = document.querySelector(`#p${aktJatekos}_c${i}`) as HTMLElement;
                if(aktKartyaHely!.innerHTML == ""){
                    aktKartyaHely.style.boxShadow = "0 0 15px 5px yellow";
                    aktKartyaHely.addEventListener("click", () => this.kartyaLerakasSeged(aktKartyaAdatok, `#p${aktJatekos}_c${i}`, kIndex))
                }
            }
        }
        else alert("Nincs elég manád ehhez a kártyához!");
    }

    //jobban is meglehetett volna csinálni
    private kartyaLerakasSeged(aktKartyaAdatok: Kartya, aktKartyaID: string, kIndex: string):void{
        const aktKartyaHely = document.querySelector(aktKartyaID) as HTMLElement;
        let szin = "";
        let aktRarity = aktKartyaAdatok.rarity;
        if(aktRarity == "legendary") szin = "orange";
        if(aktRarity == "epic") szin = "darkorchid";
        if(aktRarity == "rare") szin = "blue";
        if(aktRarity == "common") szin = "white";
        aktKartyaHely.innerHTML = `
        <div class="cardImage">
            <img src="${aktKartyaAdatok.kepURL}" alt="card_image">
        </div>
        <div class="cardStats">
            <img src="/images/Health_value_back.webp" alt="hp">
            <img src="/images/manaHatterNelkul.png" alt="mana">
            <img src="/images/Attack_value_back.webp" alt="attack">
        </div>
        <div class="cardStats">
            <h2 class="CS_HP">${aktKartyaAdatok.hp}</h2>
            <h2 class="CS_Mana">${aktKartyaAdatok.mana}</h2>
            <h2 class="CS_Attack">${aktKartyaAdatok.sebzes}</h2>
        </div>
        <div class="cardName">${aktKartyaAdatok.nev}</div>
        <div class="cardNumber">${aktKartyaAdatok.kartyaSzam}</div>
        <div class="cardRarity" style="color:${szin};">${aktKartyaAdatok.rarity}</div>
        `;
        aktKartyaHely.style.backgroundColor = "chocolate";

        //mana levonása
        if(aktJatekos == 1){
            aktManaP1 -= aktKartyaAdatok.mana;
            // this.p1Mana!.innerHTML = `Mana: ${aktManaP1}`;
        }
        else{
            aktManaP2 -= aktKartyaAdatok.mana;
            // this.p2Mana!.innerHTML = `Mana: ${aktManaP2}`;
        }

        //kártya kivétele kézből
        let kiveszSeged = true;
        document.querySelectorAll(".cardInHand").forEach(e => {
            if(kiveszSeged && e.innerHTML.includes(`<div class="cardNumber ${kIndex}-number">${aktKartyaAdatok.kartyaSzam}</div>`)){
                this.hand!.removeChild(e);
                kiveszSeged = false;
            }
        });

        if(aktJatekos == 1){
            kiveszSeged = true;
            let indexSeged = 0;
            kartyakP1.forEach(e => {
                if(kiveszSeged && e == aktKartyaAdatok.kartyaSzam){
                    kartyakP1.splice(indexSeged, 1);
                    kiveszSeged = false;
                }
                indexSeged++;
            });
        }
        else{
            kiveszSeged = true;
            let indexSeged = 0;
            kartyakP2.forEach(e => {
                if(kiveszSeged && e == aktKartyaAdatok.kartyaSzam){
                    kartyakP2.splice(indexSeged, 1);
                    kiveszSeged = false;
                }
                indexSeged++;
            });
        }

        this.noBoxShadow();
    }

    //reseteli az eventlistenereket is
    private noBoxShadow(): void{
        let ellenfel = 1;
        if(aktJatekos == 1) ellenfel = 2;

        //boxshadow-ok eltűntetése
        document.querySelectorAll(".cardInHand").forEach(ke => {
            if (ke instanceof HTMLElement) ke.style.boxShadow = "none";
        });

        //saját térfél
        for (let i = 1; i < 8; i++) {
            const aktKartyaHely = document.querySelector(`#p${aktJatekos}_c${i}`) as HTMLElement;
            let adatMentes: string = "";
            let classMentes: string = "";
            if(aktKartyaHely.innerHTML != "") adatMentes = aktKartyaHely.innerHTML;
            if(aktKartyaHely.className != "") classMentes = aktKartyaHely.className;
            let aktSor = document.querySelector(`#player${aktJatekos}_row`) as HTMLElement;
            aktSor.removeChild(aktKartyaHely);

            let ujAktKartya = document.createElement("div");
            ujAktKartya.id = `p${aktJatekos}_c${i}`;
            ujAktKartya.innerHTML = adatMentes;
            ujAktKartya.className = classMentes;
            if(adatMentes != "") ujAktKartya.style.backgroundColor = "chocolate";

            aktSor.appendChild(ujAktKartya);
            // aktKartyaHely.style.boxShadow = "none";
        }
        //ellenfél
        for (let i = 1; i < 8; i++) {
            const aktKartyaHely = document.querySelector(`#p${ellenfel}_c${i}`) as HTMLElement;
            let adatMentes: string = "";
            let classMentes: string = "";
            if(aktKartyaHely.innerHTML != "") adatMentes = aktKartyaHely.innerHTML;
            if(aktKartyaHely.className != "") classMentes = aktKartyaHely.className;
            let aktSor = document.querySelector(`#player${ellenfel}_row`) as HTMLElement;
            aktSor.removeChild(aktKartyaHely);

            let ujAktKartya = document.createElement("div");
            ujAktKartya.id = `p${ellenfel}_c${i}`;
            ujAktKartya.innerHTML = adatMentes;
            ujAktKartya.className = classMentes;
            if(adatMentes != "") ujAktKartya.style.backgroundColor = "chocolate";

            aktSor.appendChild(ujAktKartya);
            // aktKartyaHely.style.boxShadow = "none";
        }

        //saját active check
        this.checkForActive();

        this.playerBarUpdate();
    }

    private playerBarUpdate():void{
        //1. játékos
        this.p1Bar!.innerHTML = `
            <h2 id="p1_mana">Mana: ${aktManaP1}</h2>
            <h2 id="player1_face"><b>1. Játékos</b></h2>
            <h2>HP: ${hpP1}</h2>
        `

        this.p2Bar!.innerHTML = `
        <h2 id="p2_mana">Mana: ${aktManaP2}</h2>
        <h2 id="player2_face"><b>2. Játékos</b></h2>
        <h2>HP: ${hpP2}</h2>
    `
    }

    private korVege(): void{

        //játékos váltás
        if(aktJatekos == 1) aktJatekos = 2;
        else aktJatekos = 1;

        //térfél fordítás
        // const adatMentes1 = this.p1Row?.innerHTML;
        // const adatMentes2 = this.p2Row?.innerHTML;
        // if(aktJatekos == 1){
        //     this.palya!.innerHTML = `<div id="player2_row">${adatMentes2}</div><div class="separator_border"></div> <div id="player1_row">${adatMentes1}</div>`;
        // }
        // else{
        //     this.palya!.innerHTML = `<div id="player1_row">${adatMentes1}</div><div class="separator_border"></div> <div id="player2_row">${adatMentes2}</div>`;
        // }
        this.noBoxShadow();

        this.ujKor();
    }
}