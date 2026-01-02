class Horse {
    //attributes
    url; // version für reset timer inklusive
    searchStrings = []; // gonna be some regex stuff
    isReadyOnWakeup;
    searchEndStrings; // searchString, for which the search is ended for the drop because now the drop should have been found if it will ever be found.
    isUnimportant; // die kann ich hinzufügen, sodass sie geloggt (?) werden, wenn ich sie bespiele, aber sie tauchen nicht in der Liste der "TODO HEUTE DRINGEND" tiere auf
    isExemption; // exception // is pluto
    exemptionFunction; // in case you are an EXEMPTION
    countClicks; // bool whether clicks have to be counted here (spices)
    defaultType; // drop type if nothing found (Bonus for chinese) // TODO: add to constructor 
    defaultAmount; // drop amount if nothing found (1 Bonus for chinese) // TODO: add to constructor
    buttonIdentifier; // String, Klasse, ID, die den Button eindeutig identifiziert, nachdem ein Pferd keine Drop mehr durchführen kann an dem Tag. //TODO: in Konstruktorsignatur hinzufügen
    isAsleep; // "nur so mit semi" - eigentlich in chrome local storage schreiben weil wirs zwischen sessions brauchen?

    // general types
    type_equus = { "type": "Equus", "searchStrings": [/.+ bringt Dir  (\d+) x  Equus\./, /.+ bringt Dir (\d+) x  Equus\./, /.+ brings you (\d+) x  Equus./, /.+ brengt je (\d+) x  Equus\./, /.+ ger dig (\d+) x  Equus\./] };
    // skills TODO: NL & SE chinese!
    type_skills = { "type": "Skillpunkte", "searchStrings": [/.+ hat (\d+) Fähigkeitspunkte gewonnen, die verteilt werden können/, /.+ bringt Dir  (\d+) Fähigkeitenpunkte./, /.+ brings you  (\d+) skill points./, /.+ won (\d+) skill points you can spend whichever way you like/, /.+ brengt je  (\d+) vaardigheidspunten./, /.+ ger dig  (\d+) färdighetspoäng./] };
    type_passes = { "type": "Pässe", "searchStrings": [/Du hast (\d+)  gewonnen\!/, /.+ bringt Dir (\d+) \./, /You won (\d+) \!/, /Je won (\d+) \!/, /Du vann (\d+) \!/] };

    dropTypesToSearch = [this.type_equus, this.type_skills, this.type_passes];

    dropMapping = {
        // main prize
        "/marche/voir?qName=defi-titans": "Herausforderung der Titanen | Titans Challenge",
        "/marche/voir?qName=toison-or": "Goldenes Vlies | Golden Fleece",
        "/marche/voir?qName=don-hestia": "Hestias Gabe",
        "/marche/voir?qName=pack-poseidon": "Poseidon-Paket",
        "/marche/voir?qName=talon-achille": "Achillesferse",
        "/marche/voir?qName=pack-bonus": "Bonuspaket",
        "/marche/voir?qName=monster-egg": "Monster-Ei",
        "/marche/voir?qName=arthur-conan-doyle-inkwell": "Tintenfass von Arthur Conan Doyle",
        "/marche/voir?qName=alexandre-dumas-inkwell": "Tintenfass von Alexandre Dumas",

        "/marche/voir?qName=vieillissement": "Alterungspunkte",
        "/marche/voir?qName=ressource-cuir": "Leder",
        "/marche/voir?qName=ressource-bois": "Holz",
        "/marche/voir?qName=ressource-fer": "Eisen",
        "/marche/voir?qName=ressource-sable": "Sand",
        "/marche/voir?qName=avoine": "Hafer | Oats",
        "/marche/voir?qName=pomme": "Apfel",
        "/marche/voir?qName=carotte": "Karotte",
        "/marche/voir?qName=mash": "Mash",
        "/marche/voir?qName=ressource-lin": "Flachs",
        "/marche/voir?qName=graines-pomme": "Apfelsamen",
        // subtype
        "/marche/voir?qName=bande-2x-": "Bandagen",
        "/marche/voir?qName=bonnet-2x-": "Fliegenohren",
        "/marche/voir?qName=tapis-classique-2x-": "Satteldecke (klassisch)",
        "/marche/voir?qName=tapis-western-2x-": "Satteldecke (western)"
    }

    /**
     * horse object to be initalized every time and saved to the database
     */
    horseLoggingObject = {
        horseURL: null,
        horseType: null, // Familienname
        horseName: null, // intern vereinheitlichten
        dropAmount: null,
        dropType: null,
        dropSubType: null, // japanese: coloured tack
        timeStamp: null,
        timeStampHumanReadable: null,
        dropHorseAge: null,
        amountClicks: 0, // amount of clicks used to finish horse // together with drop amount for spice horses
    }

    /**
     * information about the horse required to find out whether it has been treated already
     */
    popupHorseObject = {
        horseName: null,
        horseURL: null,
        sleepTimestamp: null,
        dropTimestamp: null,
        dropHorseAge: ['0', '0'],
        showInPopup: null
    }

    constructor(url, searchStrings, isReadyOnWakeup, horseType, horseName, defaultType, defaultAmount, isExemption, exemptionFunction, countClicks, buttonIdentifier, isUnimportant, searchEndStrings) {
        this.url = url;
        this.searchStrings = searchStrings; // which regex expressions we're looking for
        //console.log(searchStrings);
        this.isReadyOnWakeup = isReadyOnWakeup; // whether the message will be there when the horse wakes up
        this.searchEndStrings = searchEndStrings;
        this.isExemption = isExemption; // like Onyx with the UFOs or Pluto, with a message that doesn't trigger at one specific point in time
        this.exemptionFunction = exemptionFunction; // how to work this exemption
        this.countClicks = countClicks;
        this.defaultType = defaultType;
        this.defaultAmount = defaultAmount;
        this.buttonIdentifier = buttonIdentifier; // Butto der gedrückt wird, woraufhin ein drop passiert oder nicht
        this.isUnimportant = isUnimportant;
        //

        this.horseLoggingObject.horseURL = url;
        this.horseLoggingObject.horseType = horseType;
        this.horseLoggingObject.horseName = horseName; // von howrse gesetzter internationaler name
        this.horseLoggingObject.dropAmount = this.defaultAmount;
        //this.horseLoggingObject.dropType = this.defaultType;
        this.horseLoggingObject.amountClicks = 0;//this.countClicks;

        this.popupHorseObject.horseName = horseName;
        this.popupHorseObject.horseURL = url;
        this.popupHorseObject.showInPopup = !isUnimportant;
        // this.popupHorseObject.dropHorseAge = [0,0]; // initial
        // this.horseLoggingObject.dropHorseAge = [0,0];
        //console.log(url);

        chrome.runtime.sendMessage({ function: "addOrUpdatePopupHorseToDB", popupHorseObject: this.popupHorseObject }, (response) => {
            //console.log(response);
        });
    }

    setHorseAge() {
        this.horseLoggingObject.dropHorseAge = this.#getHorseAge();
        this.popupHorseObject.dropHorseAge = this.horseLoggingObject.dropHorseAge;
        //console.log("setter präsentiert stolz: das drop horse age: ",this.popupHorseObject.dropHorseAge);
    }

    #getHorseAge() {
        let searchString = /[^\d]+(\d+)[^\d]+(\d*).*/;
        let searchElement = $("#characteristics-body-content").find("td")[1].textContent;
        let result = searchElement.match(searchString);
        //console.log("horse age result",result);
        let years = result[1];
        let months = 0; // default
        if (result[2]) months = result[2];
        return [years, months];
    }

    /**
     * Speichert den Drop in der Datenbank, wenn es für das Alter des Pferdes noch keinen Eintrag gibt.
     */
    #saveHorseDropToDB() {
        //console.log(this.horseLoggingObject);
        //*
        chrome.runtime.sendMessage({ function: "getPopupHorse", horseURL: this.horseLoggingObject.horseURL, horseAge: this.horseLoggingObject.setHorseAge }, (response) => {
            if (!response.result.dropHorseAge) { // fix für fehlende DropHorseAge
                chrome.runtime.sendMessage({ function: "updateDropHorseAge", popupHorseObject: this.popupHorseObject }, (response) => {
                    console.log("updated DropHorseAge", response);
                })
            };
            console.log("response vor check ob heute schon was war", response);
            console.log("this dropAge:", this.horseLoggingObject.dropHorseAge);
            if (response.result.dropHorseAge.toString() != this.horseLoggingObject.dropHorseAge.toString()) {
                chrome.runtime.sendMessage({ function: "addDropDataToDB", horseLoggingObject: this.horseLoggingObject }, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
                    //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.

                    //wenn wir einen eintrag in die Datenbank schreiben, dann wollen wir einen timeStamp setzen, anhand dessen wir ermitteln können, ob dieses pferd schon abgehandelt ist oder nicht.
                    window.localStorage.setItem(this.url, this.horseLoggingObject.timeStamp);
                    console.log("[#saveHorseDropToDB]", response);
                    if (response.msg == "success") {
                        setTimeout(() => { showStatusNotification("\uD83D\uDCBE" + response.result.dropAmount + " " + response.result.dropType + " to DB", true) }, 1000);
                        chrome.runtime.sendMessage({ function: "updateDropTimestamp", popupHorseObject: this.popupHorseObject }, (response) => {
                            console.log("updated DropTimestamp", response);
                        })
                        chrome.runtime.sendMessage({ function: "updateDropHorseAge", popupHorseObject: this.popupHorseObject }, (response) => {
                            console.log("updated DropHorseAge", response);
                        })
                    }

                    console.log("response falls noch nix war", response);
                });
            } else {
                //showStatusNotification("\uD83D\uDCBE" + response.result.dropAmount + " " + response.result.dropType + " NOT to DB",true);
            }
        });

        // */
    }

    #hasDroppedToday() {
        // about this horse
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ function: "getPopupHorse", horseURL: this.horseLoggingObject.horseURL }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response.result.dropHorseAge.toString());
                }
            });
        });
    }
    /*
        chrome.runtime.sendMessage({ function: "getPopupHorse", horseURL: this.horseLoggingObject.horseURL}, (response) => {
            //
            return (response.result.dropHorseAge.toString() == this.horseLoggingObject.dropHorseAge.toString());
        });
    } // */

    #updateSleepTimestamp() {
        chrome.runtime.sendMessage({ function: "updateSleepTimestamp", popupHorseObject: this.popupHorseObject }, (response) => { //param1 und param2 und beliebig viele weitere können frei benannt werden, müssen dann entsprechend in backroundscript benannt sein
            //hier sind wir in der Funktion, die vom empfänger der Nachricht aufgerufen wird.

            console.log(response);
        });
    }

    #onWakeup() {
        //TODO: onLoad prüfen ob reitzentrum heute ausläuft -> wenn ja dann speichern, das sleep bu
        //TODO: hier muss geprüft werden, ob an diesem tag schon ein eintrag geschrieben wurde 
        $(document).ready(() => {
            let regexResult = this.#searchSearchStringInTimeLine();
            this.#setTimestamp();
            this.#setDropAmount(regexResult[1]);
            this.#setDropType(regexResult[2]);
            this.#saveHorseDropToDB();

            showNotification(this.horseLoggingObject.dropAmount, this.horseLoggingObject.dropType, this.horseLoggingObject.dropSubType);
            this.#doApplicationLog(this.horseLoggingObject, "#onClick")
        });
    }

    /**
     * Wird ausgeführt, bei Pferden, bei denen aus der Timeline nicht hervorgeht, wenn sie nichts geworfen haben.
     * Es wird dabei angenommen, dass direkt nach dem Klicken in der Timeline der entsprechende Searchstring auftaucht.
     * Wenn das nicht der Fall ist, werden die default Werte des Drops verwendet für den Eintrag.
     */
    #onDifferentDrop() {
            let observer = new MutationObserver((mutationRecords) => {
                let horseTimeLines = [];
                let historyoderso = mutationRecords[0].addedNodes[0].firstChild;
                $(historyoderso).find("li").each(function () {
                    horseTimeLines.push($(this).text().trim());
                });
                let dropShoudBeThereOrWontComeToday = this.#couldBeDrop(horseTimeLines);
                if (dropShoudBeThereOrWontComeToday) {
                    let regexResult = this.#searchSearchStringInTimeLine(horseTimeLines);
                    
                    this.#setTimestamp();
                    this.#setDropAmount(regexResult[1]);
                    this.#setDropType(regexResult[2]);
                    this.#saveHorseDropToDB();


                    showNotification(this.horseLoggingObject.dropAmount, this.horseLoggingObject.dropType, this.horseLoggingObject.dropSubType);
                    this.#doApplicationLog(this.horseLoggingObject, "#onDifferentDrop");
                    console.log('observer: ', observer);
                    observer.disconnect();
                }
                

            });

            let historyParent = $('#history-body-content')[0];
            observer.observe(historyParent, { childList: true }); // subtree: true, // das im kommentar vermutlich unnötig


    }
    #setDropAmount(dropAmount) {
        this.horseLoggingObject.dropAmount = dropAmount ? dropAmount : this.defaultAmount;
    }
    #setDropType(dropType) {
        this.horseLoggingObject.dropType = dropType ? dropType : this.defaultType;
        //TODO: hier schauen, wei man das mit dem dynamischen droptype und subdroptype sinvoll reinbekommt
    }

    #clickCounter() {
        // TODO: Count-Wert behalten, selbst wenn die Seite neu geladen wird, bis der Drop kommt. window.localstorage.setItem
        console.log("#clickCounter ist hier");
        console.log("#clickCounter, buttonIdentifier: ", this.buttonIdentifier);

        $("body")[0].addEventListener('click', (event) => {
            console.log("Eventtarget: ", event.target);
            //let closestButton = $(event.target).closest("button.button.button-style-0")[0];
            let isButton = $(event.target).closest(this.buttonIdentifier)[0];
            //let hasCorrectParent = $(closestButton).parent(".grid-cell.odd.last")[0];
            //console.log("closestButton: ",closestButton);
            //console.log("parent: ",hasCorrectParent);
            console.log("test: ", isButton);
            if (isButton) {
                console.log("horse logging object", this.horseLoggingObject);
                this.horseLoggingObject.amountClicks += 1;
                console.log("#clickCounter registrierte Klick Nummer ", this.horseLoggingObject.amountClicks);
            }
        }, true);

    }

