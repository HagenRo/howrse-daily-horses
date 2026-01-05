/**
 * The regex return/store/? either 1 or 2 values.
 * For divine families, where only the amount of dropping is interesting, they only return 1 value: the amount.
 * For divine families, where the drop may have another type, they return two values: the amount and the type. These families are japanese, egypts (sherlock holmes) so far.
 */

const spicesButtonIdentifier = ".grid-cell.odd.last button.button.button-style-0"; // " .button:eq(1)" bzw. " .button:last"
const carrotButtonIdentifier = "#boutonCarotte";
const opalEndStrings_de = [/Opal hat eine Karotte gefressen \(Energie: \+\d+\)/,/Opal hat eine Karotte gefressen \(Energie: \+\d+, Moral: \+\d+\)/];
const opalEndStrings_en = [/Opal ate a carrot \(energy: \+\d+\)/,/Opal ate a carrot \(energy: \+\d+, morale: \+\d+\)/];
const opalEndStrings_se = [/Opal åt en morot .+/];
const plutoEndStrings_de = [/Ausflug in der Andromeda-Galaxie mit Pluto .+/];

// horse family types
const horseType_mythological = "mythologique";
const horseType_gemstone = "pierres";
const horseType_solarSystem = "planetes";
const horseType_chinese = "chinois";
const horseType_egypt = "egyptien";
const horseType_celtic = "celtic";
const horseType_maori = "maori";
const horseType_japanese = "japonais";
const horseType_dragon = "dragon";
const horseType_musketeer = "musketeer";
const horseType_fairyTale = "fairyTales";
const horseType_metal = "metals";
const horseType_sherlock = "sherlockAdventures";
const horseType_spice = "spice";
const horseType_stellar = "stellar";
const horseType_alien = "alien";
const horseType_tea = "tea"; // hab ich noch keins, aber scheinen Passdropper zu sein

// de
let equus_de = /.+ bringt Dir  (\d+) x  Equus\./; // hilfsregex
let pass_de = /Du hast (\d+)  gewonnen\!/;
let skillsChinese_de = [/.+ hat (\d+) (.+) gewonnen, die verteilt werden können/]; //Fähigkeitspunkte

// log types for proper classification (2 results)
let japanese_de = [/.+ bringt Dir (\d+) x  (.+)\./]///.+ bringt Dir (\d+) x  Englische Satteldecke 2\*\* ([a-zA-Z ]+)\./]; // da gibts nen haufen möglicher gegenstände, aber es ist auch ein Link im Chat. Können wir es daraus auslesen?
let egypt_de = [/.+ bringt Dir (\d+) x  (.+)./,/.+ bringt Dir (\d+) (.+)/,/.+ bringt Dir  (\d+) (.+)/]; // equus_de,/.+ bringt Dir  (\d+) Fähigkeitenpunkte./ // geht das so?
let chinese_de = [/.+ hat (\d+) ([^\s]+) gewonnen, die verteilt werden können/,/.+ ist gerade aufgewacht\./]; // .+ hat (\d+) (.+) gewonnen, die verteilt werden können
let sherlockAdventures_de = [/.+ bringt Dir (\d+) x  (.+)./,/.+ bringt Dir (\d+) (.+)/,/.+ bringt Dir  (\d+) (.+)/];

// only the amount
let maori_de = [/.+ hat \d+ x Schildkrötenbabies entdeckt. Sein Tiki hat (\d+) x Mana erhalten./];
let groom_de = [/Du hast durch Striegeln von .+ (\d+) .+ gefunden./]; // 1. Punkt: Name; 2. Punkt: Mineralien, Federn oder, in com, Schuppen // hier müsste man auf Buchstaben oder Zahlen eingrenzen
let stellar_de = [/Du hast (\d+) x Sternstaub gefunden, indem Du den Stern der Odyssee im Weltraum enthüllst./];
let spice_de = [/Du hast (\d+) Gewürze für Deine Fortschrittsanzeige erhalten./]; // auch exemptions?
let jade_de = [/Du hast (\d+)  gewonnen\!/,/Jade ist gerade aufgewacht\./]; //%
let opal_de = [/Du hast (\d+)  gewonnen\!/];//,/Opal hat eine Karotte gefressen \(Energie: \+\d+\)/,/Opal hat eine Karotte gefressen \(Energie: \+\d+, Moral: \+\d+\)/]; //%
let agate_de = [pass_de];
let amber_de = [/Du hast (\d+)  gewonnen\!/,/Bernstein hat gestern \d+ kg Pferdeäpfel produziert/];
let pluto_de = [/Du hast (\d+)  gewonnen\!/];//,/Ausflug in der Andromeda-Galaxie mit Pluto .+/]; //%
let fairytale_de = [/.+ hat eine Geschichte gelesen und (\d+) Handlungselemente entdeckt/,/.+ hat eine Geschichte gelesen/]; //% // handlungselemente entdeckt?

// english
// log types for proper classification (2 results)
let japanese_en = [/.+ brings you (\d+) x  (.+)\./]; // can we replace ageing point by ".+"? //equus_en,/.+ brings you (\d+) x  Ageing point/,
let egypt_en = [/.+ brings you  (\d+) (.+)./,/.+ brings you (\d+) x  (.+)./]; // /.+ brings you  (\d+) skill points./
let chinese_en = [/.+ won (\d+) (.+) you can spend whichever way you like/,/.+ has just woken up/]; // skill points watched on au
let sherlockAdventures_en = [/.+ brings you  (\d+) (.+)./,/.+ brings you (\d+) x  (.+)./]; 

