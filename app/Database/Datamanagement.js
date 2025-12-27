/**
 * Class to handle connections and operations with an IndexedDB database.
 */
class DatabaseConnection {
    /**
     * Creates an instance of DatabaseConnection.
     * @param {string} dbName - The name of the database.
     * @param {string} storeName - The name of the object store within the database.
     * @param {string} keyPathd - The key path for the object store.
     */
    constructor(dbName, storeName, keyPathd) {

        this.dbName = dbName;
        this.storeName = storeName;
        this.keyPathd = keyPathd;
        this.db = null;
    }
    /**
     * Initializes the database connection, creating the object store if it doesn't exist.
     * @returns {Promise<IDBDatabase>} - A promise that resolves with the database instance or rejects with an error message.
     */
    async init() {
        return new Promise((resolve, reject) => {

            console.log('indexedDB.open(this.dbName, 1);', this.dbName)

            const request = indexedDB.open(this.dbName, 3);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    console.log('this.storeName')
                    db.createObjectStore(this.storeName, { keyPath: this.keyPathd });
                }
            };

            request.onerror = (event) => {
                reject('Datenbankfehler: ' + event.target.errorCode);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
        });
    }
    /**
     * Inserts an item into the object store, or rejects if the item already exists.
     * @param {Object} item - The item to insert.
     * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
     */
    async insertOrErrorItem(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(item);

            request.onsuccess = () => {
                resolve({ msg: 'success', result: item });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });
    }
    /**
         * Inserts or updates an item in the object store.
         * @param {Object} item - The item to insert or update.
         * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
         */
    async insertOrOverrideItem(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(item);

            request.onsuccess = () => {
                resolve({ msg: 'success' });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });
    }
    /**
     * Retrieves an item by key from the object store.
     * @param {String} id - The key of the item to retrieve.
     * @returns {Promise<Object>} - A promise that resolves with the retrieved item or an error message.
     */
    async getItem(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            // console.log("getItem test hilfe",request);
            request.onsuccess = (event) => {
                resolve({ msg: 'success', result: event.target.result });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });
    }
    /**
     * Deletes an item by key from the object store.
     * @param {String} id - The key of the item to delete.
     * @returns {Promise<Object>} - A promise that resolves with a success message or rejects with an error message.
     */
    async deleteItem(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve({ msg: 'success' });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });
    }

    // async clearStore() {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readwrite');
    //         const store = transaction.objectStore(this.storeName);
    //         const request = store.clear();

    //         request.onsuccess = () => {
    //             resolve('Store geleert');
    //         };

    //         request.onerror = (event) => {
    //             reject('Fehler beim Leeren des Stores: ' + event.target.errorCode);
    //         };
    //     });
    // }
    /**
     * Retrieves all keys from the object store.
     * @returns {Promise<Object>} - A promise that resolves with an array of keys or an error message.
     */
    async getAllKeys() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();  // Alle Schlüssel abrufen

            request.onsuccess = (event) => {
                resolve({ msg: 'success', result: event.target.result });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });
    }
    /**
     * Retrieves all items from the object store.
     * @returns {Promise<Object>} - A promise that resolves with an array of items or an error message.
     */
    async getAllItems() {
        console.log("[Datamanagement, getAllItems] called");
        return new Promise((resolve, reject) => {

            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();  // Fetch all items

            request.onsuccess = (event) => {
                resolve({ msg: 'success', result: event.target.result });
            };

            request.onerror = (event) => {
                console.log(event);
                reject({ msg: event.target.errorCode });
            };
        });

    }
/**
 * Retrieves items from the object store based on a dynamic index and a specified range.
 * @param {string} indexName - The name of the index to use.
 * @param {number} lowerBound - The lower bound of the range.
 * @param {number} [upperBound] - The optional upper bound of the range.
 * @returns {Promise<Object>} - A promise that resolves with the found items or an error message.
 */
async getItemsInRange(indexName, lowerBound, upperBound) {
    console.log("[Datamanagement, getItemsInRange] called");
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const index = store.index(indexName);
        
        // Construct the key range
        const range = upperBound 
            ? IDBKeyRange.bound(lowerBound, upperBound) 
            : IDBKeyRange.lowerBound(lowerBound);
        
        const request = index.openCursor(range);

        const results = [];
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue(); // Move to the next item
            } else {
                resolve({ msg: 'success', result: results });
            }
        };

        request.onerror = (event) => {
            console.log(event);
            reject({ msg: event.target.errorCode });
        };
    });
}
    // async getItemsInKeyRange(keyRange) {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readonly');
    //         const store = transaction.objectStore(this.storeName);
    //         const items = [];

    //         const request = store.openCursor(keyRange);

    //         request.onsuccess = (event) => {
    //             const cursor = event.target.result;
    //             if (cursor) {
    //                 items.push(cursor.value); // Collect the current cursor value
    //                 cursor.continue(); // Move to the next entry
    //             } else {
    //                 // No more entries, resolve with collected items
    //                 resolve(items);
    //             }
    //         };

    //         request.onerror = (event) => {
    //             reject('Fehler beim Abrufen der Elemente: ' + event.target.errorCode);
    //         };
    //     });
    // }

    // async getItemsByKeys(keys) {
    //     return new Promise((resolve, reject) => {
    //         const transaction = this.db.transaction(this.storeName, 'readonly');
    //         const store = transaction.objectStore(this.storeName);
    //         const items = [];

    //         const promises = keys.map(key => {
    //             return new Promise((res, rej) => {
    //                 const request = store.get(key);
    //                 request.onsuccess = () => res(request.result);
    //                 request.onerror = (event) => rej('Fehler beim Abrufen des Elements: ' + event.target.errorCode);
    //             });
    //         });

    //         Promise.all(promises)
    //             .then(results => {
    //                 resolve(results);
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
}
/**
 * A simple queue implementation for executing promises sequentially.
 */
