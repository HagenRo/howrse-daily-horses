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
                    dropAmountSum : null, // 
                    dropTypeAmountAverage : null, // average über nur die Male, wo dieser Type (unabhängig der Menge) gedropt wurde (bsp: 79 von 380 Drops waren irgendwelche Mengen an Apfelsamen)
                    dropAmountAverage : null, // average über alle Drops, die Menge für diesen Type (bsp: insgesamt gab es etwa 1 AP pro Tag, obwohl auch andere dinge gedropt werden)
                    lastDropAmount : null,
                    lastDropType : null,
                    countDropType : null, // anzahl, wie oft dieser Droptype gedropt wurde - zählt für den Type, und auch zusätzlich abhängig von den möglichen Mengen // bei spices auch für amountClicks
                    countDrops : null, // anzahl der verrechneten Drops für diesen dropType zur berechnung des Averages
                    averageDropRateByHorseAge : null, //wird berechnet this.dropHorseAge - HorseAgeAtFirstDrop / countDrops //verrechnung von alter ist abhängig von wasser der jugend Alter HorseAgeAtWOY

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
            // erst mal davon ausgehen, dass man es neu anlegt - logik für modifizieren und zusammenführen machen wir später
            // alle Sachen zu dem generellen Pferd: horse-URL zerlegen in domain und ID, Familienname, Pferdename, zeitpunkt letzter drop, 
            // alles was bei horseID steht oben, wird hier befüllt
            // horseStatistic.horseURL; 
            horseStatistic.horseType = drop.horseType;
            horseStatistic.horseName = drop.horseName;
            horseStatistic.timeStampHumanReadable = drop.timeStampHumanReadable;
            horseStatistic.dropHorseAge = drop.dropHorseAge;
            horseStatistic.HorseAgeAtFirstDrop = horseStatistic.HorseAgeAtFirstDrop ? horseStatistic.HorseAgeAtFirstDrop : drop.dropHorseAge;
            // horseStatistic.HorseAgeAtWOY = ; // auslagern schätze ich // falls 
            if (horseStatistic.HorseAgeAtFirstDrop[1]%2 == 1) {
                horseStatistic.HorseAgeAtWOY = horseStatistic.HorseAgeAtFirstDrop;
            } else if (horseStatistic.dropHorseAge[1]%2 == 1) {
                horseStatistic.HorseAgeAtWOY = horseStatistic.dropHorseAge;
                horseStatistic.HorseAgeAtWOY[1] = horseStatistic.HorseAgeAtWOY[1]-1;
            } // or just no WOY, idk how we want to stoe this information


            displayDropTypes.forEach(displayDropType => {

                dropStatistic = horseStatistic.displayDrops[displayDropType];

                //TODO: hier müssen jetzt die berechnungen rein die die statistic updaten.
                // alles was bei <dropType> steht, soll hier gebastelt werden

                dropStatistic.dropType = drop.dropAmount + drop.dropType; // überlegen, wie wir die trennen wollen
                if (drop.dropSubType) {
                    dropStatistic.dropType = dropStatistic.dropType + " " + drop.dropSubType;
                }
                // was wenn drop.dropAmount kein int ist weil wir was übersehen haben. abfangen?
                dropStatistic.dropAmountSum = dropStatistic.dropAmountSum ? dropStatistic.dropAmountsum + drop.dropAmount : drop.dropAmount;
                //dropStatistic.lastDropAmount = drop.dropAmount; //?
                //dropStatistic.lastDropType = drop.dropSubType? drop.dropType + drop.dropSubType : drop.dropType; // ?
                dropStatistic.countDropType = dropStatistic.countDropType? dropStatistic.countDropType + 1 : 1;
                dropStatistic.countDrops = dropStatistic.countDrops? dropStatistic.countDrops + 1 : 1;
                //dropStatistic.dropAmountAverage = dropStatistic.; // ich hab keine ahnung wo wir die nötigen Daten haben
                // ^ dropAmountAverage klingt nach (Menge gedropter Äpfel) / (Anzahl wie oft dieser obertyp ("n Äpfel") gedropt wurde) oder evtl. durch Anzahl drops insgesamt
                //dropStatistic.dropTypeAmountAverage = dropStatistic.countDropType / dropStatistic.countDrops ;
                dropStatistic.averageDropRateByHorseAge = (horseStatistic.dropHorseAge - horseStatistic.HorseAgeAtFirstDrop) / countDrops
            });
            
            
        });
    }
    #getHorseID(url){
        //TODO
        horseID = url.match(/.+\?id=(\d+)/);
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

    /**
     * Will calculate the second age minus the first age in howrse terms
     * @param {*} firstAge - when the horse was younger
     * @param {*} secondAge - when it grew older 
     * @param {*} ageAtWOY - optional, in case the horse received Water Of Youth at some point
     */
    #getHorseAgeDiff(firstAge,secondAge,ageAtWOY) {
        //
        let ageings = 0; 
        if (!ageAtWOY) {
            ageings = (secondAge[0]-firstAge[0])*6 + (secondAge[1]-firstAge[1])/2; 
        }
    }


}