// only the amount
let equus_en = /.+ brings you (\d+) x  Equus./;
let pass_en = /You won (\d+) \!/;
let stellar_en = [/You found (\d+) x Stardusts by uncovering the Space Odyssey star./];
let spice_en = [/You have obtained (\d+) spices for your meter./];
let spice_uk_au = [/You have obtained (\d+) spices for your metre./];
let groom_en = [/You found (\d+) .+ by grooming .+\./]; // minerals or scales
let agate_en = [pass_en];
let jade_en = [/You won (\d+) \!/,/Jade has just woken up/]; // there's a passes icon in there, but should just be 1 space in text
// amber drops either droppings or passes - today it was droppings, passes will be tomorrow.
let amber_en = [/You won (\d+) !/,/Amber produced \d+ pound.* of droppings yesterday/,/Amber produced \d+ kg of droppings yesterday/]; // uk and au would say "kg" instead of pounds; but this is another EXEMPTION
let opal_en = [/You won (\d+) !/];//,/Opal ate a carrot \(energy: \+\d+\)/,/Opal ate a carrot \(energy: \+\d+, morale: \+\d+\)/];
let skinfaxi_au = [/Skínfaxi gave \+(\d+) rays of light/]; // if that's okay
let fairytale_en = [/.+ has read a story and discovered (\d+) plot element/,/.+ has read a story/]; // TODO ergänzen wenn er 2 handlungselemente findet
let celtic_en = [/.+ used their powers of divination but found no letter from the prediction/,/.+ used their powers of divination and found (\d+) new letter from the prediction/]; // TODO ergänzen wenn er 2 findet
let maori_en = [];

// exemptions from com english?

// nl
// log types for proper classification (2 results)
let japanese_nl = [/.+ brengt je (\d+) x  (.+)\./]; // [/.+ brengt je (\d+) x  Verouderingspunt./,/.+ brengt je (\d+) x  Equus./,/.+ brengt je (\d+) x  Appelzaden./,/.+ brengt je (\d+) x  (.+)\./];
let egypt_nl = [/.+ brengt je  (\d+) (.+)\./,/.+ brengt je (\d+) x  (.+)\./];//,/.+ brengt je (\d+) x  Leder./, /.+ brengt je (\d+) x  IJzer./];
let sherlockAdventures_nl = [/.+ brengt je  (\d+) (.+)\./,/.+ brengt je (\d+) x  (.+)\./];
let pass_nl = /Je won (\d+) \!/

// only the amount
let stellar_nl = [/Je hebt (\d+) x Sterrenstof gevonden door de ster van de Tocht door de ruimte te onthullen./];
let spice_nl = [/Je hebt (\d+) specerijen voor je meter verkregen./];
let groom_nl = [/Je vond (\d+) stukken erts door .+ te verzorgen./]; // only metal horses if it stays like this
let jade_nl = [/Je won (\d+) \!/, /Jade is net wakker geworden/,/Amber heeft gisteren \d+ kg aan uitwerpselen geproduceerd/];
let maori_nl = [/.+ vond \d+ x babyschildpad. Zijn of haar Tiki ontving (\d+) x mana./];
let fairytale_nl = [/. heeft een verhaal gelezen en (\d+) plotelement ontdekt/,/. heeft een verhaal gelezen/];
let celtic_nl = [/. gebruikte de gaven van waarzeggen maar vond geen nieuwe letters uit de voorspelling/]; // fehlt noch 1 und 2


// se
// log types for proper classification (2 results)
let japanese_se = [/.+ ger dig (\d+) x  (.+)\./]; ///,/.+ ger dig (\d+) x  Åldrandepoäng./,/.+ ger dig (\d+) x  Equus./]; // APs, Eq
let egypt_se = [/.+ ger dig (\d+) x (.+)\./,/.+ ger dig  (\d+) (.+)\./]; // /.+ ger dig  (\d+) färdighetspoäng./,/.+ ger dig (\d+) x Järn./]; // fk
let sherlockAdventures_se = [/.+ ger dig (\d+) x (.+)\./,/.+ ger dig  (\d+) (.+)\./];
let pass_se = /Du vann (\d+) \!/;

// only the amount
let stellar_se = [/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./,/Du hittade (\d+) x Stjärnstoft genom att upptäcka rymdodysséstjärnan./];
let spice_se = [/Du har fått tag på (\d+) kryddor till din mätare./];
let jade_se = [/Du vann (\d+) \!/,/Jade har precis vaknat/];
let opal_se = [/Du vann (\d+) \!/];//,/Opal åt en morot .+/];
let maori_se = [/.+ hittade \d+ x sköldpaddsunge. Deras tiki fick (\d+) x mana./];
let fairytale_se = [/.+ har läst en saga och upptäckt (\d+) berättelseelement/,/.+ har läst en saga/]; // /.+ ger dig (\d+) x (.+)/

// let mainPrizes = {
//     // mythologisch Skinfaxi, Hippokamp ignorier ich 
//     // pierres 
//     //'pierres': 'pass',
//     // egypt
//     'anubis':'don-hestia',
//     'osiris':'pass',
//     'ptah': 'pack-bonus',
//     // japonais
//     'kigurumi':'defi-titans',
//     // maneki-neko
//     'sushi':'pack-poseidon',
// }



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


