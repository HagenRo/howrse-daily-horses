// de
let equus_de = /.+ bringt Dir  (\d+) x  Equus\./; // hilfsregex
let skillsChinese_de = [/.+ hat (\d+) Fähigkeitspunkte gewonnen, die verteilt werden können/];
let maori_de = [/.+ hat (\d+) x Schildkrötenbabies entdeckt. Sein Tiki hat (\d+) x Mana erhalten./];
let egypt_de = [equus_de,/.+ bringt Dir  (\d+) Fähigkeitenpunkte./,/Anubis bringt Dir (\d+) x  Leder./]; // geht das so?
let groom_de = [/Du hast durch Striegeln von .+ (\d+) .+ gefunden./]; // 1. Punkt: Name; 2. Punkt: Mineralien, Federn oder, in com, Schuppen // hier müsste man auf Buchstaben oder Zahlen eingrenzen
let stellar_de = [/Du hast (\d+) x Sternstaub gefunden, indem Du den Stern der Odyssee im Weltraum enthüllst./];
let spice_de = [/Du hast (\d+) Gewürze für Deine Fortschrittsanzeige erhalten./]; // auch exemptions?
let jade_de = [/Du hast (\d+)  gewonnen!/];
let japanese_de = [equus_de,/.+ bringt Dir (\d+) x  Englische Satteldecke 2** ([a-zA-Z ]+)\./]; // da gibts nen haufen möglicher gegenstände, aber es ist auch ein Link im Chat. Können wir es daraus auslesen?

// english
let equus_en = /.+ brings you (\d+) x  Equus./;
let stellar_en = [/You found (\d+) x Stardusts by uncovering the Space Odyssey star./];
let spice_en = [/You have obtained (\d+) spices for your meter./];
let spice_uk_au = [/You have obtained (\d+) spices for your metre./];
let groom_en = [/You found (\d) .+ by grooming .+./]; // minerals or scales
let japanese_en = [equus_en,/.+ brings you (\d+) x  Ageing point/]; // can we replace ageing point by ".+"? 
let jade_en = [/You won (\d) !/]; // there's a passes icon in there, but should just be 1 space in text
// amber drops either droppings or passes - today it was droppings, passes will be tomorrow.
let amber_en = [/You won 10 !/,/Amber produced 2 pounds of droppings yesterday/,]; // uk and au would say "kg" instead of pounds; but this is another EXEMPTION
let skinfaxi_au = [/Skínfaxi gave +(\d+) rays of light/]; // if that's okay
let chinese_en = [/.+ won (\d+) skill points you can spend whichever way you like/]; // skill points watched on au

// exemptions from com english?

// nl
let stellar_nl = [/Je hebt (\d+) x Sterrenstof gevonden door de ster van de Tocht door de ruimte te onthullen./];
let spice_nl = [/Je hebt (\d+) specerijen voor je meter verkregen./];
let groom_nl = [/Je vond (\d+) stukken erts door .+ te verzorgen./]; // only metal horses if it stays like this
let japanese_nl = [/.+ brengt je (\d+) x  Verouderingspunt./,/.+ brengt je (\d+) x  Equus./];
let jade_nl = [/Je won (\d+) !/];
let maori_nl = [/.+ vond (\d+) x babyschildpad. Zijn of haar Tiki ontving (\d+) x mana./];
let egypt_nl = [/Anubis brengt je (\d+) x  Leder./];


// se
let stellar_se = [/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./];
let spice_se = [/Du har fått tag på (\d+) kryddor till din mätare./];
let japanese_se = [/.+ ger dig (\d+) x  Åldrandepoäng./,/.+ ger dig (\d+) x  Equus./]; // APs, Eq
let jade_se = [/Du vann (\d+) !/];
let maori_se = [/.+ hittade (\d+) x sköldpaddsunge. Deras tiki fick (\d+) x mana./];
let egypt_se = [/.+ ger dig  (\d+) färdighetspoäng./]; // fk


let shenma = new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese,true,"Bonus");

let horses =[
    new Horse(), 
    new Horse(),
    new Horse() //etc.
]


// Erstelle ein leeres Array, um die Werte zu speichern
var values = [];

// Wähle alle Elemente mit der Klasse 'grid-cell last' innerhalb von 'history-0'
$('#history-0 .grid-cell.last').each(function() {
    // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
    values.push($(this).text().trim());
});


