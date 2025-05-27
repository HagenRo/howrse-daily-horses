const myButton = document.getElementById("clearbtn");
/*myButton.innerHTML = myButton.textContent + "<br>" + window.localStorage.getItem("lastDelete");
myButton.addEventListener("click", () => {
    if (confirm("You did Download first right?")) {
        chrome.runtime.sendMessage({ mdText: "clear" }, (response) => {
            date = new Date();
            window.localStorage.setItem("lastDelete", "" + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
        });
    }


});

const myButton2 = document.getElementById("downloadbtn");

myButton2.addEventListener("click", () => {
    chrome.runtime.sendMessage({ mdText: "downloadTable" }, (response) => {
        alert(response.mdText);
    });
});

const myButton3 = document.getElementById("runbtn");

myButton3.addEventListener("click", () => {
    chrome.tabs.create({ url: 'app/dataVisualization/dataVisualization.html', active: true });
    //overrideLog();
    //printLogging();

});

function printLogging() {
    chrome.storage.local.get(["arrayOfRuns"], function (keyValuePairs) {
        console.log(keyValuePairs.arrayOfRuns);
    });
}

function overrideLog(olympRunLogging) {
    //let olympRun = new OlympRunLogging(dateRunStarted, window.location.host, isDrachma);
    olympRunLogging = {
        dateRunStarted: 'Sat Dec 30 2023 18:06:15 GMT+0100 (Mitteleuropäische Normalzeit)',
        domain: "nl.howrse.com",
        drachma: false,
        startHorses: undefined,
        arrayOfFights: [],
        arrayOfRewards: []
    }
    let arrayOfRuns = [];
    arrayOfRuns.push(olympRunLogging);
    chrome.storage.local.set({ "arrayOfRuns": arrayOfRuns }, function () {
    });
}*/




//---------------------------------------------------------------------------------------------------------------------
// rememberme:

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

chrome.runtime.sendMessage({ function: "getPopupHorsesFromDB"}, (response) => {
    // code um unser popup-fenster aufzubauen
    console.log(response);
    showPopupHorses(response.msg);
})

function showPopupHorses(popupHorses) {
    //chrome.storage.local.get(["obolusReceived"], function (keyValuePairs) {
    console.log(popupHorses.length);
        if (popupHorses.length>0) {//if exists
            let textContent = '';
            let amountPopupHorsesTodoPerVersion = {
                'www.howrse.de': [],
                'www.howrse.com': [],
                'www.howrse.co.uk': [],
                'nl.howrse.com': [],
                'www.howrse.se': [],
                'au.howrse.com': []
            }; 
            for (const popupHorse of popupHorses) {
                // get domain // get whether it's already done // if not, add it to the "amountPopupHorsesTodoPerVersion" at its version
                //console.log(popupHorse);
                let key = new URL(popupHorse.horseURL).hostname; // nice
                //console.log(key);
                // müsste so stimmen
                //console.log(`${key}: ${value}`);

                let reset = new Date().getTimezoneOffset() == -120 ? resetsSommer[key] : resetsWinter[key]; //winter und sommerzeit wirken sich unterschiedlich auf die einzelnen domains aus
                let lastResetDate = new Date(new Date().setHours(reset, 0, 0)) > new Date ? new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(reset, 0, 0)) : new Date(new Date().setHours(reset, 0, 0));
                // muss ich da das erste "new Date" ohne Klammern durch popupHorse.sleepTimestamp ersetzen? und dann weiß ich dinge?
                if (lastResetDate > new Date(popupHorse.sleepTimestamp)) { // if not sleeping
                    amountPopupHorsesTodoPerVersion[key].push(popupHorse); // add insert whatever
                }
            }
            let sumRemaining = 0;
            for (const [url,values] of Object.entries(amountPopupHorsesTodoPerVersion)) {
                let domElement = document.getElementsByName(url);
                if (domElement[0]) {
                    domElement[0].textContent=values.length;
                    sumRemaining += values.length;
                    /*
                    if (lastResetDate < new Date(value)) {
                        domElement[0].textContent = `\u2713`;//u2713 // checkmark


                    } else {
                        domElement[0].textContent = 0;//`\u2718`;//u2718 // "X"
                        domElement[0].parentNode.className = 'obolusReceived';
                        domElement[0].parentNode.children[0].className = 'obolusReceived';
                        domElement[0].className = 'obolusReceived'
                    }// */
                    console.log(url,values);
                }
            }
            chrome.action.setBadgeText({text: sumRemaining.toString()});
        }
    //});
}

//getObolusReceived()