const horseName_cinnamon = "cinnamon";
const horseName_anise = "star-anise";
const horseName_shenma = "shenma";
const horseName_silver = "metal-silver";
const horseName_moriarty = "professor-moriarty";
const horseName_jade = "jade";
const horseName_supernova = "supernova";
const horseName_seth = "seth";
const horseName_snowQueen = "snow-queen";
const horseName_sleepingBeauty = "sleeping-beauty";
const horseName_sapphire = "saphir";
const horseName_sushi = "sushi";
const horseName_samurai = "samurai";
const horseName_amon = "amon";
const horseName_ruby = "rubis";
const horseName_gypsum = "gypse";
const horseName_sherlockHolmes = "sherlock-holmes";
const horseName_snowWhite = "snow-white";
const horseName_yokai = "yokai";
const horseName_roptader = "alien-swamp";
const horseName_athos = "athos";
const horseName_agate = "agate";
const horseName_opal = "opale";
const horseName_amber = "ambre";
const horseName_jack = "jack-and-the-beanstalk";
const horseName_ptah = "ptah";
const horseName_rongo = "rongo";
const horseName_redGiant = "red-giant";
const horseName_vanilla = "vanilla";
const horseName_osmium = "metal-osmium";
const horseName_gold = "metal-gold";
const horseName_roseGold = "metal-rose-gold";
const horseName_manekiNeko = "maneki-neko";
const horseName_osiris = "osiris";
const horseName_yellowDwarf = "yellow-dwarf";
const horseName_littleTomThumb = "little-poucet";
const horseName_cloveNelke = "clove";
const horseName_kigurumi = "kigurumi";
const horseName_anubis = "anubis";
const horseName_hippogriff = "hippogriffe";
const horseName_pluto = "pluton";
const horseName_tianma = "tianma";
const horseName_moon = "lune";
const horseName_blueHypergiant = "blue-hypergiant";
const horseName_scandium = "metal-scandium";
const horseName_haumiaTiketike = "haumia-tiketike";
const horseName_cernunnos = "cernunnos";
const horseName_rapunzel = "rapunzel";
const horseName_kaiju = "kaiju-dragon";
const horseName_rehua = "rehua";
const horseName_hippocampus = "hippocampus";
const horseName_bonsai = "bonsai";
const horseName_onyx = "onyx";
const horseName_skinfaxi = "skinfaxi";
const horseName_pixiu = "pixiu";

// divine family specific drops
const familyDropType_spice = "Spices";
const familyDropType_fairyTale = "Handlungselement";
const familyDropType_metal = "minerals";
const familyDropType_celtic = "ogham letter";
const familyDropType_stellar = "star dust";
const familyDropType_maori = "Mana";
const familyDropType_chinese = "Bonus";

// drops of multiple families
const dropType_pass = "pass"; // is not a family specific drop
// include skill points? 

// horse specific drops
const dropType_mythological_hippogriff = "feather-hippogriff";
const dropType_mythological_hippocampus = "Schuppen";
const dropType_mythological_skinfaxi = "rays of light";

// bitte nicht direkt über horses klatschen.



