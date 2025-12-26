chrome.runtime.sendMessage({ function: "getAllDropData"}, (response) => {
            console.log("Response", response.result);


        });

/**
 * Hier werden die daten, die im horseLoggingobject gespeichert sind in Menschlesbare Informationen umgewandelt.
 */
class DataParser{

    //TODO: hier die member anpassen, anhand der Spalten und den anzeigetabellen.
    horseDisplayObject = {
        horseURL : null,
        horseType : null, // Familienname
        horseName : null, // intern vereinheitlichten
        dropAmount : null,
        dropType : null,
        dropSubType : null, // japanese: coloured tack
        timeStamp : null,
        timeStampHumanReadable : null,
        dropHorseAge: null,
        amountClicks : 0, // amount of clicks used to finish horse // together with drop amount for spice horses
    }

    horseLoggingObjects;
    horseDisplayObjects;
    //hier vermulich auch gleich filtern was in welchem tab angezeigt werden soll in unterschiedliche arrays
    constructor(horseLoggingObjects){
        this.horseLoggingObjects = horseLoggingObjects;
    }
}