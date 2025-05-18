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
        horseURL : null,
        horseType : null,
        horseName : null, // intern vereinheitlichten
        dropAmount : null,
        dropType : null,
        dropSubType : null, // japanese: coloured tack
        timeStamp : null,
        timeStampHumanReadable : null,
        amountClicks : null, // amount of clicks used to finish horse // together with drop amount for spice horses
    }

    popupHorseObject = {
        horseName : null,
        horseURL : null,
        sleepTimestamp : null,
        dropTimestamp : null,
        showInPopup : null
    }

    constructor(url,searchStrings,isReadyOnWakeup,valueIfStringNotFound,horseType,horseName,isExemption,exemptionFunction,amountRequiredClicks,defaultType,defaultAmount,buttonIdentifier,isUnimportant){
        this.url = url;
        this.searchStrings = searchStrings; // which regex expressions we're looking for
        console.log(searchStrings);
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

        this.popupHorseObject.horseName = horseName;
        this.popupHorseObject.horseURL = url;
        this.popupHorseObject.showInPopup = !isUnimportant;
        console.log(url);

        chrome.runtime.sendMessage({ function: "addOrUpdatePopupHorseToDB", popupHorseObject: this.popupHorseObject}, (response) => {
            console.log(response);
        });
    }

    #saveHorseDropToDB(){
        chrome.runtime.sendMessage({ function: "saveHorseDropToDB", horseLoggingObject: this.horseLoggingObject}, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
            //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.

            //wenn wir einen eintrag in die Datenbank schreiben, dann wollen wir einen timeStamp setzen, anhand dessen wir ermitteln können, ob dieses pferd schon abgehandelt ist oder nicht.
            window.localStorage.setItem(this.url, this.horseLoggingObject.timeStamp);

            console.log(response);
        });
    }

    #updateSleepingToDB(){
        chrome.runtime.sendMessage({ function: "updateSleepingToDB", popupHorseObject: this.popupHorseObject}, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
            //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.

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
            this.searchStrings.forEach(searchString => {
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
        console.log(this.searchStrings);
        $(document).on('click', () => {
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
                this.searchStrings.forEach(searchString => {
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

        $(document).on('click', this.buttonIdentifier, () => {
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
                                console.log("registration end: "+endOfRegistration);
                                if (todaysResetDate.getTime() > now.getTime() || endOfRegistration.getTime() > now.getTime()) { // date > today
                                    // alles gut
                                    // reset kommt erst noch, Pferd schläft, wird schlafen, und wird geschlafen haben
                                    // oder es steht eh noch länger
                                    // variable setzen: schläft
                                    window.localStorage.setItem("asleep"+this.url,now.getTime());
                                    this.popupHorseObject.sleepTimestamp = now.getTime();
                                    this.#updateSleepingToDB();
                                } else {
                                    // gefahr! O.O
                                    // aber egal muss man nix tun
                                }
                            } else if (sleepButton.classList.contains("coucher-pre")) {
                                // done
                                console.log("auf wiese");
                                // variable setzen: schläft
                                window.localStorage.setItem("asleep"+this.url,new Date().getTime());
                                this.#updateSleepingToDB();
                            }
                        }
                        // Daten müssen auch noch in Datenbank gespeichert werden.
                        // ähnliche überprüfung onLoad, weil man eventuell nochmal im reitzentrum anmelden muss und dann auf die seite zurück geworfen wird.
                        // prüfen, ob ich hier den initialen create beim aufbau der seite mitbekomme^^ -> nö
                    });
                }
            });
        };
        
        let observer = new MutationObserver(callback);
        
        observer.observe(sleepButtonParent, {childList: true}); // subtree: true, // das im kommentar vermutlich unnötig
        

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