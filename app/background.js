importScripts("Database/Datamanagement.js");
const dataAccessForOlympRuns = new DataAccessForDailyHorses();
//ökjbpkbhjöpjibp

//Message broker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    for (let index = 0; index < 10000; index++) {
        const element = null;
        
    }//keine ahnung ob man das braucht oder ob das noch ein überbleibsel vom experimentieren des bug mit es werden nicht alle messages verarbeitet ist. Vermutlich kann mans löschen!
    

    //hier werden entsptrechend die Messages entgegengenommen und deren verarbeitung angestoßen.
    //TODO: die cases umbenennen und dann die messages entsprechend werfen.
    switch (message.mdText) {
        case "addRunToDB":
            dataAccessForOlympRuns.addRunToDB(message.olympRun)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addStartHorsesToRun":
            dataAccessForOlympRuns.addStartHorsesToRun(message.startHorsesFull, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addFightToRun":
            dataAccessForOlympRuns.addFightToRun(message.fight, message.dateRunStarted)
            .then(({msg, result})=>{
                console.log(msg)
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                console.log('error')
                sendResponse({msg: e});
            });
            break;
        case "addRewardsToRun":
            dataAccessForOlympRuns.addRewardsToRun(message.rewards, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;            
        case "addHorseIdToReward":
            dataAccessForOlympRuns.addHorseIdToReward(message.horseID, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "addBossToRun":
            dataAccessForOlympRuns.addBossToRun(message.rewards, message.fight, message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;            
        case "addLostRunToBossRewards":
            dataAccessForOlympRuns.addLostRunToBossRewards(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "getAllRunsFromDB":
            console.log('getAllRunsFromDB');
            dataAccessForOlympRuns.getAllRuns()
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });

            break;
        case "getRunFromTimestamp":
            dataAccessForOlympRuns.getRunFromTimestamp(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "deleteRunFromTimestamp":
            dataAccessForOlympRuns.deleteRunFromTimestamp(message.dateRunStarted)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "updateRunToDB":
            dataAccessForOlympRuns.updateRunToDB(message.olympRun)
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
        case "getKeys":
            dataAccessForOlympRuns.getKeys()
            .then(({msg, result})=>{
                sendResponse({msg: msg, result: result});
            })
            .catch((e)=>{
                sendResponse({msg: e});
            });
            break;
          
              
            
        default:
            console.log(message, sender, sendResponse);
            if (sendResponse) {
                sendResponse(message);
            }
            break;
    }
    
    return true;
  });

