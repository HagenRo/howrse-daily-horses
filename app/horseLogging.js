// de
let equus_de = /.+ bringt Dir  (\d+) x  Equus\./; // hilfsregex
let skillsChinese_de = [/.+ hat (\d+) Fähigkeitspunkte gewonnen, die verteilt werden können/];
let maori_de = [/.+ hat (\d+) x Schildkrötenbabies entdeckt. Sein Tiki hat (\d+) x Mana erhalten./];
let egypt_de = [equus_de,/.+ bringt Dir  (\d+) Fähigkeitenpunkte./,/Anubis bringt Dir (\d+) x  Leder./]; // geht das so?
let groom_de = [/Du hast durch Striegeln von .+ (\d+) .+ gefunden./]; // 1. Punkt: Name; 2. Punkt: Mineralien, Federn oder, in com, Schuppen // hier müsste man auf Buchstaben oder Zahlen eingrenzen
let stellar_de = [/Du hast (\d+) x Sternstaub gefunden, indem Du den Stern der Odyssee im Weltraum enthüllst./];
let spice_de = [/Du hast (\d+) Gewürze für Deine Fortschrittsanzeige erhalten./]; // auch exemptions?
let jade_de = [/Du hast (\d+)  gewonnen\!/];
let japanese_de = [equus_de,/.+ bringt Dir (\d+) x  Englische Satteldecke 2\*\* ([a-zA-Z ]+)\./]; // da gibts nen haufen möglicher gegenstände, aber es ist auch ein Link im Chat. Können wir es daraus auslesen?

// english
let equus_en = /.+ brings you (\d+) x  Equus./;
let stellar_en = [/You found (\d+) x Stardusts by uncovering the Space Odyssey star./];
let spice_en = [/You have obtained (\d+) spices for your meter./];
let spice_uk_au = [/You have obtained (\d+) spices for your metre./];
let groom_en = [/You found (\d) .+ by grooming .+./]; // minerals or scales
let japanese_en = [equus_en,/.+ brings you (\d+) x  Ageing point/]; // can we replace ageing point by ".+"? 
let jade_en = [/You won (\d) \!/]; // there's a passes icon in there, but should just be 1 space in text
// amber drops either droppings or passes - today it was droppings, passes will be tomorrow.
let amber_en = [/You won 10 !/,/Amber produced \d+ pounds of droppings yesterday/]; // uk and au would say "kg" instead of pounds; but this is another EXEMPTION
let skinfaxi_au = [/Skínfaxi gave +(\d+) rays of light/]; // if that's okay
let chinese_en = [/.+ won (\d+) skill points you can spend whichever way you like/]; // skill points watched on au
let egypt_en = [/.+ brings you (\d+) skill points./]

// exemptions from com english?

// nl
let stellar_nl = [/Je hebt (\d+) x Sterrenstof gevonden door de ster van de Tocht door de ruimte te onthullen./];
let spice_nl = [/Je hebt (\d+) specerijen voor je meter verkregen./];
let groom_nl = [/Je vond (\d+) stukken erts door .+ te verzorgen./]; // only metal horses if it stays like this
let japanese_nl = [/.+ brengt je (\d+) x  Verouderingspunt./,/.+ brengt je (\d+) x  Equus./];
let jade_nl = [/Je won (\d+) \!/];
let maori_nl = [/.+ vond (\d+) x babyschildpad. Zijn of haar Tiki ontving (\d+) x mana./];
let egypt_nl = [/Anubis brengt je (\d+) x  Leder./];


// se
let stellar_se = [/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./];
let spice_se = [/Du har fått tag på (\d+) kryddor till din mätare./];
let japanese_se = [/.+ ger dig (\d+) x  Åldrandepoäng./,/.+ ger dig (\d+) x  Equus./]; // APs, Eq
let jade_se = [/Du vann (\d+) \!/];
let maori_se = [/.+ hittade (\d+) x sköldpaddsunge. Deras tiki fick (\d+) x mana./];
let egypt_se = [/.+ ger dig  (\d+) färdighetspoäng./,/.+ ger dig (\d+) x Järn./]; // fk


let shenma = new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus");



let horses ={
    "https://www.howrse.de/elevage/chevaux/cheval?id=81394568": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus") 
    //, etc.
}


let currentHorse = $('horse-name a[href]')[0].href;

horses[currentHorse].check();




// Erstelle ein leeres Array, um die Werte zu speichern
let values = [];

// Wähle alle Elemente mit der Klasse 'grid-cell last' innerhalb von 'history-0'
$('#history-0 .grid-cell.last').each(function() {
    // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
    values.push($(this).text().trim());
});


let match = checkTimeLines();
// datenbankobjekt erstellen mit all dem zeug (notizen bei krita) und aus dem match die info, wie viel (und ggf. was) es geworfen hat (bzw. ob)
// aufruf von sendmessage (zum tatsächlichen speichern in der datenbank)
// tatsächliche implementierung der datenbankfunktion

// vieles wird wohl in Klasse Horse untergebracht sein
// einiges wird eine custom methode des exemption-horse-objekts sein

//speichern und lesen einer variablen auf der aktuellen hauptdomain als key value pair:
window.localStorage.setItem("key", "value");
item = window.localStorage.getItem("key");

//senden einer nachricht ans backend (z.B. zum speichern):
chrome.runtime.sendMessage({ function: "<funktionDieAufgerufenWerdenSoll>", param1: "variable", param2: "variable" }, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
    //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.
    console.log(response);
});

function checkTimeLines() {
    let ergebnis = [];
    values.forEach(timeLine => {
        skillsChinese_de.forEach(searchString => {
            ergebnis = timeLine.match(searchString)?timeLine.match(searchString):ergebnis; 
        });
    });
    return ergebnis;
}
//damit das dann auch was tut muss dann in der backround.js die nachricht entsprechend angenommen und die entsprechende Methode auch ausgeführt werden (siehe backround.js)

//cheetsheet für basic jquery zum auslesen von daten aus der webseite: https://www.jquerycheatsheet.com/






