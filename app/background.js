//einbinden des Skripts mit der Datenbankverwaltung
importScripts("Database/Datamanagement.js");
//Erstellung der Schnittstelle zur Datenbankverwaltung
const dataAccessForDailyHorses = new DataAccessForDailyHorses();

//nimmt Messages entgegen, die vom horseLoggingscript verschickt werden
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // for (let index = 0; index < 10000; index++) {
    //     const element = null;
    // }//keine ahnung ob man das braucht oder ob das noch ein überbleibsel vom experimentieren des bug mit es werden nicht alle messages verarbeitet ist. Vermutlich kann mans löschen!
    

    //hier werden entsptrechend die Messages ausgewertet und deren verarbeitung angestoßen.
    //TODO: die cases umbenennen und dann die messages entsprechend werfen.
    switch (message.function) {
        case "<funktionDieAufgerufenWerdenSoll>":
            dataAccessForDailyHorses.funktionDieAufgerufenWerdenSoll(message.param1, message.param2)
            //jetzt kommt zeug das sein muss wegen asynchroner verarbeitung
            .then(({msg, result})=>{
                //hier wird die mitgegebene funktion aufgerufen als antwort (mit der rückgabe von funktionDieAufgerufenWerdenSoll ({msg, result})), nachdem die funktionDieAufgerufenWerdenSoll vollständig abgearbeitet wurde
                sendResponse({msg: msg});
            })
            //falls ein fehler auftritt in der funktionDieAufgerufenWerdenSoll
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        // case "addRunToDB":
        //     dataAccessForDailyHorses.addRunToDB(message.olympRun)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "addStartHorsesToRun":
        //     dataAccessForDailyHorses.addStartHorsesToRun(message.startHorsesFull, message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "addFightToRun":
        //     dataAccessForDailyHorses.addFightToRun(message.fight, message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         console.log(msg)
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         console.log('error')
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "addRewardsToRun":
        //     dataAccessForDailyHorses.addRewardsToRun(message.rewards, message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;            
        // case "addHorseIdToReward":
        //     dataAccessForDailyHorses.addHorseIdToReward(message.horseID, message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "addBossToRun":
        //     dataAccessForDailyHorses.addBossToRun(message.rewards, message.fight, message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;            
        // case "addLostRunToBossRewards":
        //     dataAccessForDailyHorses.addLostRunToBossRewards(message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "getAllRunsFromDB":
        //     console.log('getAllRunsFromDB');
        //     dataAccessForDailyHorses.getAllRuns()
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg, result: result});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });

        //     break;
        // case "getRunFromTimestamp":
        //     dataAccessForDailyHorses.getRunFromTimestamp(message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg, result: result});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "deleteRunFromTimestamp":
        //     dataAccessForDailyHorses.deleteRunFromTimestamp(message.dateRunStarted)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg, result: result});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "updateRunToDB":
        //     dataAccessForDailyHorses.updateRunToDB(message.olympRun)
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg, result: result});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
        // case "getKeys":
        //     dataAccessForDailyHorses.getKeys()
        //     .then(({msg, result})=>{
        //         sendResponse({msg: msg, result: result});
        //     })
        //     .catch((e)=>{
        //         sendResponse({msg: e});
        //     });
        //     break;
          
        // falls keiner der cases getroffen wird
        default:
            console.log(message, sender, sendResponse);
            if (sendResponse) {
                sendResponse(message);
            }
            break;
    }
    
    return true;
  });

