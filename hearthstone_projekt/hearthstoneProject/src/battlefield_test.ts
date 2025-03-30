import Kartya from "./kartya_test";

class Field{
    public active: boolean;
    public kartya: Kartya | null;
    public id: number;
    public playerside: number;
    public displayDiv: HTMLDivElement;

    constructor(id:number, player:number){
        this.active = false;
        this.playerside = player;
        this.id = id;
        this.kartya = null;
        this.displayDiv = document.createElement("div")
    }

    public CardPlace(card: Kartya | null):void{
        if(card != null){

            this.kartya = card;
            this.displayDiv.innerHTML= "";
            this.displayDiv.innerHTML= `<div class="cardInHand card">
                <div class="cardImage">
                    <img class="card-img" src="${this.kartya.kepURL}" alt="card_image">
                </div>
                <div class="cardStats">
                    <img src="/images/Health_value_back.webp" alt="hp">
                    <img src="/images/manaHatterNelkul.png" alt="mana">
                    <img src="/images/Attack_value_back.webp" alt="attack">
                </div>
                <div class="cardStats">
                    <h2 class="CS_HP card-hp">${this.kartya.hp}</h2>
                    <h2 class="CS_Mana card-mana">${this.kartya.mana}</h2>
                    <h2 class="CS_Attack card-attack">${this.kartya.sebzes}</h2>
                </div>
                <div class="cardName card-name">${this.kartya.nev}</div>
                <div class="cardNumber card-number">${this.kartya.kartyaSzam}</div>
            </div>`;
        }

    }
}




export default class Battlefield{
public fields: Field[];


constructor(){
    this.fields = [];
    for(let i = 1; i<3; i++){
        for(let j = 0; j < 7; j++){
            this.fields.push(new Field(j, i))
        }
    }
    this.FieldKiir()
    
    
}




FieldKiir():void{

    let p1row: HTMLDivElement | null = document.querySelector("#player1_row");
    let p2row: HTMLDivElement  | null = document.querySelector("#player2_row");
    p1row!.innerHTML = "";
    p2row!.innerHTML = "";

    this.fields.forEach(f=>{
    if(f.playerside==1){
        let div = f.displayDiv
        div.id = `p{1}_c{${f.id}}`
        p1row?.appendChild(div)
    }
    else{
        let div = f.displayDiv
        div.id = `p{2}_c{${f.id}}`
        p2row?.appendChild(div)
    }
    })
}





}