let horses ={
    "https://www.howrse.de/elevage/chevaux/cheval?id=81394568": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=81394568",chinese_de,true,horseType_chinese,horseName_shenma,familyDropType_chinese,1,false,undefined,undefined,undefined,true), // shenma
    "https://www.howrse.de/elevage/chevaux/cheval?id=106067817": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=106067817",spice_de,false,horseType_spice,horseName_anise,familyDropType_spice,0),
    "https://www.howrse.de/elevage/chevaux/cheval?id=106117361": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=106117361",groom_de,false,horseType_metal,horseName_silver,familyDropType_metal,0),
    "https://www.howrse.de/elevage/chevaux/cheval?id=105792233": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105792233",sherlockAdventures_de,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true), 
    "https://www.howrse.de/elevage/chevaux/cheval?id=105684788": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105684788",jade_de,true,horseType_gemstone,horseName_jade,dropType_pass,0), // jade 2 de
    "https://www.howrse.de/elevage/chevaux/cheval?id=105620595": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105620595",stellar_de,false,horseType_stellar,horseName_supernova,familyDropType_stellar,0,false,undefined,undefined,undefined,false), // de supernova
    "https://www.howrse.de/elevage/chevaux/cheval?id=105619433": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105619433",egypt_de,false,horseType_egypt,horseName_seth,undefined,0,false,undefined,undefined,undefined,false), // de seth
    "https://www.howrse.de/elevage/chevaux/cheval?id=105609938": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105609938",spice_de,false,horseType_spice,horseName_cinnamon,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // de zimt // BUTTON
    "https://www.howrse.de/elevage/chevaux/cheval?id=105609778": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105609778",fairytale_de,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0), // de Schneekönigin
    "https://www.howrse.de/elevage/chevaux/cheval?id=105526645": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105526645",fairytale_de,false,horseType_fairyTale,horseName_sleepingBeauty,familyDropType_fairyTale,0,false,undefined,false,undefined,true), // Dornröschen
    "https://www.howrse.de/elevage/chevaux/cheval?id=105465969": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105465969",[],false,horseType_gemstone,horseName_sapphire,dropType_pass,0), // de Saphir; hat keine Info im eigenen Tagesverlauf
    "https://www.howrse.de/elevage/chevaux/cheval?id=105276819": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=105276819",japanese_de,false,horseType_japanese,horseName_sushi,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.de/elevage/chevaux/cheval?id=104864867": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104864867",japanese_de,false,horseType_japanese,horseName_samurai,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.de/elevage/chevaux/cheval?id=104659063": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104659063",egypt_de,false,horseType_egypt,horseName_amon,undefined,0,false,undefined,undefined,undefined,false), // de amon
    "https://www.howrse.de/elevage/chevaux/cheval?id=104625634": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104625634",[pass_de],true,horseType_gemstone,horseName_ruby,dropType_pass,0), // de Rubin
    "https://www.howrse.de/elevage/chevaux/cheval?id=104228738": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104228738",[pass_de],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,0,undefined,true), // de gypse
    "https://www.howrse.de/elevage/chevaux/cheval?id=104005047": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104005047",sherlockAdventures_de,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,false,undefined,undefined,undefined,true), // de sherlock holmes
    "https://www.howrse.de/elevage/chevaux/cheval?id=104005018": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=104005018",fairytale_en,false,horseType_fairyTale,horseName_snowWhite,familyDropType_fairyTale,0,false,undefined,false,undefined,true),
    "https://www.howrse.de/elevage/chevaux/cheval?id=103999426": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103999426",japanese_de,false,horseType_japanese,horseName_yokai,undefined,0,false,undefined,undefined,undefined,true), // de yokai
    "https://www.howrse.de/elevage/chevaux/cheval?id=103843370": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103843370",[],false,horseType_alien,horseName_roptader), // de roptader
    "https://www.howrse.de/elevage/chevaux/cheval?id=103182464": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103182464",[],false,horseType_musketeer,horseName_athos), // de athos
    "https://www.howrse.de/elevage/chevaux/cheval?id=103804263": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103804263",agate_de,false,horseType_gemstone,horseName_agate,dropType_pass,0), // de achat
    "https://www.howrse.de/elevage/chevaux/cheval?id=103173953": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103173953",opal_de,false,horseType_gemstone,horseName_opal,dropType_pass,0,false,undefined,undefined,carrotButtonIdentifier,false,opalEndStrings_de), // de opal TODO
    "https://www.howrse.de/elevage/chevaux/cheval?id=103159709": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=103159709",amber_de,true,horseType_gemstone,horseName_amber,dropType_pass,0), // de Bernstein
    "https://www.howrse.de/elevage/chevaux/cheval?id=102537929": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=102537929",fairytale_de,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // de Jack 2
    "https://www.howrse.de/elevage/chevaux/cheval?id=102537911": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=102537911",egypt_de,false,horseType_egypt,horseName_ptah,undefined,0,false,undefined,undefined,undefined,true), // de ptah
    "https://www.howrse.de/elevage/chevaux/cheval?id=101962013": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101962013",maori_de,false,horseType_maori,horseName_rongo,familyDropType_maori,0,false,undefined,undefined,undefined,true), // de rongo
    "https://www.howrse.de/elevage/chevaux/cheval?id=101748916": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101748916",stellar_de,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // de r. riese
    "https://www.howrse.de/elevage/chevaux/cheval?id=101747778": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101747778",spice_de,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // de vanille
    "https://www.howrse.de/elevage/chevaux/cheval?id=101198532": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101198532",groom_de,false,horseType_metal,horseName_osmium,familyDropType_metal,0), // de Osmium
    "https://www.howrse.de/elevage/chevaux/cheval?id=101194996": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101194996",groom_de,false,horseType_metal,horseName_gold,familyDropType_metal,0), // Gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=101164900": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=101164900",groom_de,false,horseType_metal,horseName_roseGold,familyDropType_metal,0), // rose gold de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100844463": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100844463",jade_de,true,horseType_gemstone,horseName_jade,dropType_pass,0), // jade de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100800447": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100800447",japanese_de,false,horseType_japanese,horseName_manekiNeko,undefined,0,false,undefined,undefined,undefined,true), // maneki-neko de
    "https://www.howrse.de/elevage/chevaux/cheval?id=100358235": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100358235",egypt_de,false,horseType_egypt,horseName_osiris,undefined), // osiris de  // TODO
    "https://www.howrse.de/elevage/chevaux/cheval?id=100050626": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=100050626",stellar_de,false,horseType_stellar,horseName_yellowDwarf,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // gelber zwerg de
    "https://www.howrse.de/elevage/chevaux/cheval?id=99509978": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99509978",fairytale_de,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // de Däuming
    "https://www.howrse.de/elevage/chevaux/cheval?id=99284359": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=99284359",spice_de,false,horseType_spice,horseName_cloveNelke,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // nelke
    "https://www.howrse.de/elevage/chevaux/cheval?id=98938751": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=98938751",japanese_de,false,horseType_japanese,horseName_kigurumi), // kigu de
    "https://www.howrse.de/elevage/chevaux/cheval?id=97064563": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=97064563",egypt_de,false,horseType_egypt,horseName_anubis), // nubinubi de
    "https://www.howrse.de/elevage/chevaux/cheval?id=96124097": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96124097",groom_de,false,horseType_mythological,horseName_hippogriff,dropType_mythological_hippogriff,0), // hippogreif
    "https://www.howrse.de/elevage/chevaux/cheval?id=96118362": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=96118362",pluto_de,false,horseType_solarSystem,horseName_pluto,dropType_pass,0,false,undefined,false,"#walk-voieLactee-submit",false,plutoEndStrings_de), // TODO Pluto
    "https://www.howrse.de/elevage/chevaux/cheval?id=93504195": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=93504195",chinese_de,true,horseType_chinese,horseName_tianma,familyDropType_chinese,0,false,undefined,undefined,undefined,true), // de tianma
    "https://www.howrse.de/elevage/chevaux/cheval?id=93504128": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=93504128",fairytale_de,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // de jack 1
    "https://www.howrse.de/elevage/chevaux/cheval?id=42987125": new Horse("https://www.howrse.de/elevage/chevaux/cheval?id=42987125",[],false,horseType_solarSystem,horseName_moon), // de mond

    "https://nl.howrse.com/elevage/chevaux/cheval?id=19031819": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=19031819",spice_nl,false,horseType_spice,horseName_anise,familyDropType_spice,0),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=19030253": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=19030253",groom_nl,false,horseType_metal,horseName_silver,familyDropType_metal,0),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18981762": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18981762",sherlockAdventures_nl,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18959265": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18959265",fairytale_nl,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0,false,undefined,false,undefined,false),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18959264": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18959264",spice_nl,false,horseType_spice,horseName_cinnamon,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18936183": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18936183",fairytale_nl,false,horseType_fairyTale,horseName_sleepingBeauty,familyDropType_fairyTale,0,false,undefined,false,undefined,true), // doornroosje // darunter feuerwerk eigentlich
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18808729": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18808729",[pass_nl],true,horseType_gemstone,horseName_ruby,dropType_pass,0), // darunter hippocamp eigentlich
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18796282": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18796282",stellar_nl,false,horseType_stellar,horseName_blueHypergiant,familyDropType_stellar,0,false,undefined,false,undefined,true),
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18740548": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18740548",[pass_nl],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,0,undefined,true), // nl gypse
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18715166": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18715166",fairytale_nl,false,horseType_fairyTale,horseName_snowWhite,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // nl snow white
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18715156": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18715156",sherlockAdventures_nl,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,false,undefined,undefined,undefined,true), // nl sherlock holmes
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18715152": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18715152",japanese_nl,false,horseType_japanese,horseName_yokai,undefined,0,false,undefined,undefined,undefined,true), // nl yokai
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18655205": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18655205",[],false,horseType_alien,horseName_roptader,"",0), // nl roptader
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18619559": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18619559",japanese_nl,false,horseType_japanese,horseName_sushi,undefined,0,false,undefined,undefined,undefined,true), // nl sushi
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18591888": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18591888",[],false,horseType_musketeer,horseName_athos), // nl athos (??)
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18586839": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18586839",jade_nl,true,horseType_gemstone,horseName_amber,dropType_pass,0), // nl amber?
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18503927": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18503927",egypt_nl,false,horseType_egypt,horseName_ptah,undefined,0,false,undefined,undefined,undefined,true), // nl ptah
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18483273": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18483273",fairytale_nl,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // nl jack
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18342894": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18342894",stellar_nl,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // nl r. riese
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18334864": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18334864",spice_nl,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // nl vanille
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18235073": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18235073",groom_nl,false,horseType_metal,horseName_gold,familyDropType_metal,0), // nl gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18232920": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18232920",groom_nl,false,horseType_metal,horseName_scandium,familyDropType_metal,0), // nl scandium
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18230648": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18230648",groom_nl,false,horseType_metal,horseName_roseGold,familyDropType_metal,0), // nl rose gold
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18173055": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18173055",japanese_nl,false,horseType_japanese,horseName_manekiNeko,undefined,0,false,undefined,undefined,undefined,true), // nl maneki-neko
    "https://nl.howrse.com/elevage/chevaux/cheval?id=18171053": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=18171053",jade_nl,true,horseType_gemstone,horseName_jade,dropType_pass,0), // nl jade
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17912865": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17912865",fairytale_nl,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // nl däumling
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17871771": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17871771",maori_nl,false,horseType_maori,horseName_haumiaTiketike,familyDropType_maori,0), // nl haumia
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17870985": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17870985",celtic_nl,false,horseType_celtic,horseName_cernunnos,familyDropType_celtic,0,false,undefined,undefined,undefined,true), // nl cernunnos
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17818946": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17818946",japanese_nl,false,horseType_japanese,horseName_kigurumi), // nl kigurumi
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17726326": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17726326",fairytale_nl,false,horseType_fairyTale,horseName_rapunzel,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // nl rapunzel
    "https://nl.howrse.com/elevage/chevaux/cheval?id=17473613": new Horse("https://nl.howrse.com/elevage/chevaux/cheval?id=17473613",egypt_nl,false,horseType_egypt,horseName_anubis), // nl anubis

    "https://www.howrse.se/elevage/chevaux/cheval?id=11021828": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=11021828",spice_se,false,horseType_spice,horseName_anise,familyDropType_spice,0),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10992842": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10992842",sherlockAdventures_se,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10978094": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10978094",fairytale_se,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0,false,undefined,false,undefined,false),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10978093": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10978093",spice_se,false,horseType_spice,horseName_cinnamon,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10926786": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10926786",[],false,horseType_dragon,horseName_kaiju),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10911926": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10911926",[pass_se],true,horseType_gemstone,horseName_ruby,dropType_pass,0),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10910776": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10910776",stellar_se,false,horseType_stellar,horseName_blueHypergiant,familyDropType_stellar,0,false,undefined,false,undefined,true),
    "https://www.howrse.se/elevage/chevaux/cheval?id=10887065": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10887065",[pass_se],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,0,undefined,true), // se gypse
    "https://www.howrse.se/elevage/chevaux/cheval?id=10876909": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10876909",sherlockAdventures_se,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,false,undefined,undefined,undefined,true),// apparently not sherlock holmes se wtf
    "https://www.howrse.se/elevage/chevaux/cheval?id=10876908": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10876908",japanese_se,false,horseType_japanese,horseName_yokai,undefined,undefined,false,undefined,undefined,undefined,true), // se yokai
    "https://www.howrse.se/elevage/chevaux/cheval?id=10864379": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10864379",[],false,horseType_alien,horseName_roptader), // se roptader
    "https://www.howrse.se/elevage/chevaux/cheval?id=10818175": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10818175",[],false,horseType_musketeer,horseName_athos), // se athos (??)
    "https://www.howrse.se/elevage/chevaux/cheval?id=10817706": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10817706",opal_se,false,horseType_gemstone,horseName_opal,dropType_pass,0,false,undefined,undefined,"#boutonCarotte",false,opalEndStrings_se), // se opal
    "https://www.howrse.se/elevage/chevaux/cheval?id=10770530": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10770530",egypt_se,false,horseType_egypt,horseName_ptah,undefined,undefined,false,undefined,undefined,undefined,true), // se ptah
    "https://www.howrse.se/elevage/chevaux/cheval?id=10770528": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10770528",fairytale_se,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // se jack
    "https://www.howrse.se/elevage/chevaux/cheval?id=10716323": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10716323",stellar_se,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // se r. riese
    "https://www.howrse.se/elevage/chevaux/cheval?id=10713032": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10713032",spice_se,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // se vanille
    "https://www.howrse.se/elevage/chevaux/cheval?id=10642650": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10642650",japanese_se,false,horseType_japanese,horseName_manekiNeko,undefined,undefined,false,undefined,undefined,undefined,true), // se maneki-neko
    "https://www.howrse.se/elevage/chevaux/cheval?id=10641574": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10641574",jade_se,true,horseType_gemstone,horseName_jade,dropType_pass,0), // se jade
    "https://www.howrse.se/elevage/chevaux/cheval?id=10591686": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10591686",maori_se,false,horseType_maori,horseName_rehua,familyDropType_maori,0), // se rehua
    "https://www.howrse.se/elevage/chevaux/cheval?id=10528437": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10528437",fairytale_se,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // se däumling
    "https://www.howrse.se/elevage/chevaux/cheval?id=10490067": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10490067",japanese_se,false,horseType_japanese,horseName_kigurumi), // se kigurumi
    "https://www.howrse.se/elevage/chevaux/cheval?id=10335881": new Horse("https://www.howrse.se/elevage/chevaux/cheval?id=10335881",egypt_se,false,horseType_egypt,horseName_anubis), // se nubi

    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9491631": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9491631",sherlockAdventures_en,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9482699": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9482699",fairytale_en,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0,false,undefined,false,undefined,false),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9482698": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9482698",spice_en,false,horseType_spice,horseName_cinnamon,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // uk cinnamon
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9477369": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9477369",fairytale_en,false,horseType_fairyTale,horseName_sleepingBeauty,familyDropType_fairyTale,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9445081": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9445081",maori_en,false,horseType_maori,horseName_rongo,familyDropType_maori,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9435385": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9435385",[],false,horseType_dragon,horseName_kaiju),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9435368": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9435368",japanese_en,false,horseType_japanese,horseName_samurai,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9419813": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9419813",[pass_en],true,horseType_gemstone,horseName_ruby,dropType_pass,0),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9417585": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9417585",[],false,horseType_mythological,horseName_hippocampus,dropType_mythological_hippocampus,0,false,undefined,false,undefined,true), // Hippocamp??
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9416280": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9416280",stellar_en,false,horseType_stellar,horseName_blueHypergiant,familyDropType_stellar,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9390918": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9390918",[pass_en],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,undefined,undefined,true), // uk gypse
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9381727": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9381727",sherlockAdventures_en,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,false,undefined,undefined,undefined,true), // uk sherlock holmes
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9380638": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9380638",fairytale_en,false,horseType_fairyTale,horseName_snowWhite,familyDropType_fairyTale,0,false,undefined,false,undefined,true),
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9380051": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9380051",japanese_en,false,horseType_japanese,horseName_yokai,undefined,undefined,false,undefined,undefined,undefined,true), // uk yokai
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9371818": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9371818",japanese_en,false,horseType_japanese,horseName_bonsai,undefined,undefined,false,undefined,undefined,undefined,true), // uk bonsai
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9359397": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9359397",[],false,horseType_alien,horseName_roptader), // uk roptader
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9322206",japanese_en,false,horseType_japanese,horseName_sushi,undefined,undefined,false,undefined,undefined,undefined,true), // uk sushi
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9307282": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9307282",opal_en,false,horseType_gemstone,horseName_opal,dropType_pass,0,false,undefined,undefined,"#boutonCarotte",false,opalEndStrings_en), // uk opal
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9306346": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9306346",amber_en,true,horseType_gemstone,horseName_amber,dropType_pass,0), // uk amber
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9260715": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9260715",fairytale_en,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // uk jack
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9247830",egypt_en,false,horseType_egypt,horseName_ptah,undefined,0,false,undefined,undefined,undefined,true), // uk ptah
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9184002",stellar_en,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // uk r. riese
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9180745",spice_uk_au,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // uk vanille
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9104405",japanese_en,false,horseType_japanese,horseName_manekiNeko,undefined,0,false,undefined,undefined,undefined,true), // uk maneki
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=9103715",jade_en,true,horseType_gemstone,horseName_jade,dropType_pass,0), // uk jade
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=8992215": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=8992215",fairytale_en,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true), // uk tom
    "https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937": new Horse("https://www.howrse.co.uk/elevage/chevaux/cheval?id=8943937",japanese_en,false,horseType_japanese,horseName_kigurumi), // uk kigu

    "https://www.howrse.com/elevage/chevaux/cheval?id=88439413": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88439413",spice_en,false,horseType_spice,horseName_anise,familyDropType_spice,0),
    "https://www.howrse.com/elevage/chevaux/cheval?id=88423256": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88423256",groom_en,false,horseType_metal,horseName_silver,familyDropType_metal,0),
    "https://www.howrse.com/elevage/chevaux/cheval?id=88297046": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88297046",japanese_en,false,horseType_japanese,horseName_kigurumi,undefined,0), 
    "https://www.howrse.com/elevage/chevaux/cheval?id=88155940": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88155940",sherlockAdventures_en,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=88024484": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88024484",egypt_en,false,horseType_egypt,horseName_seth,undefined,0,false,undefined,false,undefined,false),
    "https://www.howrse.com/elevage/chevaux/cheval?id=88013093": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88013093",fairytale_en,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0,false,undefined,false,undefined,false),
    "https://www.howrse.com/elevage/chevaux/cheval?id=88013092": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=88013092",spice_en,false,horseType_spice,horseName_cinnamon,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87938918": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87938918",fairytale_en,false,horseType_fairyTale,horseName_sleepingBeauty,familyDropType_fairyTale,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87774687": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87774687",japanese_en,false,horseType_japanese,horseName_sushi,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87437003": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87437003",[],false,horseType_dragon,horseName_kaiju),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87412216": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87412216",japanese_en,false,horseType_japanese,horseName_samurai,undefined,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87236940": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87236940",[pass_en],true,horseType_gemstone,horseName_ruby,dropType_pass,0),
    "https://www.howrse.com/elevage/chevaux/cheval?id=87198474": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=87198474",stellar_en,false,horseType_stellar,horseName_blueHypergiant,familyDropType_stellar,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=86891889": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86891889",[pass_en],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,0,undefined,true), // int gypse
    "https://www.howrse.com/elevage/chevaux/cheval?id=86830002": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86830002",japanese_en,false,horseType_japanese,horseName_yokai,undefined,0,false,undefined,undefined,undefined,true), // int yokai
    "https://www.howrse.com/elevage/chevaux/cheval?id=86776339": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86776339",sherlockAdventures_en,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,false,undefined,undefined,undefined,true),// int sherlock
    "https://www.howrse.com/elevage/chevaux/cheval?id=86768295": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86768295",fairytale_en,false,horseType_fairyTale,horseName_snowWhite,familyDropType_fairyTale,0,false,undefined,false,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=86607954": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86607954",[],false,horseType_alien,horseName_roptader), // int roptader
    "https://www.howrse.com/elevage/chevaux/cheval?id=86523091": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=86523091",agate_en,false,horseType_gemstone,horseName_agate,dropType_pass,0), // int achat
    "https://www.howrse.com/elevage/chevaux/cheval?id=85973517": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85973517",opal_en,false,horseType_gemstone,horseName_opal,dropType_pass,0,false,undefined,undefined,"#boutonCarotte",false,opalEndStrings_en), // int opal (?)
    "https://www.howrse.com/elevage/chevaux/cheval?id=85961694": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85961694",amber_en,true,horseType_gemstone,horseName_amber,dropType_pass,0), // int amber 2
    "https://www.howrse.com/elevage/chevaux/cheval?id=85550189": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85550189",fairytale_en,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // jack
    "https://www.howrse.com/elevage/chevaux/cheval?id=85530746": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=85530746",egypt_en,false,horseType_egypt,horseName_ptah,undefined,0,false,undefined,undefined,undefined,true), // int ptah
    "https://www.howrse.com/elevage/chevaux/cheval?id=84834452": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84834452",stellar_en,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // int r. riese
    "https://www.howrse.com/elevage/chevaux/cheval?id=84802141": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84802141",spice_en,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // int vanilla
    "https://www.howrse.com/elevage/chevaux/cheval?id=84298887": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84298887",groom_en,false,horseType_metal,horseName_osmium,familyDropType_metal), // int osmium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84293956": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84293956",groom_en,false,horseType_metal,horseName_gold,familyDropType_metal), // int gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=84279411": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84279411",groom_en,false,horseType_metal,horseName_scandium,familyDropType_metal), // int scandium
    "https://www.howrse.com/elevage/chevaux/cheval?id=84267650": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=84267650",groom_en,false,horseType_metal,horseName_roseGold,familyDropType_metal), // int rose gold
    "https://www.howrse.com/elevage/chevaux/cheval?id=83954706": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83954706",japanese_en,false,horseType_japanese,horseName_manekiNeko,undefined,0,false,undefined,undefined,undefined,true), // int maneki
    "https://www.howrse.com/elevage/chevaux/cheval?id=83952516": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83952516",jade_en,true,horseType_gemstone,horseName_jade,dropType_pass,0), // int jade
    "https://www.howrse.com/elevage/chevaux/cheval?id=83649165": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=83649165",amber_en,true,horseType_gemstone,horseName_amber,dropType_pass,0), // int amber 1
    "https://www.howrse.com/elevage/chevaux/cheval?id=82521123": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=82521123",fairytale_en,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,undefined,undefined,true),
    "https://www.howrse.com/elevage/chevaux/cheval?id=41425212": new Horse("https://www.howrse.com/elevage/chevaux/cheval?id=41425212",[],false,horseType_gemstone,horseName_onyx,dropType_pass,0), // int onyx

    "https://au.howrse.com/elevage/chevaux/cheval?id=4111634": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4111634",spice_en,false,horseType_spice,horseName_anise,familyDropType_spice,0),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4111276": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4111276",groom_en,false,horseType_metal,horseName_silver,familyDropType_metal,0),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4098311": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4098311",sherlockAdventures_en,false,horseType_sherlock,horseName_moriarty,undefined,0,false,undefined,false,undefined,true),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4091595": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4091595",fairytale_en,false,horseType_fairyTale,horseName_snowQueen,familyDropType_fairyTale,0,false,undefined,false,undefined,false),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4059082": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4059082",japanese_en,false,horseType_japanese,horseName_samurai),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4058694": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4058694",[],false,horseType_dragon,horseName_kaiju),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4047336": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4047336",[pass_en],true,horseType_gemstone,horseName_ruby,dropType_pass,0),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4043725": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4043725",stellar_en,false,horseType_stellar,horseName_blueHypergiant,familyDropType_stellar,0,false,undefined,false,undefined,true),
    "https://au.howrse.com/elevage/chevaux/cheval?id=4026275": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4026275",[pass_en,/Gypsum has just woken up/],true,horseType_gemstone,horseName_gypsum,dropType_pass,0,false,undefined,0,undefined,true), // au gypse
    "https://au.howrse.com/elevage/chevaux/cheval?id=4021104": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4021104",japanese_en,false,horseType_japanese,horseName_yokai,undefined,0,false,undefined,undefined,undefined,true), // au yokai
    "https://au.howrse.com/elevage/chevaux/cheval?id=4019626": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4019626",sherlockAdventures_en,false,horseType_sherlock,horseName_sherlockHolmes,undefined,0,undefined,0,false,undefined,undefined,undefined,true), // au sherlock
    "https://au.howrse.com/elevage/chevaux/cheval?id=4009381": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=4009381",[],false,horseType_alien,horseName_roptader), // au roptader
    "https://au.howrse.com/elevage/chevaux/cheval?id=3980162": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3980162",opal_en,false,horseType_gemstone,horseName_opal,dropType_pass,0,false,undefined,undefined,"#boutonCarotte",false,opalEndStrings_en), // au opal (?)
    "https://au.howrse.com/elevage/chevaux/cheval?id=3979756": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3979756",amber_en,true,horseType_gemstone,horseName_amber,dropType_pass,0), // au amber
    "https://au.howrse.com/elevage/chevaux/cheval?id=3958553": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3958553",fairytale_en,false,horseType_fairyTale,horseName_jack,familyDropType_fairyTale,0), // au jack
    "https://au.howrse.com/elevage/chevaux/cheval?id=3956336": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3956336",egypt_en,false,horseType_egypt,horseName_ptah,undefined,0,false,undefined,undefined,undefined,true), // au ptah
    "https://au.howrse.com/elevage/chevaux/cheval?id=3930161": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3930161",stellar_en,false,horseType_stellar,horseName_redGiant,familyDropType_stellar,0,false,undefined,undefined,undefined,true), // au red giant
    "https://au.howrse.com/elevage/chevaux/cheval?id=3929552": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3929552",spice_uk_au,false,horseType_spice,horseName_vanilla,familyDropType_spice,0,false,undefined,true,spicesButtonIdentifier,false), // au vanilla
    "https://au.howrse.com/elevage/chevaux/cheval?id=3919543": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3919543",skinfaxi_au,true,horseType_mythological,horseName_skinfaxi,dropType_mythological_skinfaxi,0,false,undefined,undefined,undefined,true), // au skinfaxi
    "https://au.howrse.com/elevage/chevaux/cheval?id=3914975": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3914975",chinese_en,true,horseType_chinese,horseName_pixiu,familyDropType_chinese,0,false,undefined,undefined,undefined,true), // au pixiu
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911813": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911813",groom_en,false,horseType_metal,horseName_gold,familyDropType_metal,0), // au gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3911451": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3911451",groom_en,false,horseType_metal,horseName_scandium,familyDropType_metal,0), // au scandium
    "https://au.howrse.com/elevage/chevaux/cheval?id=3910939": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3910939",groom_en,false,horseType_metal,horseName_roseGold,familyDropType_metal,0), // au rose gold
    "https://au.howrse.com/elevage/chevaux/cheval?id=3900809": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3900809",japanese_en,false,horseType_japanese,horseName_manekiNeko,undefined,0,false,undefined,false,undefined,true), // au maneki neko
    "https://au.howrse.com/elevage/chevaux/cheval?id=3854470": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3854470",stellar_en,false,horseType_stellar,horseName_yellowDwarf,familyDropType_stellar,0,false,undefined,false,undefined,true), // au yellow dwarf
    "https://au.howrse.com/elevage/chevaux/cheval?id=3838078": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3838078",fairytale_en,false,horseType_fairyTale,horseName_littleTomThumb,familyDropType_fairyTale,0,false,undefined,false,undefined,true), // au tom thumb
    "https://au.howrse.com/elevage/chevaux/cheval?id=3829117": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3829117",celtic_en,false,horseType_celtic,horseName_cernunnos,familyDropType_celtic,0,false,undefined,false,undefined,true), // au cernunnos
    "https://au.howrse.com/elevage/chevaux/cheval?id=3818348": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3818348",japanese_en,false,horseType_japanese,horseName_kigurumi), // au kigurumi
    "https://au.howrse.com/elevage/chevaux/cheval?id=3801726": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3801726",chinese_en,true,horseType_chinese,horseName_tianma,familyDropType_chinese,0,false,undefined,false,undefined,true), // au tianma
    "https://au.howrse.com/elevage/chevaux/cheval?id=3704043": new Horse("https://au.howrse.com/elevage/chevaux/cheval?id=3704043",[],false,undefined,"Mixed Chocolate, Grand Prix horse"), // au Mixed Chocolate für den GP 





    //, etc.
}


let currentHorse = $('.horse-name a[href]')[0].href;

if (horses[currentHorse]) {
    horses[currentHorse].setHorseAge();
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
function showNotification(notifDropAmount, notifDropType, notifDropSubType, notifTesting) {
    const notif = document.getElementById('my-extension-notification');
    notif.classList.remove('hide');
    notif.classList.add('show');
    notif.innerHTML = ""; // horse name?

    if (notifTesting) notif.innerHTML = notif.innerHTML + "[test] ";
    notif.innerHTML = notif.innerHTML + notifDropAmount + " x " + notifDropType;
    if (notifDropSubType) notif.innerHTML = notif.innerHTML + " ("+notifDropSubType+")";

    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('hide');
    }, 3000);
}

function showStatusNotification(whatthisisabout,whetheritworked) {
    const notif = document.getElementById('my-extension-notification');
    notif.classList.remove('hide');
    notif.classList.add('show');
    notif.innerHTML = ""; // horse name?

    notif.innerHTML = notif.innerHTML + whatthisisabout;
    if (whetheritworked) notif.innerHTML = notif.innerHTML + " erfolgreich"; else notif.innerHTML = notif.innerHTML + " fehlgeschlagen";

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






