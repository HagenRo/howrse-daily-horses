chrome.runtime.sendMessage({ function: "getAllDropData"}, (response) => {
            console.log("Response", response.result);
});

chrome.runtime.sendMessage({ function: "getDropInRange", indexName: 'timeStamp', lowerBound: 1766982467068}, (response) => {
    console.log("getDropInRange:", response.result);


});
/**
 * Hier werden die daten, die im horseLoggingobject gespeichert sind in Menschlesbare Informationen umgewandelt.
 */
class DataParser{

    //TODO: hier die member anpassen, anhand der Spalten und den anzeigetabellen.
    horseDisplayObject = {
        horseURL : null, // zerlegen in domain und ID
        horseType : null, // Familienname
        horseName : null, // intern vereinheitlichten
        //dropAmount : null, // wird verrechnet zu Summe und Durchschnitt und auch letzter Drop Amount
        //dropType : null, // wird verwendet um die Mengen zuzuordnen im Fall von mehreren Droptypes
        //dropSubType : null, // japonais & sherlockAdventure: coloured tack
        //timeStamp : null,
        timeStampHumanReadable : null, // wird zu "letzter Drop Timestamp"
        dropHorseAge: null, // last drop horse age
        //amountClicks : 0, // amount of clicks used to finish horse // together with drop amount for spice horses

        displayDrops : [
            {
                dropType : null, // inklusive subtype! // kann der gesamtdroptype sein, kann aber auch aufgesplittet nach dropmenge sein // wird (genau) bei den spices erweitert durch amountClicks
                dropAmountSum : null,
                dropTypeAmountAverage : null, // average über nur die Male, wo dieser Type (unabhängig der Menge) gedropt wurde
                dropAmountAverage : null, // average über alle Drops, die Menge für diesen Type
                lastDropAmount : null,
                lastDropType : null,
                countDropType : null, // anzahl, wie oft dieser Droptype gedropt wurde - zählt für den Type, und auch zusätzlich abhängig von den möglichen Mengen // bei spices auch für amountClicks
            }
        ]
    }

    horseLoggingObjects;
    horseDisplayObjects;
    //hier vermulich auch gleich filtern was in welchem tab angezeigt werden soll in unterschiedliche arrays
    constructor(horseLoggingObjects){
        this.horseLoggingObjects = horseLoggingObjects;
    }
}