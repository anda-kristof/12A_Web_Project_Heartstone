import Battlefield from "./battlefield_test.ts";
import Kartya from "./kartya_test.ts";

export default class Jatek{
    private jatekDiv: HTMLDivElement | null;
    private ujJatekGomb: HTMLButtonElement | null;
    private korVegeGomb: HTMLButtonElement | null;
    private kartyakLista: Kartya[];
    private handDiv : HTMLDivElement | null;
    private turnInfoDiv : HTMLDivElement | null;
    private p1ManaDiv : HTMLDivElement | null;
    private p2ManaDiv : HTMLDivElement | null;
    private p1RowDiv: HTMLDivElement | null;
    private p2RowDiv: HTMLDivElement | null;
    private p1BarDiv: HTMLDivElement | null;
    private akthand: HTMLDivElement | null;
    private enemyhand: HTMLDivElement | null;
    private p2BarDiv: HTMLDivElement | null;
    private gameEndTextDiv: HTMLDivElement | null;

    private aktJatekos: number;
    private round: number;
    private battlefield: Battlefield

    //kéz
    // const hand : HTMLDivElement | null = document.querySelector("#hand");

    //1. játékos
    private manaP1: number ;
    private aktManaP1: number ;
    private hpP1: number ;
    private kartyakP1: Kartya[] ;
    private pakliP1: Kartya[] ;

    //2.játékos
    private manaP2: number ;
    private aktManaP2: number;
    private hpP2: number ;
    private kartyakP2: Kartya[] ;
    private  pakliP2: Kartya[] ;
    public selectedhandcard: Kartya | null;

    constructor(maxhp: number, kartyak: Kartya[]){

        
        this.selectedhandcard = null;
        this.kartyakLista = kartyak; 
        
        this.battlefield = new Battlefield
        this.battlefield = new Battlefield();
this.battlefield.fields.forEach(f => {
    f.displayDiv.addEventListener("click", () => {
        if (this.selectedhandcard) {
            f.CardPlace(this.selectedhandcard);
            
            if (this.aktJatekos === 1) {
                this.aktManaP1 -= this.selectedhandcard.mana;
            } else {
                this.aktManaP2 -= this.selectedhandcard.mana;
            }
            this.selectedhandcard = null;
            this.Handfeltölt(); 
            this.playerBarUpdate();
        }
    });
});
        this.jatekDiv = document.querySelector("#gameDiv");

        this.ujJatekGomb = document.querySelector("#newGameBtn");
        this.ujJatekGomb?.addEventListener("click", this.UjJatek.bind(this));

        this.korVegeGomb = document.querySelector("#roundEndBtn");
        // this.korVegeGomb?.addEventListener("click", this.korVege.bind(this));

        this.handDiv = document.querySelector("#hand");
        this.turnInfoDiv = document.querySelector("#turnInfo");
        this.p1ManaDiv = document.querySelector("#p1_mana");
        this.p2ManaDiv = document.querySelector("#p2_mana");
        this.p1RowDiv = document.querySelector("#player1_row");
        this.p2RowDiv = document.querySelector("#player2_row");
        this.p1BarDiv = document.querySelector("#player1_bar");
        this.p2BarDiv = document.querySelector("#player2_bar");
        this.gameEndTextDiv = document.querySelector("#gameEndText");
        this.akthand = document.querySelector(".hand-you")
        this.enemyhand = document.querySelector(".hand-enemy")
        this.round = 0;
        this.aktJatekos = 1;

        //kéz
        // const hand : HTMLDivElement | null = document.querySelector("#hand");

        
        this.manaP1 = 0;
        this.aktManaP1 = 0;
        this.hpP1 = maxhp
        this.kartyakP1 = [] ;
        this.pakliP1 = [] ;
        this.PakliFeltolt(this.pakliP1, 60)

        
         this.manaP2 = 0;
        this.aktManaP2 = 0;
        this.hpP2 = 30;
        this.kartyakP2 = [] ;
        this.pakliP2 = [] ;
        this.PakliFeltolt(this.pakliP2, 60)
    }

    private PakliFeltolt(pakli: Kartya[], psz: number): void{
        //psz kártya egy pakliban
        while(pakli.length < psz){
            console.log(this.kartyakLista)
            let randind: number = Math.floor(Math.random()*(this.kartyakLista!.length))
            let hozzadaszsam: number = 0;
            if(this.kartyakLista[randind].rarity == "common"){
                hozzadaszsam = 6
            }
            else if(this.kartyakLista[randind].rarity == "rare"){
                hozzadaszsam = 3
            }
            else if(this.kartyakLista[randind].rarity == "epic"){
                hozzadaszsam = 2
            }
            else if(this.kartyakLista[randind].rarity == "legendary"){
                hozzadaszsam = 1
            }
            for(let i = 0; i<hozzadaszsam; i++){
                
                pakli.push(this.kartyakLista[randind]);
            }
        }
        //maradék kiszedése
        let maradék: number = pakli.length - psz
        for(let i = 0 ; i<maradék; i++){
            pakli.pop()
        }

        //random sort
        var sort: Kartya[] = pakli.sort(function(a,b){
            return 0.5 - Math.random();
        })

        pakli = sort;
    }

