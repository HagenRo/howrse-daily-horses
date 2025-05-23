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
let fairytale_de = [/.+ hat eine Geschichte gelesen./]; // handlungselemente entdeckt?

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
let egypt_en = [/.+ brings you (\d+) skill points./];
let fairytale_en = [/.+ has read a story./]; // TODO ergänzen wenn er 1-2 handlungselemente findet
let celtic_en = [/.+ used their powers of divination and found (\d+) new letter from the prediction/]; // TODO ergänzen wenn er 0 oder 2 findet

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


let resetsWinter = {
    'www.howrse.de': 5,
    'www.howrse.com': 8,
    'www.howrse.co.uk': 5,
    'nl.howrse.com': 4,
    'www.howrse.se': 4,
    'au.howrse.com': 19
}


let resetsSommer = {
    'www.howrse.de': 5,
    'www.howrse.com': 9,
    'www.howrse.co.uk': 6,
    'nl.howrse.com': 4,
    'www.howrse.se': 4,
    'au.howrse.com': 20,
    'co.www.howrse.de': 5
}


let shenma = new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus");



let horses ={
    "https://www.howrse.de/elevage/chevaux/cheval?id=81394568": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus"),
    "https://www.howrse.de/elevage/chevaux/cheval?id=101194996": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101194996",groom_de,false), // Gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=101164900": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101164900",groom_de,false), // rose gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100844463": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100844463",jade_de,true,0), // jade de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100800447": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100800447",japanese_de,false), // maneki-neko de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100358235": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100358235",egypt_de,false), // osiris de  // TODO
    "https://www.howrse.de/elevage/chevaux/cheval?id=100050626": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100050626",stellar_de,false), // gelber zwerg de
    "https://www.howrse.de/elevage/chevaux/cheval?id=99509978": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99509978","",false), // Däumling de - wie?
    "https://www.howrse.de/elevage/chevaux/cheval?id=99284359": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99284359",spice_de,false), // nelke
    "https://www.howrse.de/elevage/chevaux/cheval?id=98938751": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=98938751",japanese_de,false), // kigu de
    "https://www.howrse.de/elevage/chevaux/cheval?id=97064563": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=97064563",egypt_de,false), // nubinubi de
    "https://www.howrse.de/elevage/chevaux/cheval?id=96124097": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96124097",groom_de,false), // hippogreif
    "https://www.howrse.de/elevage/chevaux/cheval?id=96118362": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96118362","",false), // TODO Pluto

    "https://nl.howrse.com/elevage/chevaux/cheval?id=18503927": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18503927",egypt_nl,false), // nl ptah
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18342894": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18342894",stellar_nl,false), // nl r. riese
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18334864": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18334864",spice_nl,false), // nl vanille
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18235073": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18235073",groom_nl,false), // nl gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18232920": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18232920",groom_nl,false), // nl scandium
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18230648": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18230648",groom_nl,false), // nl rose gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18173055": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18173055",japanese_nl,false), // nl maneki-neko
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18171053": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18171053",jade_nl,true), // nl jade
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17871771": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17871771",maori_nl,false), // nl haumia
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17818946": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17818946",japanese_nl,false), // nl kigurumi
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17473613": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17473613",egypt_nl,false), // nl anubis

    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206",japanese_en,false), // uk sushi
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830",egypt_en,false), // uk ptah
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002",stellar_en,false), // uk r. riese
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745",spice_en,false), // uk vanille
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405",japanese_en,false), // uk maneki
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715",jade_en,true), // uk jade
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937",japanese_en,false), // uk kigu

    "https://www.howrse.com/elevage/chevaux/cheval?id=85973517": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85973517",jade_en,false), // int opal (?)
    "https://www.howrse.com/elevage/chevaux/cheval?id=85961694": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85961694",amber_en,true), // int amber 2
    "https://www.howrse.com/elevage/chevaux/cheval?id=85530746": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85530746",egypt_en,false), // int ptah
    "https://www.howrse.com/elevage/chevaux/cheval?id=84834452": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84834452",stellar_en,false), // int r. riese
    "https://www.howrse.com/elevage/chevaux/cheval?id=84802141": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84802141",spice_en,false), // int vanilla
    "https://www.howrse.com/elevage/chevaux/cheval?id=84298887": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84298887",groom_en,false), // int osmium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84293956": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84293956",groom_en,false), // int gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=84279411": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84279411",groom_en,false), // int scandium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84279411": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84279411",groom_en,false), // int rose gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=83954706": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83954706",japanese_en,false), // int maneki
    "https://www.howrse.com/elevage/chevaux/cheval?id=83952516": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83952516",jade_en,true), // int jade
    "https://www.howrse.com/elevage/chevaux/cheval?id=83649165": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83649165",amber_en,true), // int amber 1

    "https://au.howrse.com/elevage/chevaux/cheval?id=3980162": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3980162",jade_en,false), // au opal (?)
    "https://au.howrse.com/elevage/chevaux/cheval?id=3979756": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3979756",amber_en,true), // au amber
    "https://au.howrse.com/elevage/chevaux/cheval?id=3958553": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3958553",fairytale_en,false), // au jack
    "https://au.howrse.com/elevage/chevaux/cheval?id=3956336": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3956336",egypt_en,false), // au ptah
    "https://au.howrse.com/elevage/chevaux/cheval?id=3930161": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3930161",stellar_en,false), // au red giant
    "https://au.howrse.com/elevage/chevaux/cheval?id=3929552": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3929552",spice_en,false), // au vanilla
    "https://au.howrse.com/elevage/chevaux/cheval?id=3914975": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3914975",chinese_en,true), // au pixiu
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911813": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911813",groom_en,false), // au gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911451": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911451",groom_en,false), // au scandium
    "https://au.howrse.com/elevage/chevaux/cheval?id=3910939": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3910939",groom_en,false), // au rose gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3900809": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3900809",japanese_en,false), // au maneki neko
    "https://au.howrse.com/elevage/chevaux/cheval?id=3854470": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3854470",stellar_en,false), // au yellow dwarf
    "https://au.howrse.com/elevage/chevaux/cheval?id=3838078": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3838078",fairytale_en,false), // au tom thumb
    "https://au.howrse.com/elevage/chevaux/cheval?id=3829117": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3829117",celtic_en,false), // au cernunnos
    "https://au.howrse.com/elevage/chevaux/cheval?id=3818348": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3818348",japanese_en,false), // au kigurumi
    "https://au.howrse.com/elevage/chevaux/cheval?id=3801726": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3801726",chinese_en,true), // au tianma





    //, etc.
}


