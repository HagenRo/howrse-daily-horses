chrome.runtime.sendMessage({ function: "getAllDropData"}, (response) => {
            console.log("Response", response.result);
});
//TODO: neue datenbank anlegen, in der die kummulierte Statistik abgelegt ist, erzeugt im dataparser 
chrome.runtime.sendMessage({ function: "getDropInRange", indexName: 'timeStamp', lowerBound: 1766982467068}, (response) => {
    console.log("getDropInRange:", response.result);


});
/**
 * Hier werden die daten, die im horseLoggingobject gespeichert sind in Menschlesbare Informationen umgewandelt.
 */
class DataParser{

    //TODO: hier die member anpassen, anhand der Spalten und den anzeigetabellen.
    accumulatedStatisticExample = {
        lastDropTimestamp : null,//Zeitpunkt des zuletzt aufgenommenen drops.
        "<horseID>" : {
            horseURL : null, // zerlegen in domain und ID
            horseType : null, // Familienname
            horseName : null, // intern vereinheitlichten
            //dropAmount : null, // wird verrechnet zu Summe und Durchschnitt und auch letzter Drop Amount
            //dropType : null, // wird verwendet um die Mengen zuzuordnen im Fall von mehreren Droptypes
            //dropSubType : null, // japonais & sherlockAdventure: coloured tack
            //timeStamp : null,
            timeStampHumanReadable : null, // wird zu "letzter Drop Timestamp"
            dropHorseAge: null, // last drop horse age
            HorseAgeAtFirstDrop: null, //alter des pferdes, beim ersten verzeichnenten Drop
            HorseAgeAtWOY : null, // Water of Youth, alter als Wasser der Jugend auf das Pferd gekommen ist. Erstes Pferdealter mit ungeradem Monat minus 1.
            //amountClicks : 0, // amount of clicks used to finish horse // together with drop amount for spice horses

            displayDrops : {
                "<dropType>": {
                    dropType : null, // inklusive subtype! // kann der gesamtdroptype sein, kann aber auch aufgesplittet nach dropmenge sein // wird (genau) bei den spices erweitert durch amountClicks
                    dropAmountSum : null,
                    dropTypeAmountAverage : null, // average über nur die Male, wo dieser Type (unabhängig der Menge) gedropt wurde
                    dropAmountAverage : null, // average über alle Drops, die Menge für diesen Type
                    lastDropAmount : null,
                    lastDropType : null,
                    countDropType : null, // anzahl, wie oft dieser Droptype gedropt wurde - zählt für den Type, und auch zusätzlich abhängig von den möglichen Mengen // bei spices auch für amountClicks
                    countDrops : null, // anzahl der verrechneten Drops für diesen dropType zur berechnung des Averages
                    averageDropRateByHorseAge : null, //wird berechnet this.dropHorseAge - HorseAgeAtFirstDrop / countDrops //verrechnung von aler ist abhängig von wasser der jugend Alter HorseAgeAtWOY

                }
            }
        }
        
    }

    drops;
    accumulatedStatistic;
    //hier vermulich auch gleich filtern was in welchem tab angezeigt werden soll in unterschiedliche arrays
    constructor(horseLoggingObjects, accumulatedStatistic){
        this.drops = horseLoggingObjects;
        this.accumulatedStatistic = accumulatedStatistic?accumulatedStatistic:horseDisplayObject;
        this.#accumulateDrops();
    }

    /**
     * Durchläuft alle Drops in horseLoggingObjects und rechnet sie auf die accumulatedStatistic auf.
     */
    #accumulateDrops(){
        thisdrops.forEach(drop => {
            let horseID = this.#getHorseID(drop.horseURL);
            let displayDropTypes = this.#getDisplayDropTypes(drop.dropType, drop.dropSubType, drop.dropAmount, drop.amountClicks)

            horseStatistic = accumulatedStatistic[horseID];
            //TODO: übergreifende horse eigenschaften befüllen

            displayDropTypes.forEach(displayDropType => {

                dropStatistic = horseStatistic.displayDrops[displayDropType];

                //TODO: hier müssen jetzt die berechnungen rein die die statistic updaten.
            });
            
            
        });
    }
    #getHorseID(url){
        //TODO
        return horseID;
    }
    /**
     * Generates a list of drop types based on the given parameters.
     *
     * @param {string} dropType - The type of the drop 
     * @param {string} dropSubType - The subtype of the drop
     * @param {number} dropAmount - The amount of the drop
     * @param {number} amountClicks - The number of clicks or interactions required for the drop.
     * @returns {Array} newDropTypes - A collection of the drop types based on the input parameters.
     */
    #getDisplayDropTypes(dropType, dropSubType, dropAmount, amountClicks){
        let newDropTypes = [];

        newDropTypes.push(""+dropType);
        newDropTypes.push(""+dropType+" | "+dropAmount);
        if (dropSubType) {
            newDropTypes.push(""+dropType+" | "+dropSubType);
            newDropTypes.push(""+dropType+" | "+dropSubType+" | "+dropAmount);

            if (amountClicks>0) {
                newDropTypes.push(""+dropType+" | "+dropSubType+" | "+amountClicks);
                newDropTypes.push(""+dropType+" | "+dropSubType+" | "+amountClicks+" | "+dropAmount);
            }

        }else{
            if (amountClicks>0) {
                newDropTypes.push(""+dropType+" | "+amountClicks);
                newDropTypes.push(""+dropType+" | "+amountClicks+" | "+dropAmount);
            }
        }

        return newDropTypes;
    }




}