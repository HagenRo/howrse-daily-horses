/**
 * The regex return/store/? either 1 or 2 values.
 * For divine families, where only the amount of dropping is interesting, they only return 1 value: the amount.
 * For divine families, where the drop may have another type, they return two values: the amount and the type. These families are japanese, egypts (sherlock holmes) so far.
 */

// de
let equus_de = /.+ bringt Dir  (\d+) x  Equus\./; // hilfsregex

// log types for proper classification (2 results)
let japanese_de = [/.+ bringt Dir (\d+) x  (.+)\./]///.+ bringt Dir (\d+) x  Englische Satteldecke 2\*\* ([a-zA-Z ]+)\./]; // da gibts nen haufen möglicher gegenstände, aber es ist auch ein Link im Chat. Können wir es daraus auslesen?
let egypt_de = [/.+ bringt Dir (\d+) x  (.+)./,/.+ bringt Dir (\d+) (.+)/,/.+ bringt Dir  (\d+) (.+)/]; // equus_de,/.+ bringt Dir  (\d+) Fähigkeitenpunkte./ // geht das so?

// only the amount
let skillsChinese_de = [/.+ hat (\d+) (.+) gewonnen, die verteilt werden können/]; //Fähigkeitspunkte
let maori_de = [/.+ hat \d+ x Schildkrötenbabies entdeckt. Sein Tiki hat (\d+) x Mana erhalten./];
let groom_de = [/Du hast durch Striegeln von .+ (\d+) .+ gefunden./]; // 1. Punkt: Name; 2. Punkt: Mineralien, Federn oder, in com, Schuppen // hier müsste man auf Buchstaben oder Zahlen eingrenzen
let stellar_de = [/Du hast (\d+) x Sternstaub gefunden, indem Du den Stern der Odyssee im Weltraum enthüllst./];
let spice_de = [/Du hast (\d+) Gewürze für Deine Fortschrittsanzeige erhalten./]; // auch exemptions?
let jade_de = [/Du hast (\d+)  gewonnen\!/];
let fairytale_de = [/.+ hat eine Geschichte gelesen und (\d+) Handlungselemente entdeckt/,/.+ hat eine Geschichte gelesen/]; // handlungselemente entdeckt?

// english
// log types for proper classification (2 results)
let japanese_en = [/.+ brings you (\d+) x  (.+)\./]; // can we replace ageing point by ".+"? //equus_en,/.+ brings you (\d+) x  Ageing point/,
let egypt_en = [/.+ brings you  (\d+) (.+)./,/.+ brings you (\d+) x  (.+)./]; // /.+ brings you  (\d+) skill points./
let chinese_en = [/.+ won (\d+) (.+) you can spend whichever way you like/]; // skill points watched on au

// only the amount
let equus_en = /.+ brings you (\d+) x  Equus./;
let stellar_en = [/You found (\d+) x Stardusts by uncovering the Space Odyssey star./];
let spice_en = [/You have obtained (\d+) spices for your meter./];
let spice_uk_au = [/You have obtained (\d+) spices for your metre./];
let groom_en = [/You found (\d+) .+ by grooming .+\./]; // minerals or scales
let jade_en = [/You won (\d+) \!/]; // there's a passes icon in there, but should just be 1 space in text
// amber drops either droppings or passes - today it was droppings, passes will be tomorrow.
let amber_en = [/You won 10 !/,/Amber produced \d+ pounds of droppings yesterday/]; // uk and au would say "kg" instead of pounds; but this is another EXEMPTION
let skinfaxi_au = [/Skínfaxi gave \+(\d+) rays of light/]; // if that's okay
let fairytale_en = [/.+ has read a story and discovered (\d+) plot element/,/.+ has read a story/]; // TODO ergänzen wenn er 2 handlungselemente findet
let celtic_en = [/.+ used their powers of divination but found no letter from the prediction/,/.+ used their powers of divination and found (\d+) new letter from the prediction/]; // TODO ergänzen wenn er 2 findet

// exemptions from com english?