    private Kartyahuz(jatekos:number, times: number): void{
        let playerkartyak: Kartya[];
        let pakli: Kartya[];
        if(jatekos == 1){

           playerkartyak = this.kartyakP1
            pakli = this.pakliP1
        }
        else{
            playerkartyak = this.kartyakP2
            pakli = this.pakliP2
        }
       for(let i = 0; i<times; i++){
        if(pakli.length > 0){

            playerkartyak.push(pakli.shift()!)
        }
       }
    }

    private UjJatek(): void{
        this.gameEndTextDiv!.style.display = "none";
        this.ujJatekGomb!.style.display = "none";
        this.jatekDiv!.style.display = "inline";

        this.Kartyahuz(1, 3)
        this.Kartyahuz(2, 3)

        this.UjKor()

    }
    private UjKor(){
        this.round++;
        this.turnInfoDiv!.innerHTML = `${this.aktJatekos}. játékos jön!`;
        this.Kartyahuz(this.aktJatekos, 1)
        this.Handfeltölt()
        this.ManaLevel()

       this.setupCardSelection()
        
        
        
    }

    private setupCardSelection(): void {
        const handCards = this.aktJatekos === 1 ? this.kartyakP1 : this.kartyakP2;
        
        handCards.forEach(k => {
            
            k.cardDiv.replaceWith(k.cardDiv.cloneNode(true));
            const newCardDiv = k.cardDiv.cloneNode(true) as HTMLDivElement;
            
            newCardDiv.addEventListener("click", () => {
                
                if (this.selectedhandcard) {
                    this.selectedhandcard.cardDiv.style.boxShadow = "none";
                }
                
                
                const enoughMana = this.aktJatekos === 1 
                    ? this.aktManaP1 >= k.mana 
                    : this.aktManaP2 >= k.mana;
                
                if (enoughMana) {
                    this.selectedhandcard = k;
                    k.cardDiv.style.boxShadow = "0 0 10px 5px gold";
                } else {
                    alert("Nincs elég manád!");
                }
            });
            
            k.cardDiv = newCardDiv;
        });
    }

    private JatekosJatekosHand():void{
        let akthandText: HTMLElement = document.createElement("h2");
        let enemyhandText: HTMLElement = document.createElement("h2");
    akthandText!.style.backgroundColor = "dodgerblue";
    enemyhandText!.style.backgroundColor = "red";

    akthandText!.innerHTML = `${this.aktJatekos}. Játékos kártyái`
    enemyhandText!.innerHTML = `${(3 - this.aktJatekos)}. Játékos kártyái`

    
    this.akthand?.appendChild(akthandText);
    this.enemyhand?.appendChild(enemyhandText);
    }

    private Handfeltölt(): void {



       
        // todo : kártya megfordítás
        this.akthand!.innerHTML = "";
        this.enemyhand!.innerHTML = "";
        if(this.aktJatekos == 1){
            
            this.JatekosJatekosHand()

            this.kartyakP1.forEach(k => {
                this.akthand!.innerHTML += k.cardDiv;
            })
            this.kartyakP2.forEach(k => {
                this.enemyhand!.innerHTML += k.cardDiv;
            })
        }
        else{
            this.JatekosJatekosHand()

            this.kartyakP2.forEach(k => {
                this.akthand!.innerHTML += k.cardDiv;
            })
            this.kartyakP1.forEach(k => {
                this.enemyhand!.innerHTML += k.cardDiv;
            })
        }
    }
    private playerBarUpdate():void{
        //1. játékos
        this.p1BarDiv!.innerHTML = `
            <h2 id="p1_mana">Mana: ${this.aktManaP1}</h2>
            <h2 id="player1_face"><b>1. Játékos</b></h2>
            <h2>HP: ${this.hpP1}</h2>
        `

        this.p2BarDiv!.innerHTML = `
        <h2 id="p2_mana">Mana: ${this.aktManaP2}</h2>
        <h2 id="player2_face"><b>2. Játékos</b></h2>
        <h2>HP: ${this.hpP2}</h2>
    `
    }

    private ManaLevel(): void{
    if(this.aktJatekos == 1) {
        
        if(this.manaP1 < 10) this.manaP1++;
        this.p1ManaDiv!.innerHTML = `Mana: ${this.manaP1}`;
        this.aktManaP1 = this.manaP1;
        this.playerBarUpdate();
    }
    else {
        
        if(this.manaP2 < 10) this.manaP2++;
        this.p2ManaDiv!.innerHTML = `Mana: ${this.manaP2}`;
        this.aktManaP2 = this.manaP2;
        this.playerBarUpdate();
    }
}
    

    }