/**
     * Durchsucht die Timline des Pferdes, indem es für jeden eintrag der Timeline prüft ob ein search end string darauf zutrifft.
     * Falls ja wird dessen ergebis zurückgegeben
     * @returns regexResult
     */
    #searchSearchStringInTimeLine(horseTimeLines) {
        if (!horseTimeLines) {
            horseTimeLines = [];
            $('#history-0 .grid-cell.last').each(function () {
                // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
                horseTimeLines.push($(this).text().trim());
            });
        }

        console.log("horseTimeLines: ", horseTimeLines);
        let regexResult = [];
        horseTimeLines.forEach(timeLine => {
            this.searchStrings.forEach(searchString => {
                if (regexResult.length > 0) return;
                regexResult = timeLine.match(searchString) ? timeLine.match(searchString) : regexResult;
            });
        });
        return regexResult;
    }
    /**
     * Durchsucht die Timline des Pferdes, indem es für jeden eintrag der Timeline prüft ob ein search end string darauf zutrifft.
     * Falls ja wird true zurückgegeben.
     * @returns bool
     */
    #couldBeDrop(horseTimeLines) {
        if (!horseTimeLines) {
            horseTimeLines = [];
            $('#history-0 .grid-cell.last').each(function () {
                // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
                horseTimeLines.push($(this).text().trim());
            });
        }

        console.log("horseTimeLines: ", horseTimeLines);
        let regexResult = [];
        horseTimeLines.forEach(timeLine => {
            this.searchEndStrings.forEach(searchEndString => {
                if (regexResult.length > 0) return;
                regexResult = timeLine.match(searchEndString) ? timeLine.match(searchEndString) : regexResult;
            });
        });
        return regexResult.length > 0;
    }

    #onDrop() {
        let historyParent = $('#history-body-content')[0];
        console.log("onDrop is here");
        const callback = (mutationRecords) => {
            console.log("onDrop mutationRecords", mutationRecords);
            let horseTimeLines = [];
            let ergebnis = [];
            console.log("added nodes", mutationRecords[0].addedNodes);
            let historyoderso = mutationRecords[0].addedNodes[0].firstChild;
            console.log("history die durchsucht wird", historyoderso);
            $(historyoderso).find("li").each(function () {
                // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
                console.log(this);
                horseTimeLines.push({ string: $(this).text().trim(), domElement: this });
            });
            console.log("horseTimeLines", horseTimeLines);
            let timeLineWithLink;
            horseTimeLines.forEach(timeLine => {
                this.searchStrings.forEach(searchString => {
                    if (ergebnis.length > 0) return;
                    ergebnis = timeLine.string.match(searchString) ? timeLine.string.match(searchString) : ergebnis;
                    timeLineWithLink = timeLine.domElement;
                    /* 
                    console.log("searchString: ",searchString);
                    console.log("compared with: ",timeLine);
                    console.log("ergebnis: ",ergebnis); // */
                });
            });
            if (ergebnis.length > 0) {
                /* // TODO hasDroppedToday()
                if (!this.#hasDroppedToday()) { // ??
                    this.#doApplicationLog(ergebnis,"match found");
                };*/

                // drop time stamp
                this.#setTimestamp();

                console.log("link! ", $(timeLineWithLink).find("[href]").attr("href"));

                // drop amount
                this.horseLoggingObject.dropAmount = ergebnis[1];
                //Frage: Wann kann es denn vorkommen, dass der string gefunden wurde, allerdings kein dropAmount darin definiert wurde. und wäre dann nicht die variable defaultAmount nicht sinvoller haben wir da eine dopplung?
                if (this.horseLoggingObject.dropAmount == undefined) {
                    console.log("value not found. setting amount to default");
                    this.horseLoggingObject.dropAmount = this.defaultAmount;
                }
                console.log("dropAmount: ", this.horseLoggingObject.dropAmount);
                this.#doApplicationLog(this.horseLoggingObject.dropAmount, "drop amount found");

                //console.log("ergebnis: ",ergebnis);

                // drop type
                if (ergebnis.length > 2) { // only japanese and egypts currently (?)
                    if (ergebnis[2].match(/.*2\*\* .+/)) {
                        let currentLink = $(timeLineWithLink).find("[href]").attr("href");
                        this.horseLoggingObject.dropType = this.dropMapping[currentLink.substring(0, currentLink.indexOf("2x-") + 3)];
                        this.horseLoggingObject.dropSubType = currentLink.substring(currentLink.indexOf("2x-") + 3);//ergebnis[2]; was am ende gecuttet wird
                        console.log("drop subtype: ", this.horseLoggingObject.dropSubType);
                        this.#doApplicationLog(this.horseLoggingObject.dropSubType, "drop if sub type");
                    } else {
                        this.horseLoggingObject.dropType = this.dropMapping[$(timeLineWithLink).find("[href]").attr("href")];//ergebnis[2];
                        if (this.horseLoggingObject.dropType == undefined) {
                            this.dropTypesToSearch.forEach(dropType => {
                                dropType.searchStrings.forEach(typeSearchString => {
                                    /*
                                    console.log("das vor dem match",$(timeLineWithLink).text().trim());
                                    console.log("typeSearchString",typeSearchString);
                                    console.log("das ganze ohne length",$(timeLineWithLink).text().trim().match(typeSearchString)); // */
                                    if ($(timeLineWithLink).text().trim().match(typeSearchString)) {
                                        this.horseLoggingObject.dropType = dropType.type;
                                        this.#doApplicationLog(this.horseLoggingObject.dropType, "drop type if subtype exists");
                                    }
                                });
                            });
                        }
                    }
                    console.log("drop type: ", this.horseLoggingObject.dropType);
                }
                if (!this.horseLoggingObject.dropType) this.horseLoggingObject.dropType = this.defaultType;
                //hier muss manchmal noch der typ ermittelt werden.
                //mal schauen, wie man das coden kann, dass man keine ausnamefälle betrachten muss.
                showNotification(this.horseLoggingObject.dropAmount, this.horseLoggingObject.dropType, this.horseLoggingObject.dropSubType);
                console.log("onDrop speichert den Wert", ergebnis);
                this.#saveHorseDropToDB();
            }
        }
        let observer = new MutationObserver(callback);

        observer.observe(historyParent, { childList: true }); // subtree: true, // das im kommentar vermutlich unnötig
    }

    #setTimestamp() {
        let date = new Date();
        this.horseLoggingObject.timeStamp = date.getTime();
        this.popupHorseObject.dropTimestamp = this.horseLoggingObject.timeStamp;
        this.horseLoggingObject.timeStampHumanReadable = date.toISOString();
    }

    #onSleep() {
        let sleepButtonParent = $('#night-body-content')[0];
        const callback = (mutationRecords) => {
            console.log(mutationRecords);
            mutationRecords.forEach(mutationRecord => {
                if (mutationRecord.type === 'childList') {
                    mutationRecord.addedNodes.forEach(addedNode => {
                        let sleepButton = $(addedNode).find('#boutonCoucher')?.[0];
                        // hier schauen ob das element da ist 
                        if (sleepButton) {
                            //prüfen nach klasse ob wiese oder box
                            let now = new Date(); // default now
                            if (sleepButton.classList.contains("coucher-box")) {
                                console.log("in box");
                                let key = window.location.hostname;
                                let resetHour = new Date().getTimezoneOffset() == -120 ? resetsSommer[key] : resetsWinter[key]; //winter und sommerzeit wirken sich unterschiedlich auf die einzelnen domains aus
                                let lastResetDate = new Date(new Date().setHours(resetHour, 0, 0)) > new Date ? new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(resetHour, 0, 0)) : new Date(new Date().setHours(resetHour, 0, 0));
                                let todaysResetDate = new Date(new Date().setHours(resetHour, 0, 0));

                                let endOfRegistration = DateParser.parseRegistrationEndDate($("#center-tab-main").find(".tab-action.tab-action-select.button.button-style-14").parent().parent().find(".grid-cell.align-top")[0].textContent, window.location.hostname); // $("#center-tab-main").find(".tab-action.tab-action-select.button.button-style-14").parent().parent().find(".grid-cell.align-top")[0].textContent;
                                console.log("registration end: " + endOfRegistration);
                                if (todaysResetDate.getTime() > now.getTime() || endOfRegistration.getTime() > now.getTime()) { // date > today
                                    // alles gut
                                    // reset kommt erst noch, Pferd schläft, wird schlafen, und wird geschlafen haben
                                    // oder es steht eh noch länger
                                    // variable setzen: schläft
                                    window.localStorage.setItem("asleep" + this.url, now.getTime());
                                    this.popupHorseObject.sleepTimestamp = now.getTime();
                                    this.#updateSleepTimestamp();
                                } else {
                                    // gefahr! O.O
                                    // aber egal muss man nix tun
                                }
                            } else if (sleepButton.classList.contains("coucher-pre")) { // auf wiese
                                // TODO: Debuggen wenn wieder pferde wach sind
                                console.log("auf wiese");
                                // variable setzen: schläft
                                window.localStorage.setItem("asleep" + this.url, new Date().getTime());
                                this.popupHorseObject.sleepTimestamp = now.getTime();
                                console.log(now);
                                this.#updateSleepTimestamp();
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

        observer.observe(sleepButtonParent, { childList: true }); // subtree: true, // das im kommentar vermutlich unnötig


    }

    //führt die logik von onDrop aus beim laden der seite statt über den mutation record change
    #testOnDrop() {
        let historyItems = $('#history-body-content').find('.grid-row.dashed');
        console.log("[test] testOnDrop is here");
        let horseTimeLines = [];
        let ergebnis = [];
        //console.log("[test] added nodes",mutationRecords[0].addedNodes);
        //let historyoderso = mutationRecords[0].addedNodes[0].firstChild;
        //console.log("[test] history die durchsucht wird",historyoderso);
        $('#history-body-content').find("li").each(function () {
            // Füge den Textinhalt jedes gefundenen Elements dem Array hinzu
            console.log(this);
            horseTimeLines.push({ string: $(this).text().trim(), domElement: this });
        });
        console.log("[test] horseTimeLines", horseTimeLines);
        let timeLineWithLink;
        horseTimeLines.forEach(timeLine => {
            this.searchStrings.forEach(searchString => {
                if (ergebnis.length > 0) return;
                ergebnis = timeLine.string.match(searchString) ? timeLine.string.match(searchString) : ergebnis;
                console.log("zu suchen: ", searchString, " durchsuchter Eintrag: ", timeLine, " ergebnis: ", ergebnis);
                timeLineWithLink = timeLine.domElement;
                /* 
                console.log("searchString: ",searchString);
                console.log("compared with: ",timeLine);
                console.log("ergebnis: ",ergebnis); // */
            });
        });
        console.log("[test] ", ergebnis);
        if (ergebnis.length > 0) {
            // drop time stamp
            let date = new Date();
            this.horseLoggingObject.timeStamp = date.getTime();
            this.popupHorseObject.dropTimestamp = this.horseLoggingObject.timeStamp;
            this.horseLoggingObject.timeStampHumanReadable = date.toISOString()

            console.log("[test] link! ", $(timeLineWithLink).find("[href]").attr("href"));

            // drop amount
            this.horseLoggingObject.dropAmount = ergebnis[1];
            if (this.horseLoggingObject.dropAmount == undefined) {
                console.log("[test] value not found. setting amount to default");
                this.horseLoggingObject.dropAmount = this.defaultAmount;
            }
            console.log("[test] dropAmount: ", this.horseLoggingObject.dropAmount);

            // TODO überprüfendes logging hier?

            //console.log("ergebnis: ",ergebnis);

            // drop type
            if (ergebnis.length > 2) { // only japanese and egypts currently (?)
                if (ergebnis[2].match(/.*2\*\* .+/)) {
                    let currentLink = $(timeLineWithLink).find("[href]").attr("href");
                    this.horseLoggingObject.dropType = this.dropMapping[currentLink.substring(0, currentLink.indexOf("2x-") + 3)];
                    this.horseLoggingObject.dropSubType = currentLink.substring(currentLink.indexOf("2x-") + 3);//ergebnis[2]; was am ende gecuttet wird
                    console.log("[test] drop subtype: ", this.horseLoggingObject.dropSubType);
                } else {
                    this.horseLoggingObject.dropType = this.dropMapping[$(timeLineWithLink).find("[href]").attr("href")];//ergebnis[2];
                    if (this.horseLoggingObject.dropType == undefined) {
                        this.dropTypesToSearch.forEach(dropType => {
                            dropType.searchStrings.forEach(typeSearchString => {
                                /*
                                console.log("das vor dem match",$(timeLineWithLink).text().trim());
                                console.log("typeSearchString",typeSearchString);
                                console.log("das ganze ohne length",$(timeLineWithLink).text().trim().match(typeSearchString)); // */
                                if ($(timeLineWithLink).text().trim().match(typeSearchString)) {
                                    this.horseLoggingObject.dropType = dropType.type;
                                }
                            });
                        });
                    }
                }
                console.log("[test] drop type: ", this.horseLoggingObject.dropType);
            }
            if (!this.horseLoggingObject.dropType) this.horseLoggingObject.dropType = this.defaultType;
            //hier muss manchmal noch der typ ermittelt werden.
            //mal schauen, wie man das coden kann, dass man keine ausnamefälle betrachten muss.
            console.log("[test] horseLoggingObject", this.horseLoggingObject);
            setTimeout(() => { showNotification(this.horseLoggingObject.dropAmount, this.horseLoggingObject.dropType, this.horseLoggingObject.dropSubType, true) }, 1000);
            //this.#saveHorseDropToDB();
        }

    }

    /**
     * Einstieg in das Loggen des jeweiligen Pferdes.
     * Wird von horseLogging aus aufgerufen.
     * Hier wird entschieden, wie und was geloggt wird.
     */
    check() {
        //this.#testOnDrop(); // testing
        this.#onSleep();
        //this.#onDrop();
        if (this.isReadyOnWakeup) {
            console.log("früher Vogel");
            this.#onWakeup();
        } else if (this.buttonIdentifier && this.countClicks) {
            console.log("Spicy?");
            this.#clickCounter();
            this.#onDrop();
        } else if (this.searchEndStrings) {
            console.log("Opal?");
            this.#onDifferentDrop();
        } else if (this.searchStrings.length > 0) {
            console.log("weder spicy noch Opal");
            this.#onDrop();
        }
    }

    #doApplicationLog(entry, action) {
        let applicationLogObject = {
            horseURL: this.url,
            timeStamp: new Date().toISOString(),
            action: action,
            entry: entry, // object; any
        };
        chrome.runtime.sendMessage({ function: "writeApplicationLog", applicationLog: applicationLogObject });
    }
}