let currentHorse = $('.horse-name a[href]')[0].href;

horses[currentHorse].check();
/*
let sleepButtonParent = $('#night-body-content')[0];
const callback = (mutationRecords) => {
    console.log(mutationRecords);
    mutationRecords.forEach( mutationRecord => {
        if (mutationRecord.type === 'childList') {
            mutationRecord.addedNodes.forEach( addedNode => {
                let sleepButton = $(addedNode).find('#boutonCoucher')?.[0];
                // hier schauen ob das element da ist 
                if (sleepButton) {
                    //prüfen nach klasse ob wiese oder box
                    if (sleepButton.classList.contains("coucher-box")) {
                        console.log("in box");
                        let now = new Date(); // default now
                        let key = window.location.hostname;
                        let resetHour = new Date().getTimezoneOffset() == -120 ? resetsSommer[key] : resetsWinter[key]; //winter und sommerzeit wirken sich unterschiedlich auf die einzelnen domains aus
                        let lastResetDate = new Date(new Date().setHours(resetHour, 0, 0)) > new Date ? new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(resetHour, 0, 0)) : new Date(new Date().setHours(resetHour, 0, 0));
                        let todaysResetDate = new Date(new Date().setHours(resetHour, 0, 0));

                        let endOfRegistration = DateParser.parseRegistrationEndDate($("#center-tab-main").find(".tab-action.tab-action-select.button.button-style-14").parent().parent().find(".grid-cell.align-top")[0].textContent,window.location.hostname); // $("#center-tab-main").find(".tab-action.tab-action-select.button.button-style-14").parent().parent().find(".grid-cell.align-top")[0].textContent;
                        console.log(endOfRegistration);
                        if (todaysResetDate.getTime() > now.getTime() || endOfRegistration.getTime() > now.getTime()) { // date > today
                            // alles gut
                            // reset kommt erst noch, Pferd schläft, wird schlafen, und wird geschlafen haben
                            // oder es steht eh noch länger
                            // variable setzen: schläft
                            window.localStorage.setItem("asleep"+currentHorse,now.getTime());
                            
                        } else {
                            // gefahr! O.O
                            // aber egal muss man nix tun
                        }
                    } else if (sleepButton.classList.contains("coucher-pre")) {
                        // done
                        console.log("auf wiese");
                        // variable setzen: schläft
                        window.localStorage.setItem("asleep"+currentHorse,new Date().getTime());
                    }
                }
                //prüfen nach ist new Date kleiner als das reset heute?
                //prüfen ob datum des RZ heute ist
                //daraus col berechen ob schlafengehen erfolgreich war
                // ähnliche überprüfung onLoad, weil man eventuell nochmal im reitzentrum anmelden muss und dann auf die seite zurück geworfen wird.
                //6prüfen, ob ich hier den initialen create beim aufbau der seite mitbekomme^^
            });
        }
    });
};

let observer = new MutationObserver(callback);

observer.observe(sleepButtonParent, {childList: true}); // subtree: true, // das im kommentar vermutlich unnötig
*/

/*
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
} // */
//damit das dann auch was tut muss dann in der backround.js die nachricht entsprechend angenommen und die entsprechende Methode auch ausgeführt werden (siehe backround.js)

//cheetsheet für basic jquery zum auslesen von daten aus der webseite: https://www.jquerycheatsheet.com/






