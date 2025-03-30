export default class Kartya {
   public nev: string;
   public kepURL: string;
   public mana: number
   public sebzes: number
   public hp: number
   public kartyaSzam: number
   public rarity: string
   public cardDiv: HTMLDivElement


    constructor(nev: string, kepURL: string,mana: number,sebzes: number,hp: number,kartyaSzam: number, rarity: string){
            this.nev = nev;
            this.kepURL = kepURL;
            this.mana = mana;
            this.sebzes = sebzes;
            this.hp = hp;
            this.kartyaSzam = kartyaSzam;
            this.rarity = rarity
            this.cardDiv = document.createElement("div")
            this.cardDiv.innerHTML = `<div class="cardInHand card">
            <div class="cardImage">
                <img class="card-img" src="${this.kepURL}" alt="card_image">
            </div>
            <div class="cardStats">
                <img src="/images/Health_value_back.webp" alt="hp">
                <img src="/images/manaHatterNelkul.png" alt="mana">
                <img src="/images/Attack_value_back.webp" alt="attack">
            </div>
            <div class="cardStats">
                <h2 class="CS_HP card-hp">${this.hp}</h2>
                <h2 class="CS_Mana card-mana">${this.mana}</h2>
                <h2 class="CS_Attack card-attack">${this.sebzes}</h2>
            </div>
            <div class="cardName card-name">${this.nev}</div>
            <div class="cardNumber card-number">${this.kartyaSzam}</div>
        </div>`
        }

        public Divfrisit(): void{
            this.cardDiv.innerHTML = `<div class="cardInHand card">
            <div class="cardImage">
                <img class="card-img" src="${this.kepURL}" alt="card_image">
            </div>
            <div class="cardStats">
                <img src="/images/Health_value_back.webp" alt="hp">
                <img src="/images/manaHatterNelkul.png" alt="mana">
                <img src="/images/Attack_value_back.webp" alt="attack">
            </div>
            <div class="cardStats">
                <h2 class="CS_HP card-hp">${this.hp}</h2>
                <h2 class="CS_Mana card-mana">${this.mana}</h2>
                <h2 class="CS_Attack card-attack">${this.sebzes}</h2>
            </div>
            <div class="cardName card-name">${this.nev}</div>
            <div class="cardNumber card-number">${this.kartyaSzam}</div>
        </div>`
        }


}