// nl
// log types for proper classification (2 results)
let japanese_nl = [/.+ brengt je (\d+) x  (.+)\./]; // [/.+ brengt je (\d+) x  Verouderingspunt./,/.+ brengt je (\d+) x  Equus./,/.+ brengt je (\d+) x  Appelzaden./,/.+ brengt je (\d+) x  (.+)\./];
let egypt_nl = [/.+ brengt je  (\d+) (.+)\./];//,/.+ brengt je (\d+) x  Leder./, /.+ brengt je (\d+) x  IJzer./];

// only the amount
let stellar_nl = [/Je hebt (\d+) x Sterrenstof gevonden door de ster van de Tocht door de ruimte te onthullen./];
let spice_nl = [/Je hebt (\d+) specerijen voor je meter verkregen./];
let groom_nl = [/Je vond (\d+) stukken erts door .+ te verzorgen./]; // only metal horses if it stays like this
let jade_nl = [/Je won (\d+) \!/];
let maori_nl = [/.+ vond \d+ x babyschildpad. Zijn of haar Tiki ontving (\d+) x mana./];
let fairytale_nl = [/. heeft een verhaal gelezen/,/. heeft een verhaal gelezen en (\d+) plotelement ontdekt/]; // es fehlt noch 2


// se
// log types for proper classification (2 results)
let japanese_se = [/.+ ger dig (\d+) x  (.+)\./]///,/.+ ger dig (\d+) x  Åldrandepoäng./,/.+ ger dig (\d+) x  Equus./]; // APs, Eq
let egypt_se = [/.+ ger dig (\d+) x (.+)\./,/.+ ger dig  (\d+) (.+)\./]// /.+ ger dig  (\d+) färdighetspoäng./,/.+ ger dig (\d+) x Järn./]; // fk

// only the amount
let stellar_se = [/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./,/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./];
let spice_se = [/Du har fått tag på (\d+) kryddor till din mätare./];
let jade_se = [/Du vann (\d+) \!/];
let maori_se = [/.+ hittade \d+ x sköldpaddsunge. Deras tiki fick (\d+) x mana./];
let fairytale_se = [/.+ har läst en saga/]; 


// drop types
// /marche/voir?qName=defi-titans // HdT
// /marche/voir?qName=don-hestia // Hestias Gabe
// (kein Link) // Equus
// (kein Link) // pass
// /marche/voir?qName=vieillissement // APs
// /marche/voir?qName=ressource-cuir // Leder
// /marche/voir?qName=ressource-fer // Eisen
// /marche/voir?qName=avoine // Hafer | Oats
// /marche/voir?qName=ressource-lin // Flachs
// /marche/voir?qName=graines-pomme // Apfelsamen
// /marche/voir?qName=bande-2x-rose // Bandagen (rosa)
// /marche/voir?qName=bonnet-2x-rouge-bleu // Fliegenohren
// /marche/voir?qName=tapis-classique-2x-noir // Satteldecke (schwarz)
// /marche/voir?qName=tapis-classique-2x-rouge // " (rot)

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


//let shenma = new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus");



