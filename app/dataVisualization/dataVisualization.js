chrome.runtime.sendMessage({ function: "getAllDropData"}, (response) => {
            console.log("Response", response.result);
            let dataParser = new DataParser(response.result);
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
        dropDeltaTimestamp : null,//Zeitpunkt des zuletzt aufgenommenen drops.
        "<horseURL>" : {
            horseDomain : null, // aus der URL ausgelesen
            horseID : null, // aus der URL ausgelesen
            horseType : null, // Familienname
            horseName : null, // intern vereinheitlichten
            //dropAmount : null, // wird verrechnet zu Summe und Durchschnitt und auch letzter Drop Amount
            //dropType : null, // wird verwendet um die Mengen zuzuordnen im Fall von mehreren Droptypes
            //dropSubType : null, // japonais & sherlockAdventure: coloured tack
            //timeStamp : null,
            lastDropTimeStamp : null, // wird zu "letzter Drop Timestamp"
            lastDropHorseAge: null, // last drop horse age
            HorseAgeAtFirstDrop: null, //alter des pferdes, beim ersten verzeichnenten Drop
            HorseAgeAtWOY : null, // Water of Youth, alter als Wasser der Jugend auf das Pferd gekommen ist. Erstes Pferdealter mit ungeradem Monat minus 1.
            //amountClicks : 0, // amount of clicks used to finish horse // together with drop amount for spice horses
            lastDropAmount : null,
            lastDropType : null,
            countDrops : null, // anzahl der verrechneten Drops für diesen dropType zur berechnung des Averages
            dropAmountAverage : null, // average über alle Drops, die Menge für diesen Type (bsp: insgesamt gab es etwa 1 AP pro Tag, obwohl auch andere dinge gedropt werden)

            displayDrops : {
                "<dropType>": {
                    dropType : null, // inklusive subtype! // kann der gesamtdroptype sein, kann aber auch aufgesplittet nach dropmenge sein // wird (genau) bei den spices erweitert durch amountClicks
                    dropAmountSum : null, // 
                    dropTypeAmountAverage : null, // average über nur die Male, wo dieser Type (unabhängig der Menge) gedropt wurde (bsp: 79 von 380 Drops waren irgendwelche Mengen an Apfelsamen)
                    countDropType : null, // anzahl, wie oft dieser Droptype gedropt wurde - zählt für den Type, und auch zusätzlich abhängig von den möglichen Mengen // bei spices auch für amountClicks
                    averageDropRateByHorseAge : null, // countDrops / wird berechnet lastDropHorseAge - HorseAgeAtFirstDrop //verrechnung von alter ist abhängig von wasser der jugend Alter HorseAgeAtWOY
                }
            }
        }
        
    }

    drops;
    accumulatedStatistic;
    //hier vermulich auch gleich filtern was in welchem tab angezeigt werden soll in unterschiedliche arrays
    constructor(horseLoggingObjects, accumulatedStatistic){
        this.drops = horseLoggingObjects;
        this.accumulatedStatistic = accumulatedStatistic?accumulatedStatistic:{};
        this.#accumulateDrops();
        console.log("acc.Statistic: ", this.accumulatedStatistic);
    }

    /**
     * Durchläuft alle Drops in horseLoggingObjects und rechnet sie auf die accumulatedStatistic auf.
     */
    #accumulateDrops(){
        this.drops.forEach(drop => {
            // horse domain
            let horseURL = drop.horseURL;
            let displayDropTypes = this.#getDisplayDropTypes(drop.dropType, drop.dropSubType, drop.dropAmount, drop.amountClicks)

            let horseStatistic = this.accumulatedStatistic[horseURL];
            let thisIsANewEntry = false;
            // falls sie nicht existiert: anlegen
            if (!horseStatistic) {
                horseStatistic = {};
                horseStatistic.displayDrops ={};
                thisIsANewEntry = true;

                // nur beim anlegen
                horseStatistic.horseDomain = this.#getHorseDomain(drop.horseURL);
                horseStatistic.horseID = this.#getHorseID(drop.horseURL);
                horseStatistic.horseType = drop.horseType;
                horseStatistic.horseName = drop.horseName;
            }
            // falls existent bzw. ansonsten danach: updaten

            //TODO: übergreifende horse eigenschaften befüllen
            // erst mal davon ausgehen, dass man es neu anlegt - logik für modifizieren und zusammenführen machen wir später
            // alle Sachen zu dem generellen Pferd: horse-URL zerlegen in domain und ID, Familienname, Pferdename, zeitpunkt letzter drop, 
            // alles was bei horseID steht oben, wird hier befüllt
            // horseStatistic.horseDomain = ;


            // beim updaten - vermutlich, wenn ich nix übersehen habe
            if (this.#horseAgeIsLessThan(horseStatistic.lastDropHorseAge,drop.dropHorseAge)) {
                horseStatistic.lastDropTimeStamp = drop.timeStampHumanReadable;
                horseStatistic.lastDropHorseAge = drop.dropHorseAge; // falls größer, falls Drop überhaupt neu
                horseStatistic.HorseAgeAtFirstDrop = horseStatistic.HorseAgeAtFirstDrop ? horseStatistic.HorseAgeAtFirstDrop : drop.dropHorseAge;
                horseStatistic.lastDropAmount = drop.dropAmount; 
                horseStatistic.lastDropType = this.#getDisplayDropTypes(drop.dropType, drop.dropSubType, drop.dropAmount, drop.amountClicks);
            }
            // falls drophorseage niedriger ist als letzter drop, müssen wir evtl. horseageatfirstdrop anpassen
            horseStatistic.HorseAgeAtFirstDrop = this.#horseAgeIsLessThan(horseStatistic.HorseAgeAtFirstDrop,drop.dropHorseAge) ? horseStatistic.HorseAgeAtFirstDrop : drop.dropHorseAge;

            // handle water of youth
            if (drop.dropHorseAge[1]%2 == 1) {
                horseStatistic.HorseAgeAtWOY = this.#horseAgeIsLessThan(horseStatistic.HorseAgeAtWOY,drop.dropHorseAge) ? horseStatistic.HorseAgeAtWOY : [drop.dropHorseAge[0],drop.dropHorseAge[1]-1];
            }

            horseStatistic.countDrops = horseStatistic.countDrops? parseInt(horseStatistic.countDrops) + 1 : 1;
            horseStatistic.dropAmountAverage = horseStatistic.dropAmountAverage? parseFloat(horseStatistic.dropAmountAverage) + 1 : 1; 

            //console.log("displayDropTypes", displayDropTypes);

            displayDropTypes.forEach(displayDropType => {
                let dropStatistic = horseStatistic.displayDrops[displayDropType];
                let thisIsANewDropStat = false;

                // wenn dropstatistic nicht existiert: neuen anlegen etc. wie oben basically
                if (!dropStatistic) {
                    dropStatistic = {};
                    thisIsANewDropStat = true;
                    dropStatistic.dropType = displayDropType; 
                }


                //TODO: hier müssen jetzt die berechnungen rein die die statistic updaten.
                // alles was bei <dropType> steht, soll hier gebastelt werden

                dropStatistic.dropAmountSum = dropStatistic.dropAmountSum ? parseInt(parseInt(dropStatistic.dropAmountSum) + parseInt(drop.dropAmount)) : drop.dropAmount; // 1x 35 Apfelsamen wären dann +35.
                dropStatistic.countDropType = dropStatistic.countDropType? parseInt(parseInt(dropStatistic.countDropType) + 1) : 1;
                // ^ dropAmountAverage klingt nach (Menge gedropter Äpfel) / (Anzahl wie oft dieser obertyp ("n Äpfel") gedropt wurde) oder evtl. durch Anzahl drops insgesamt
                dropStatistic.dropTypeAmountAverage = parseFloat(dropStatistic.countDropType / dropStatistic.dropAmountSum);
                dropStatistic.averageDropRateByHorseAge = parseFloat(dropStatistic.countDropType / this.#subtractHorseAges(horseStatistic.lastDropHorseAge,horseStatistic.HorseAgeAtFirstDrop));

                if (thisIsANewDropStat) {
                    horseStatistic.displayDrops[displayDropType] = dropStatistic;
                }
            });
            
            if (thisIsANewEntry) { // falls nicht existent war
                this.accumulatedStatistic[horseURL] = horseStatistic;// ganz am Ende nochmal, beim ersten erstellen
            }
        });
    }

    #getHorseDomain(url){
        //
        let horseDomain = url.match(/https:\/\/(.+)\/elevage.+/)[1];
        // console.log("horseDomain",horseDomain);
        return horseDomain;
    }

    #getHorseID(url){
        //TODO
        let horseID = url.match(/.+\?id=(\d+)/)[1];
        // console.log("horseID", horseID);
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
                newDropTypes.push(""+dropType+" | "+amountClicks); // ist das überhaupt sinnvoll? 
                newDropTypes.push(""+dropType+" | "+amountClicks+" | "+dropAmount); // order tauschen?
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

    /**
     * determines, whether the first age is less than the second age, i.e. whether they are "in order"
     * @param {*} firstAge 
     * @param {*} secondAge 
     * @returns {Boolean} true or false
     */
    #horseAgeIsLessThan(firstAge,secondAge) {
        // kann man kürzen
        if (!firstAge) {
            return true;
        }
        if (!secondAge) {
            return false;
        }
        if (parseInt(firstAge[0]) > parseInt(secondAge [0])) {
            return false;
        } 
        else if (parseInt(firstAge[0]) < parseInt(secondAge[0])) {
            return true;
        }
        else if (parseInt(firstAge[1]) < parseInt(secondAge[1])) {
            return true;
        }
        return false; // else
    }

    /**
     * calculates (firstage - secondage). Currently without WoY.
     * @param {*} firstAge 
     * @param {*} secondAge 
     * @param {*} ageAtWOY 
     * @returns {Int} amount of ageings between these two numbers
     */
    #subtractHorseAges(firstAge,secondAge,ageAtWOY) {
        let yearDiff = 0;
        let monthDiff = 0;
        let totalDiffInAgeings = 0;
        if (!ageAtWOY) {
            yearDiff = firstAge[0]-secondAge[0];
            monthDiff = firstAge[1]-secondAge[1];
            totalDiffInAgeings = yearDiff * 6 + parseInt(monthDiff/2);
        }
        return parseInt(totalDiffInAgeings);
    }


}