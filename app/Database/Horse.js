class Horse{
    //attributes
    url; // version für reset timer inklusive
    searchStrings = []; // gonna be some regex stuff
    isReadyOnWakeup;
    valueIfStringNotFound; // value // bonus, 0 // on wakeup except pluto
    isUnimportant; // die kann ich hinzufügen, sodass sie geloggt (?) werden, wenn ich sie bespiele, aber sie tauchen nicht in der Liste der "TODO HEUTE DRINGEND" tiere auf
    isExemption; // exception // is pluto
    exemptionFunction; // in case you are an EXEMPTION
    amountRequiredClicks; // maximum amount of required clicks to finish horse; usually 1? // on some button
    defaultType; // drop type if nothing found (Bonus for chinese) // TODO: add to constructor 
    defaultAmount; // drop amount if nothing found (1 Bonus for chinese) // TODO: add to constructor
    buttonIdentifier; // String, Klasse, ID, die den Button eindeutig identifiziert, nachdem ein Pferd keine Drop mehr durchführen kann an dem Tag. //TODO: in Konstruktorsignatur hinzufügen
    isAsleep; // "nur so mit semi" - eigentlich in chrome local storage schreiben weil wirs zwischen sessions brauchen?

    horseLoggingObject = {
        horseURL,
        horseType,
        horseName, // intern vereinheitlichten
        dropAmount,
        dropType,
        dropSubType, // japanese: coloured tack
        timeStamp,
        timeStampHumanReadable,
        amountClicks, // amount of clicks used to finish horse // together with drop amount for spice horses
    }

    constructor(url,searchStrings,isReadyOnWakeup,valueIfStringNotFound,horseType,horseName,isExemption,exemptionFunction,amountRequiredClicks,defaultType,defaultAmount,buttonIdentifier,isUnimportant){
        this.url = url;
        this.searchStrings = searchStrings; // which regex expressions we're looking for
        this.isReadyOnWakeup = isReadyOnWakeup; // whether the message will be there when the horse wakes up
        this.valueIfStringNotFound = valueIfStringNotFound;
        this.isExemption = isExemption; // like Onyx with the UFOs or Pluto, with a message that doesn't trigger at one specific point in time
        this.exemptionFunction = exemptionFunction; // how to work this exemption
        this.amountRequiredClicks = amountRequiredClicks;
        this.defaultType = defaultType;
        this.defaultAmount = defaultAmount;
        this.buttonIdentifier = buttonIdentifier;
        this.isUnimportant = isUnimportant;
        //

        this.horseLoggingObject.horseURL = url;
        this.horseLoggingObject.horseType = horseType; 
        this.horseLoggingObject.horseName = horseName; // von howrse gesetzter internationaler name
        this.horseLoggingObject.dropAmount = this.defaultAmount;
        this.horseLoggingObject.dropType = this.defaultType;
        this.horseLoggingObject.amountClicks = this.amountRequiredClicks;

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
        //TODO: onLoad prüfen ob reitzentrum heute ausläuft -> wenn ja dann speichern, das sleep bu
        //TODO: hier muss geprüft werden, ob an diesem tag schon ein eintrag geschrieben wurde 
        let timeStamp = window.localStorage.getItem(this.url);
        //damit dann die berechnung machen mithilfe des reset objekts
        let yesterdayyyyyy = new Date().setDate(new Date().getDate() - 1);
        // letzter timestamp
        // letztes howrse reset = resetzeit + url
        // jetzt
        // timestamp - howsrereset < 0
        // falls (gestern und (jetzt < resetzeit)) oder ((heute und vor resetzeit) und (jetzt > resetzeit))
        // oder man kopiert einfach deine magie aus popup.js
        if (timeStamp && new Date(timeStamp) - new Date()) {

        }

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
// kann eventuell ersetzt werden mithilfe der childlistoption von MutationObserver

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
// kann ersetzt werden mithilfe der childlistoption von MutationObserver

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

    #onSleep(){
        //wenn wiesensymbol kommt ist alles gut
        //wenn box kommt muss man noch schauen, wenn der reset schon war und das datum heute ist ist böse
        // check whether sleep button was pressed AND whether it will be in an EC if required ! 
        // now + timer > end date?

        //MutationObserver API anschauen um dom elemente zu beobachten ob sich css klassen ändern 
        // // $(document).on('click', '#boutonCoucher.action.action-style-4.coucher', function () {


        // //     setTimeout(function() {
        // //         //hier kann geprüft werden, welches icon der button jetzt bekommen hat, und ob das reitzentrum heute noch auslaufen wird
        // //         console.log($('#boutonCoucher'))
        // //         //entsprechend in den localStorage schreiben, dass heute das pferd erfolgreich schlafen gelegt wurde

        // //     }, 500);
        // //     // nachschauen wann sich das hier drauf registriert ob up oder down; da man evtl. die änderung des buttons dann schon einlesen könnte
        // // });
        
        let sleepButtonParent = $('#night-body-content')[0];
        const callback = (mutationRecords) => {
            console.log(mutationRecords);
            mutationRecords.forEach( mutationRecord => {
                if (mutationRecord.type === 'childList') {
                    mutationRecord.addedNodes.forEach( addedNode => {
                        $(addedNode).find('#boutonCoucher');
                        // hier schauen ob das element da ist 
                        //prüfen nach klasse ob wiese oder box
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

        observer.observe(sleepButtonParent, {subtree: true, childList: true});
        //funktioniert irgendwie nicht, da der button werder verändert noch gelöscht oder replaced wird



    }

    //wird vom script aus aufgerufen
    check(){
        this.#onSleep()
        if (this.isReadyOnWakeup) {
            this.#onWakeup();
        }
        else{
            this.#onClick();
        }
    }

}