let horses ={
    "https://www.howrse.de/elevage/chevaux/cheval?id=81394568": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",skillsChinese_de,true,"Bonus"), // shenma
    // de athos
    "https://www.howrse.de/elevage/chevaux/cheval?id=103173953": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103173953",jade_de,false,0,"pierres","opale","pass"), // de opal TODO
    "https://www.howrse.de/elevage/chevaux/cheval?id=103159709": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103159709",jade_de,true,0,"pierres","ambre","pass"), // de Bernstein
    "https://www.howrse.de/elevage/chevaux/cheval?id=102537929": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=102537929",fairytale_de,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // de Jack 2
    "https://www.howrse.de/elevage/chevaux/cheval?id=102537911": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=102537911",egypt_de,false), // de ptah
    "https://www.howrse.de/elevage/chevaux/cheval?id=101962013": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101962013",maori_de,false,undefined,"maori","rongo","Mana"), // de rongo
    "https://www.howrse.de/elevage/chevaux/cheval?id=101748916": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101748916",stellar_de,false,undefined,"stellar","red-giant","star dust"), // de r. riese
    "https://www.howrse.de/elevage/chevaux/cheval?id=101747778": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101747778",spice_de,false,undefined,"spice","vanilla","Spices"), // de vanille
    "https://www.howrse.de/elevage/chevaux/cheval?id=101198532": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101198532",groom_de,false,undefined,"metals","metal-osmium","minerals"), // de Osmium
    "https://www.howrse.de/elevage/chevaux/cheval?id=101194996": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101194996",groom_de,false,undefined,"metals","metal-gold","minerals"), // Gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=101164900": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101164900",groom_de,false,undefined,"metals","metal-rose-gold","minerals"), // rose gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100844463": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100844463",jade_de,true,0,"pierres","jade","pass"), // jade de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100800447": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100800447",japanese_de,false), // maneki-neko de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100358235": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100358235",egypt_de,false), // osiris de  // TODO
    "https://www.howrse.de/elevage/chevaux/cheval?id=100050626": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100050626",stellar_de,false,undefined,"stellar","yellow-dwarf","star dust"), // gelber zwerg de
    "https://www.howrse.de/elevage/chevaux/cheval?id=99509978": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99509978",fairytale_de,false,0,"fairyTales","little-poucet","Handlungselement"), // de Däuming
    "https://www.howrse.de/elevage/chevaux/cheval?id=99284359": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99284359",spice_de,false,undefined,"spice","clove","Spices"), // nelke
    "https://www.howrse.de/elevage/chevaux/cheval?id=98938751": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=98938751",japanese_de,false), // kigu de
    "https://www.howrse.de/elevage/chevaux/cheval?id=97064563": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=97064563",egypt_de,false), // nubinubi de
    "https://www.howrse.de/elevage/chevaux/cheval?id=96124097": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96124097",groom_de,false,undefined,"mythologique","hippogriffe","feather-hippogriff"), // hippogreif
    "https://www.howrse.de/elevage/chevaux/cheval?id=96118362": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96118362",jade_de,false,0,"planetes","pluton","pass"), // TODO Pluto
    "https://www.howrse.de/elevage/chevaux/cheval?id=93504195": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=93504195",skillsChinese_de,true,"Bonus"), // de tianma
    "https://www.howrse.de/elevage/chevaux/cheval?id=93504128": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=93504128",fairytale_de,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // de jack 1
    "https://www.howrse.de/elevage/chevaux/cheval?id=42987125": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=42987125",[],true), // de mond


    "https://nl.howrse.com/elevage/chevaux/cheval?id=18619559": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18619559",japanese_nl,false), // nl sushi
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18591888": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18591888",[],true), // nl athos (??)
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18586839": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18586839",jade_nl,true,0,"pierres","ambre","pass"), // nl amber?
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18503927": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18503927",egypt_nl,false), // nl ptah
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18483273": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18483273",fairytale_nl,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // nl jack
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18342894": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18342894",stellar_nl,false,undefined,"stellar","red-giant","star dust"), // nl r. riese
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18334864": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18334864",spice_nl,false,undefined,"spices","vanilla","Spices"), // nl vanille
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18235073": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18235073",groom_nl,false,undefined,"metals","metal-gold","minerals"), // nl gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18232920": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18232920",groom_nl,false,undefined,"metals","metal-scandium","minerals"), // nl scandium
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18230648": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18230648",groom_nl,false,undefined,"metals","metal-rose-gold","minerals"), // nl rose gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18173055": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18173055",japanese_nl,false), // nl maneki-neko
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18171053": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18171053",jade_nl,true,0,"pierres","jade","pass"), // nl jade
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17912865": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17912865",fairytale_nl,false,0,"fairyTales","little-poucet","Handlungselement"), // nl däumling
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17871771": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17871771",maori_nl,false,undefined,"maori","haumia-tiketike","Mana"), // nl haumia
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17818946": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17818946",japanese_nl,false), // nl kigurumi
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17473613": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17473613",egypt_nl,false), // nl anubis

    "https://www.howrse.se/elevage/chevaux/cheval?id=10818175": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10818175",[],true), // se athos (??)
    "https://www.howrse.se/elevage/chevaux/cheval?id=10817706": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10817706",jade_se,false,0,"pierres","opale","pass"), // se opal
    "https://www.howrse.se/elevage/chevaux/cheval?id=10770530": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10770530",egypt_se,false), // se ptah
    "https://www.howrse.se/elevage/chevaux/cheval?id=10770528": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10770528",fairytale_se,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // se jack
    "https://www.howrse.se/elevage/chevaux/cheval?id=10716323": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10716323",stellar_se,false,undefined,"stellar","red-giant","star dust"), // se r. riese
    "https://www.howrse.se/elevage/chevaux/cheval?id=10713032": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10713032",spice_se,false,"spices","vanilla","Spices"), // se vanille
    "https://www.howrse.se/elevage/chevaux/cheval?id=10642650": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10642650",japanese_se,false), // se maneki-neko
    "https://www.howrse.se/elevage/chevaux/cheval?id=10641574": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10641574",jade_se,true,0,"pierres","jade"), // se jade
    "https://www.howrse.se/elevage/chevaux/cheval?id=10591686": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10591686",maori_se,false,undefined,"maori","rehua","Mana"), // se rehua
    "https://www.howrse.se/elevage/chevaux/cheval?id=10528437": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10528437",fairytale_se,false,0,"fairyTales","little-poucet","Handlungselement"), // se däumling
    "https://www.howrse.se/elevage/chevaux/cheval?id=10490067": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10490067",japanese_se,false), // se kigurumi
    "https://www.howrse.se/elevage/chevaux/cheval?id=10335881": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10335881",egypt_se,false), // se nubi

    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206",japanese_en,false), // uk sushi
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9307282": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9307282",jade_en,false,0,"pierres","opale","pass"), // uk opal
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9306346": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9306346",amber_en,true,0,"pierres","ambre","pass"), // uk amber
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9260715": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9260715",fairytale_en,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // uk jack
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830",egypt_en,false), // uk ptah
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002",stellar_en,false,undefined,"stellar","red-giant","star dust"), // uk r. riese
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745",spice_uk_au,false,undefined,"spices","vanilla","Spices"), // uk vanille
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405",japanese_en,false), // uk maneki
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715",jade_en,true,0,"pierres","jade","pass"), // uk jade
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=8992215": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=8992215",fairytale_en,false,0,"fairyTales","little-poucet","Handlungselement"), // uk tom
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937",japanese_en,false), // uk kigu

    "https://www.howrse.com/elevage/chevaux/cheval?id=85973517": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85973517",jade_en,false,0,"pierres","opale","pass"), // int opal (?)
    "https://www.howrse.com/elevage/chevaux/cheval?id=85961694": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85961694",amber_en,true,0,"pierres","ambre","pass"), // int amber 2
    "https://www.howrse.com/elevage/chevaux/cheval?id=85550189": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85550189",fairytale_en,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // jack
    "https://www.howrse.com/elevage/chevaux/cheval?id=85530746": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85530746",egypt_en,false), // int ptah
    "https://www.howrse.com/elevage/chevaux/cheval?id=84834452": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84834452",stellar_en,false,undefined,"stellar","red-giant","star dust"), // int r. riese
    "https://www.howrse.com/elevage/chevaux/cheval?id=84802141": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84802141",spice_en,false,undefined,"spices","vanilla","Spices"), // int vanilla
    "https://www.howrse.com/elevage/chevaux/cheval?id=84298887": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84298887",groom_en,false,undefined,"metals","metal-osmium","minerals"), // int osmium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84293956": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84293956",groom_en,false,undefined,"metals","metal-gold","minerals"), // int gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=84279411": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84279411",groom_en,false,undefined,"metals","metal-scandium","minerals"), // int scandium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84267650": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84267650",groom_en,false,undefined,"metals","metal-rose-gold","minerals"), // int rose gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=83954706": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83954706",japanese_en,false), // int maneki
    "https://www.howrse.com/elevage/chevaux/cheval?id=83952516": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83952516",jade_en,true,0,"pierres","jade","pass"), // int jade
    "https://www.howrse.com/elevage/chevaux/cheval?id=83649165": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83649165",amber_en,true,0,"pierres","ambre","pass"), // int amber 1
    "https://www.howrse.com/elevage/chevaux/cheval?id=82521123": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=82521123",fairytale_en,false,0,"fairyTales","little-poucet","Handlungselement"),

    "https://au.howrse.com/elevage/chevaux/cheval?id=3980162": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3980162",jade_en,false,0,"pierres","opale","pass"), // au opal (?)
    "https://au.howrse.com/elevage/chevaux/cheval?id=3979756": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3979756",amber_en,true,0,"pierres","ambre","pass"), // au amber
    "https://au.howrse.com/elevage/chevaux/cheval?id=3958553": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3958553",fairytale_en,false,0,"fairyTales","jack-and-the-beanstalk","Handlungselement"), // au jack
    "https://au.howrse.com/elevage/chevaux/cheval?id=3956336": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3956336",egypt_en,false), // au ptah
    "https://au.howrse.com/elevage/chevaux/cheval?id=3930161": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3930161",stellar_en,false,undefined,"stellar","red-giant","star dust"), // au red giant
    "https://au.howrse.com/elevage/chevaux/cheval?id=3929552": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3929552",spice_uk_au,false,undefined,"spices","vanilla","Spices"), // au vanilla
    "https://au.howrse.com/elevage/chevaux/cheval?id=3919543": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3919543",skinfaxi_au,true,undefined,"mythologique","skinfaxi"), // au skinfaxi
    "https://au.howrse.com/elevage/chevaux/cheval?id=3914975": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3914975",chinese_en,true), // au pixiu
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911813": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911813",groom_en,false,undefined,"metals","metal-gold","minerals"), // au gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911451": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911451",groom_en,false,undefined,"metals","metal-scandium","minerals"), // au scandium
    "https://au.howrse.com/elevage/chevaux/cheval?id=3910939": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3910939",groom_en,false,undefined,"metals","metal-rose-gold","minerals"), // au rose gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3900809": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3900809",japanese_en,false), // au maneki neko
    "https://au.howrse.com/elevage/chevaux/cheval?id=3854470": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3854470",stellar_en,false,undefined,"stellar","yellow-dwarf","star dust"), // au yellow dwarf
    "https://au.howrse.com/elevage/chevaux/cheval?id=3838078": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3838078",fairytale_en,false,0,"fairyTales","little-poucet","Handlungselement"), // au tom thumb
    "https://au.howrse.com/elevage/chevaux/cheval?id=3829117": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3829117",celtic_en,false,undefined,"celtic","cernunnos","ogham letter"), // au cernunnos
    "https://au.howrse.com/elevage/chevaux/cheval?id=3818348": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3818348",japanese_en,false), // au kigurumi
    "https://au.howrse.com/elevage/chevaux/cheval?id=3801726": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3801726",chinese_en,true), // au tianma





    //, etc.
}