class Queue {
    /**
    * The array that holds the queued promises.
    * @type {Array<{promise: function, resolve: function, reject: function}>}
    */
    static queue = [];

    /**
     * A flag to indicate if a promise is currently being processed.
     * @type {boolean}
     */
    static pendingPromise = false;

    /**
     * Enqueues a promise to the queue.
     * This method returns a promise that resolves or rejects depending on the
     * outcome of the enqueued promise.
     *
     * @param {function(): Promise} promise - A function that returns a promise.
     * @returns {Promise} A promise that resolves or rejects based on the enqueued promise.
     */
    static enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    /**
     * Dequeues a promise and executes it. 
     * It processes the next promise in the queue if one is present.
     *
     * @returns {boolean} Returns true if a promise was dequeued, otherwise false.
     */
    static dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                    this.workingOnPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch(err => {
                    this.workingOnPromise = false;
                    item.reject(err);
                    this.dequeue();
                })
        } catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}
/**
 * Class responsible for accessing daily horse data in a database.
 * 
 */
class DataAccessForDailyHorses {
    constructor() {
        this.databaseConnection = new DatabaseConnection('DailyHorses', 'Horses', ['horseURL','timeStamp']);
        this.promiseQueue = Queue;
        this.initDataAccessForDailyHorses();
    }
    /**
     * Initializes data access for Daily Horses Logging.
     * Enqueues the initialization of the database connection.
     */
    initDataAccessForDailyHorses() {
        this.promiseQueue.enqueue(() => {
            return this.databaseConnection.init();
        });

    }


    //TODO: hier die methoden definieren, die mit der Datenbank interagieren
    /**
     * Adds a drop data to the database.
     * @param {Object} horseLoggingObject - The Horse object to be added.
     * @returns {Promise} A Promise that resolves when the horse is added.
     */
    addDropDataToDB(horseLoggingObject) {
        //console.log("[addDropDataToDB in Datamanagement] horseLoggingObject",horseLoggingObject);
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(horseLoggingObject)
            /*.then(({msg,result}) => {
                // console.log("zeile 367"); // erreicht
                return dataAccessForPopupHorses.updateDropHorseAge(horseLoggingObject.horseURL,horseLoggingObject.dropHorseAge);
                //return new Promise({msg,result});
            }) // */
        })
    }
    getAllDropData() {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }

    /**
     * Retrieves Drops from the object store based on a dynamic index and a specified range.
     * @param {string} indexName - The name of the index to use.
     * @param {number} lowerBound - The lower bound of the range.
     * @param {number} [upperBound] - The optional upper bound of the range.
     * @returns {Promise<Object>} - A promise that resolves with the found items or an error message.
     */
    getDropInRange(indexName, lowerBound, upperBound){
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItemsInRange(indexName, lowerBound, upperBound);
        });
    }
    /**
     * Fetches a specific run from the database based on the timestamp.
     * @param {string} dateRunStarted - The timestamp of the run to fetch.
     * @returns {Promise} A Promise that resolves with the requested run data.
     */
    getDropDataForURL(dateRunStarted) { // TODO
        // return this.promiseQueue.enqueue(() => {
        //    return this.databaseConnection.getItem(dateRunStarted);
        //});
    }
    /**
     * Deletes a specific run from the database based on the timestamp.
     * @param {string} dateRunStarted - The timestamp of the run to delete.
     * @returns {Promise} A Promise that resolves when the run is deleted.
     */
    deleteDropDataFromTimestampAndURL(timeStamp,url) {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.deleteItem(dateRunStarted);
        });
    }
    /**
     * Retrieves all keys from the database.
     * @returns {Promise} A Promise that resolves with an array of all keys.
     */
    getKeys() {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllKeys();
        });
    }

    /**
     * Fetches all Horses from the database.
     * @returns {Promise} A Promise that resolves with an array of all Horses.
     */
    getAllDailyHorses() {
        console.log("[Datamanagement, getAllDailyHorses] called");
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }
}

