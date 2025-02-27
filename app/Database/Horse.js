class Horse{
    //attributes
    url; // version für reset timer inklusive
    searchStrings = []; // gonna be some regex stuff
    isReadyOnWakeup;
    valueIfStringNotFound; // value // bonus, 0 // on wakeup except pluto
    isUnimportant;
    isExemption; // exception // is pluto
    exemptionFunction; // in case you are an EXEMPTION
    buttonIdentifier; // String, Klasse, ID, die den Button eindeutig identifiziert, nachdem ein Pferd keine Drop mehr durchführen kann an dem Tag. //TODO: in Konstruktorsignatur hinzufügen
    amountRequiredClicks; // maximum amount of required clicks to finish horse; usually 1? // on some button
    defaultType; // drop type if nothing found (Bonus for chinese) // TODO: add to constructor 
    defaultAmount; // drop amount if nothing found (1 Bonus for chinese) // TODO: add to constructor

    horseLoggingObject = {
        horseURL,
        horseType,
        horseName, // intern vereinheitlichten
        dropAmount,
        dropType,
        dropSubType, // japanese: coloured tack
        timeStamp,
        timeStampHumanReadable,
        amountClicks // amount of clicks used to finish horse // together with drop amount for spice horses
    }

    constructor(url,searchStrings,isReadyOnWakeup,valueIfStringNotFound,isUnimportant,isExemption,exemptionFunction){
        this.url = url;
        this.searchStrings = searchStrings; // which regex expressions we're looking for
        this.isReadyOnWakeup = isReadyOnWakeup; // whether the message will be there when the horse wakes up
        this.valueIfStringNotFound = valueIfStringNotFound;
        this.isUnimportant = isUnimportant;
        this.isExemption = isExemption; // like Onyx with the UFOs or Pluto, with a message that doesn't trigger at one specific point in time
        this.exemptionFunction = exemptionFunction; // how to work this exemption
        //

        this.horseLoggingObject.horseURL = url;
        this.horseLoggingObject.horseType = horseType; //TODO: in methodensignatur hinzufügen
        this.horseLoggingObject.horseName = horseName; //TODO: in methodensignatur hinzufügen

    }

    #saveHorseDropToDB(){
        chrome.runtime.sendMessage({ function: "saveHorseDropToDB", horseLoggingObject: horseLoggingObject}, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
            //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.

            //wenn wir einen eintrag in die Datenbank schreiben, dann wollen wir einen timeStamp setzen, anhand dessen wir ermitteln können, ob dieses pferd schon abgehandelt ist oder nicht.
            window.localStorage.setItem(url, this.horseLoggingObject.timeStamp);

            console.log(response);
        });
    }

    #onWakeup(){
        //TODO: hier muss geprüft werden, ob an diesem tag schon ein eintrag geschrieben wurde
        //item = window.localStorage.getItem(this.url);
        //damit dann die berechnung machen mithilfe des reset objekts

        let horseTimeLines = [];
        $('#history-0 .grid-cell.last').each(function() {
            // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
            horseTimeLines.push($(this).text().trim());
        });

        let ergebnis = [];
        horseTimeLines.forEach(timeLine => {
            searchStrings.forEach(searchString => {
                ergebnis = timeLine.match(searchString)?timeLine.match(searchString):ergebnis; 
            });
        });
        if (ergebnis) {
            let date = new Date();
            this.horseLoggingObject.timeStamp = date.getTime();
            this.horseLoggingObject.timeStampHumanReadable = date.toISOString()

            this.horseLoggingObject.dropAmount = ergebnis[1];
            //hier muss manchmal noch der typ ermittelt werden.
            //mal schauen, wie man das coden kann, dass man keine ausnamefälle betrachten muss.
            this.#saveHorseDropToDB();
        } else {
            // default eintrag schreiben
        }
    }

    #onClick(){
        $(document).on('click', function () {
            //TODO: hier muss geprüft werden, ob an diesem tag schon ein eintrag geschrieben wurde
            //item = window.localStorage.getItem(this.url);
            //damit dann die berechnung machen mithilfe des reset objekts

            let horseTimeLines = [];
            $('#history-0 .grid-cell.last').each(function() {
                // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
                horseTimeLines.push($(this).text().trim());
            });
    
            let ergebnis = [];
            horseTimeLines.forEach(timeLine => {
                searchStrings.forEach(searchString => {
                    ergebnis = timeLine.match(searchString)?timeLine.match(searchString):ergebnis; 
                });
            });
            if (ergebnis) {
                let date = new Date();
                this.horseLoggingObject.timeStamp = date.getTime();
                this.horseLoggingObject.timeStampHumanReadable = date.toISOString()

                this.horseLoggingObject.dropAmount = ergebnis[1];
                //hier muss manchmal noch der typ ermittelt werden.
                //mal schauen, wie man das coden kann, dass man keine ausnamefälle betrachten muss.
                this.#saveHorseDropToDB();
            }
        });

        $(document).on('click', this.buttonIdentifier, function () {
            //TODO: hier muss geprüft werden, ob an diesem tag schon ein eintrag geschrieben wurde
            //item = window.localStorage.getItem(this.url);
            //damit dann die berechnung machen mithilfe des reset objekts

            // hochzählen einer variable, wie oft auf den button geklickt wurde
            // nachfolgenden code nur ausführen, wenn diese variable >= mein maximum ist
            // ? wie ist das wenn ich beim letzten draufklicken was werfe? checken, ob meine onclick methoden in sinnvoller reihenfolge ausgeführt werden 
            // auch die anzahl an klicks speichern
            // wenn klicks erreicht wird der leere eintrag geschrieben

            let date = new Date();
            this.horseLoggingObject.timeStamp = date.getTime();
            this.horseLoggingObject.timeStampHumanReadable = date.toISOString()

            this.horseLoggingObject.dropAmount = 0; // TODO: nicht 0, sondern default
            //hier muss manchmal noch der typ/subtyp ermittelt werden.
            //mal schauen, wie man das coden kann, dass man keine ausnamefälle betrachten muss.
            this.#saveHorseDropToDB();
        });

    }

    //wird vom script aus aufgerufen
    check(){
        if (this.isReadyOnWakeup) {
            this.#onWakeup();
        }
        else{
            this.#onClick();
        }
    }

}