let currentHorse = $('.horse-name a[href]')[0].href;

if (horses[currentHorse]) {
    horses[currentHorse].check();
}

// 1. Notification-Container erstellen
const notificationDiv = document.createElement('div');
notificationDiv.id = 'my-extension-notification';
notificationDiv.className = 'notification hide';
notificationDiv.innerHTML = 'Das ist eine Benachrichtigung!';

// 2. Styles hinzufügen
const style = document.createElement('style');
style.textContent = `
  #my-extension-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #333;
    color: #fff;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    z-index: 9999;
  }
  #my-extension-notification.show {
    opacity: 1;
    transform: translateY(0);
  }
  #my-extension-notification.hide {
    opacity: 0;
    transform: translateY(-20px);
  }
`;
document.head.appendChild(style);
document.body.appendChild(notificationDiv);

// 3. Funktion, um die Notification zu zeigen
function showNotification(notifDropAmount, notifDropType, notifDropSubType) {
  const notif = document.getElementById('my-extension-notification');
  notif.classList.remove('hide');
  notif.classList.add('show');
  notif.innerHTML = ""; // horse name?
  notif.innerHTML = notif.innerHTML + notifDropAmount + " x " + notifDropType;
  if (notifDropSubType) notif.innerHTML = notif.innerHTML + " ("+notifDropSubType+")";

  setTimeout(() => {
    notif.classList.remove('show');
    notif.classList.add('hide');
  }, 3000);
}

// 4. Beispiel: Notification beim Laden anzeigen
// showNotification();

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