// TODO: 
// neue Klasse
// für die Popup-Anzeige, ob ein Pferd bespielt werden muss
// "wird jedes Mal beschrieben, wenn äh ein Pferd ähm mit der DataAccessForDailyHorses geschrieben wird dass dann hier der entsprechende Timestamp geschrieben wird für den Drop 
// und dass von extern also von der horselogging.js äh der ähm der schlafen-gelegt-timestamp geschrieben wird. wenn der schlafen-legen-knpf gedrückt wird."
// 
// abspeichern der timestamps, wann ein pferd schlafen gelegt wurde, und wann es gedropt hat, für den fall dass die daten sich unterscheiden
// da ein pferd erst abgehandelt ist, wenn beides erfüllt ist

/*
{
    horseName,
    horseURL,
    sleepTimestamp,
    dropTimestamp,
    showInPopup
}
*/

/**
 * Class responsible for accessing popup horse data in a database.
 * 
 */
class DataAccessForPopupHorses {
    constructor() {
        this.databaseConnection = new DatabaseConnection('PopupHorses', 'Horses', 'horseURL');
        this.promiseQueue = Queue;
        this.initDataAccessForDailyHorses();
    }
    /**
     * Initializes data access for popup Horses.
     * Enqueues the initialization of the database connection.
     */
    initDataAccessForDailyHorses() {
        this.promiseQueue.enqueue(() => {
            return this.databaseConnection.init();
        });

    }

    /**
     * 
     * @param {Object} popupHorse 
     * @returns {Promise} A Promise that resolves when the run is added.
     */
    addPopupHorseToDB(popupHorse) {

        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(popupHorse);
        })
    }

    addOrUpdatePopupHorseToDB(popupHorse) {
        // console.log("Datamanagement: addOrUpdatePopupHorseToDB");
        // console.log(popupHorse);
        /*return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(popupHorse);
                //.catch(error=>this.updateShowInPopup(popupHorse.horseURL,popupHorse.showInPopup)); // und im errorfall das show in popup
        })*/
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(popupHorse.horseURL)
                .then(({ msg, result }) => {
                    if (result == undefined) {
                        return this.databaseConnection.insertOrErrorItem(popupHorse);
                    } else {
                        result.showInPopup = popupHorse.showInPopup;
                        // console.log("[Datamanagement addOrUpdatePopupHorseToDB]",result);
                        return this.databaseConnection.insertOrOverrideItem(result);
                    }
                })
                /*.catch((error) => {
                    console.log(error);
                    return this.databaseConnection.insertOrErrorItem(popupHorse);
                })*/
        });
    }

    updateSleepTimestamp(horseURL, sleepTimestamp) {
        //console.log("[Datamanagement updateSleepTimestamp]");
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(horseURL)
                .then(({ msg, result }) => {
                    //console.log("result im sleeptimestapmejrlkwjrelw: ",result);
                    result.sleepTimestamp = sleepTimestamp;
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });
    }

    updateDropTimestamp(horseURL, dropTimestamp) {

        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(horseURL)
                .then(({ msg, result }) => {
                    result.dropTimestamp = dropTimestamp;
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });
    }

    //*
    updateDropHorseAge(horseURL, dropHorseAge) {
        //console.log("[Datamangement, updateDropHorseAge] anwesend", horseURL, dropHorseAge);
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(horseURL)
                .then(({ msg, result }) => {
                    result.dropHorseAge = dropHorseAge;
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });
    } // */

    updateShowInPopup(horseURL, showInPopup) {

        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(horseURL)
                .then(({ msg, result }) => {
                    result.showInPopup = showInPopup;
                    return this.databaseConnection.insertOrOverrideItem(result);
                })
        });

    }
    
    /**
     * Fetches all PopupHorses from the database.
     * @returns {Promise} A Promise that resolves with an array of all PopupHorses.
     */
    getAllPopupHorses() {
        console.log("[Datamanagement, getAllPopupHorses] called");
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }
    
    /**
     * Fetches one PopupHorse from the database.
     * @returns {Promise} A Promise that resolves with the required PopupHorse.
     */
    getPopupHorse(horseURL) {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getItem(horseURL);
        });

    }
    
}

class DailyHorsesApplicationLog {
    constructor() {
        this.databaseConnection = new DatabaseConnection('DailyHorsesApplicationLog', 'Log', ['horseURL','timeStamp']);
        this.promiseQueue = Queue;
        this.initDailyHorsesApplicationLog();
    }
    /**
     * Initializes data access for Application log.
     * Enqueues the initialization of the database connection.
     */
    initDailyHorsesApplicationLog() {
        this.promiseQueue.enqueue(() => {
            return this.databaseConnection.init();
        });

    }


    /**
     * Adds a drop data to the database.
     * @param {Object} horseLoggingObject - The Horse object to be added.
     * @returns {Promise} A Promise that resolves when the horse is added.
     */
    addApplicationLog(ApplicationLogObject) {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.insertOrErrorItem(ApplicationLogObject)
        })
    }
    getAlladdApplicationLogs() {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllItems();
        });

    }
    
    getKeys() {
        return this.promiseQueue.enqueue(() => {
            return this.databaseConnection.getAllKeys();
        });
    }

}

const dataAccessForDailyHorses = new DataAccessForDailyHorses();
const dataAccessForPopupHorses = new DataAccessForPopupHorses();
const dailyHorsesApplicationLog = new DailyHorsesApplicationLog();

