chrome.runtime.sendMessage({ function: "getAllDropData" }, (response) => {
    console.log("Response", response.result);
});
//TODO: neue datenbank anlegen, in der die kummulierte Statistik abgelegt ist, erzeugt im dataparser 
chrome.runtime.sendMessage({ function: "getDropInRange", indexName: 'timeStamp', lowerBound: 1767222000000 }, (response) => {
    console.log("getDropInRange:", response.result);
    let dataParser = new DataParser(response.result);
    let statisticForHorsesHandler = new StatisticForHorsesHandler(dataParser.getAccumulatedStatistic());
});
/**
 * Hier werden die daten, die im horseLoggingobject gespeichert sind in Menschlesbare Informationen umgewandelt.
 */
class DataParser {

    //TODO: hier die member anpassen, anhand der Spalten und den anzeigetabellen.
    accumulatedStatisticExample = {
        dropDeltaTimestamp: null,//Zeitpunkt des zuletzt aufgenommenen drops. //TODO: muss noch in acumulated drops jedesmal gesetzt werden, sodass hier am ende der timestamp des äletesten drops drin steht.
        horses: {
            "<horseURL>": {
                horseDomain: null, // aus der URL ausgelesen
                horseID: null, // aus der URL ausgelesen
                horseType: null, // Familienname
                horseName: null, // intern vereinheitlichten
                lastDropTimeStamp: null, // wird zu "letzter Drop Timestamp"
                lastDropHorseAge: null, // last drop horse age
                firstDropTimeStamp: null, // to get the date when we started recording the drops of this horse
                HorseAgeAtFirstDrop: null, //alter des pferdes, beim ersten verzeichnenten Drop
                HorseAgeAtWOY: null, // Water of Youth, alter als Wasser der Jugend auf das Pferd gekommen ist. Erstes Pferdealter mit ungeradem Monat minus 1.
                lastDropAmount: null,
                lastDropType: null,
                countDrops: null, // anzahl der verrechneten Drops für diesen dropType zur berechnung des Averages
                amountLoggedHorseDays: null,


                displayDrops: {
                    "<dropType>": {
                        dropType: null, // inklusive subtype! // kann der gesamtdroptype sein, kann aber auch aufgesplittet nach dropmenge sein // wird (genau) bei den spices erweitert durch amountClicks
                        dropAmountSum: null, // 
                        dropAmountAverage: null, // average über alle Drops, die Menge für diesen Type (bsp: insgesamt gab es etwa 1 AP pro Tag, obwohl auch andere dinge gedropt werden)
                        dropTypeAmountAverage: null, // average über nur die Male, wo dieser Type (unabhängig der Menge) gedropt wurde (bsp: 79 von 380 Drops waren irgendwelche Mengen an Apfelsamen)
                        countDropType: null, // anzahl, wie oft dieser Droptype gedropt wurde - zählt für den Type, und auch zusätzlich abhängig von den möglichen Mengen // bei spices auch für amountClicks
                        averageDaysUntilDrop: null, // countDrops / wird berechnet lastDropHorseAge - HorseAgeAtFirstDrop //verrechnung von alter ist abhängig von wasser der jugend Alter HorseAgeAtWOY
                        averageDropAmountPerHorseAge: null,
                    }
                }
            }
        }


    }

    drops;
    accumulatedStatistic;
    //hier vermulich auch gleich filtern was in welchem tab angezeigt werden soll in unterschiedliche arrays
    constructor(horseLoggingObjects, accumulatedStatistic) {
        this.drops = horseLoggingObjects;
        this.accumulatedStatistic = accumulatedStatistic ? accumulatedStatistic : {
            horses: {}
        };
        this.#accumulateDrops();
        console.log("acc.Statistic: ", this.accumulatedStatistic);
    }
    getAccumulatedStatistic(){
        return this.accumulatedStatistic;
    }

    /**
     * Durchläuft alle Drops in horseLoggingObjects und rechnet sie auf die accumulatedStatistic auf.
     */
    #accumulateDrops() {
        this.drops.forEach(drop => {
            // horse domain
            let horseURL = drop.horseURL;
            let displayDropTypes = this.#getDisplayDropTypes(drop.dropType, drop.dropSubType, drop.dropAmount, drop.amountClicks)

            let horseStatistic = this.accumulatedStatistic.horses[horseURL];
            let thisIsANewEntry = false;
            // falls sie nicht existiert: anlegen
            if (!horseStatistic) {
                horseStatistic = {};
                horseStatistic.displayDrops = {};
                thisIsANewEntry = true;

                // nur beim anlegen
                horseStatistic.horseDomain = this.#getHorseDomain(drop.horseURL);
                horseStatistic.horseID = this.#getHorseID(drop.horseURL);
                horseStatistic.horseType = drop.horseType;
                horseStatistic.horseName = drop.horseName;
            }
            // falls existent bzw. ansonsten danach: updaten
            if (!horseStatistic.horseType) {
                horseStatistic.horseType = drop.horseType;
            }
            if (!horseStatistic.horseName) {
                horseStatistic.horseName = drop.horseName;
            }

            //TODO: übergreifende horse eigenschaften befüllen
            // erst mal davon ausgehen, dass man es neu anlegt - logik für modifizieren und zusammenführen machen wir später
            // alle Sachen zu dem generellen Pferd: horse-URL zerlegen in domain und ID, Familienname, Pferdename, zeitpunkt letzter drop, 
            // alles was bei horseID steht oben, wird hier befüllt
            // horseStatistic.horseDomain = ;

            horseStatistic.firstDropTimeStamp = this.#getFirstDropTimeStamp(horseStatistic.timeStamp, drop.timeStamp); // so!
            // beim updaten - vermutlich, wenn ich nix übersehen habe
            if (this.#horseAgeIsLessThan(horseStatistic.lastDropHorseAge, drop.dropHorseAge)) { // falls neuer, späterer Drop
                horseStatistic.lastDropTimeStamp = drop.timeStampHumanReadable;
                horseStatistic.lastDropHorseAge = drop.dropHorseAge; // falls größer, falls Drop überhaupt neu
                horseStatistic.HorseAgeAtFirstDrop = horseStatistic.HorseAgeAtFirstDrop ? horseStatistic.HorseAgeAtFirstDrop : drop.dropHorseAge;
                horseStatistic.lastDropAmount = drop.dropAmount;
                horseStatistic.lastDropType = this.#getDisplayDropTypes(drop.dropType, drop.dropSubType, drop.dropAmount, drop.amountClicks).pop();
            }
            // falls drophorseage niedriger ist als letzter drop, müssen wir evtl. horseageatfirstdrop anpassen
            horseStatistic.HorseAgeAtFirstDrop = this.#horseAgeIsLessThan(horseStatistic.HorseAgeAtFirstDrop, drop.dropHorseAge) ? horseStatistic.HorseAgeAtFirstDrop : drop.dropHorseAge;

            // handle water of youth
            if (parseInt(parseInt(drop.dropHorseAge[1]) % 2) == 1) {
                horseStatistic.HorseAgeAtWOY = (horseStatistic.HorseAgeAtWOY && this.#horseAgeIsLessThan(horseStatistic.HorseAgeAtWOY, drop.dropHorseAge)) ? horseStatistic.HorseAgeAtWOY : [drop.dropHorseAge[0], parseInt(drop.dropHorseAge[1]) - 1];
            }

            horseStatistic.countDrops = horseStatistic.countDrops ? parseInt(horseStatistic.countDrops) + 1 : 1;
            Object.defineProperty(horseStatistic, 'amountLoggedHorseDays', {
                get: () => {
                    return parseInt(parseInt(this.subtractHorseAges(horseStatistic.lastDropHorseAge, horseStatistic.HorseAgeAtFirstDrop, horseStatistic.HorseAgeAtWOY) + 1));  // Berechnung des erfragten Durchschnitts
                },
                enumerable: true, // Das Member wird in Schleifen sichtbar
                configurable: true // Das Member kann später modifiziert werden
            });
            Object.defineProperty(horseStatistic, 'firstDropTimeStampHumanReadable', {
                get: () => {
                    return new Date(horseStatistic.firstDropTimeStamp).toLocaleString();  // Berechnung des erfragten Durchschnitts
                },
                enumerable: true, // Das Member wird in Schleifen sichtbar
                configurable: true // Das Member kann später modifiziert werden
            });

            //console.log("displayDropTypes", displayDropTypes);

            displayDropTypes.forEach(displayDropType => {
                let dropStatistic = horseStatistic.displayDrops[displayDropType];
                let thisIsANewDropStat = false;

                // wenn dropstatistic nicht existiert: neuen anlegen etc. wie oben basically
                if (!dropStatistic) {
                    dropStatistic = {};
                    thisIsANewDropStat = true;
                    dropStatistic.dropType = displayDropType;
                    // Dynamisches Hinzufügen eines Members mit einer Getter-Funktion
                    Object.defineProperty(dropStatistic, 'dropAmountAverage', {
                        get: function () {
                            return parseFloat(parseInt(dropStatistic.dropAmountSum) / horseStatistic.countDrops);  // Berechnung des erfragten Durchschnitts
                        },
                        enumerable: true, // Das Member wird in Schleifen sichtbar
                        configurable: true // Das Member kann später modifiziert werden
                    });
                    Object.defineProperty(dropStatistic, 'dropTypeAmountAverage', {
                        get: function () {
                            return parseFloat(dropStatistic.dropAmountSum / dropStatistic.countDropType);  // Berechnung des erfragten Durchschnitts
                        },
                        enumerable: true, // Das Member wird in Schleifen sichtbar
                        configurable: true // Das Member kann später modifiziert werden
                    });
                    Object.defineProperty(dropStatistic, 'averageDaysUntilDrop', {
                        get: () => { // alle x Tage gibts diesen Drop
                            //console.log("avgDaysUntilDrop rechnet:", "alter jetzt: ", horseStatistic.lastDropHorseAge, "alter am Anfang: ", horseStatistic.HorseAgeAtFirstDrop," verrechnen: ",parseInt(this.subtractHorseAges(horseStatistic.lastDropHorseAge,horseStatistic.HorseAgeAtFirstDrop)));
                            //console.log("durch: ",parseInt(dropStatistic.countDropType));
                            return parseFloat(parseInt(this.subtractHorseAges(horseStatistic.lastDropHorseAge, horseStatistic.HorseAgeAtFirstDrop, horseStatistic.HorseAgeAtWOY) + 1) / parseInt(dropStatistic.countDropType));  // Berechnung des erfragten Durchschnitts
                        },
                        enumerable: true, // Das Member wird in Schleifen sichtbar
                        configurable: true // Das Member kann später modifiziert werden
                    });
                    Object.defineProperty(dropStatistic, 'averageDropAmountPerHorseAge', {
                        get: () => {
                            return parseFloat(parseInt(dropStatistic.dropAmountSum) / parseInt(this.subtractHorseAges(horseStatistic.lastDropHorseAge, horseStatistic.HorseAgeAtFirstDrop, horseStatistic.HorseAgeAtWOY) + 1));  // Berechnung des erfragten Durchschnitts
                        },
                        enumerable: true, // Das Member wird in Schleifen sichtbar
                        configurable: true // Das Member kann später modifiziert werden
                    });
                }


                // alles was bei <dropType> steht, soll hier gebastelt werden

                dropStatistic.dropAmountSum = dropStatistic.dropAmountSum ? parseInt(parseInt(dropStatistic.dropAmountSum) + parseInt(drop.dropAmount)) : drop.dropAmount; // 1x 35 Apfelsamen wären dann +35.
                dropStatistic.countDropType = dropStatistic.countDropType ? parseInt(parseInt(dropStatistic.countDropType) + 1) : 1;
                // Averages - TODO - am Ende in der Anzeige aktualisieren
                // horseStatistic.dropAmountAverage = parseFloat(parseInt(dropStatistic.dropAmountSum)/horseStatistic.countDrops); 
                // dropStatistic.dropTypeAmountAverage = parseFloat(dropStatistic.countDropType / dropStatistic.dropAmountSum);
                // dropStatistic.averageDropRateByHorseAge = parseFloat(dropStatistic.countDropType / this.#subtractHorseAges(horseStatistic.lastDropHorseAge,horseStatistic.HorseAgeAtFirstDrop));

                if (thisIsANewDropStat) {
                    horseStatistic.displayDrops[displayDropType] = dropStatistic;
                }
            });

            if (thisIsANewEntry) { // falls nicht existent war
                this.accumulatedStatistic[horseURL] = horseStatistic;// ganz am Ende nochmal, beim ersten erstellen
            }
        });
    }

    #getFirstDropTimeStamp(horseStatisticTimeStamp, dropTimeStamp) {
        if (horseStatisticTimeStamp) {
            return (horseStatisticTimeStamp < dropTimeStamp) ? horseStatisticTimeStamp : dropTimeStamp;
        }
        return dropTimeStamp;
    }

    #getHorseDomain(url) {
        //
        let horseDomain = url.match(/https:\/\/(.+)\/elevage.+/)[1];
        // console.log("horseDomain",horseDomain);
        return horseDomain;
    }

    #getHorseID(url) {
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
    #getDisplayDropTypes(dropType, dropSubType, dropAmount, amountClicks) {
        let newDropTypes = [];

        newDropTypes.push("" + dropType);
        newDropTypes.push("" + dropType + " | Amount: " + dropAmount);
        if (dropSubType) {
            newDropTypes.push("" + dropType + " | " + dropSubType);
            newDropTypes.push("" + dropType + " | " + dropSubType + " | Amount: " + dropAmount);

            if (amountClicks > 0) {
                newDropTypes.push("" + dropType + " | " + dropSubType + " | Clicks: " + amountClicks);
                newDropTypes.push("" + dropType + " | " + dropSubType + " | Clicks: " + amountClicks + " | Amount: " + dropAmount);
            }

        } else {
            if (amountClicks > 0) {
                newDropTypes.push("" + dropType + " | Clicks: " + amountClicks); // ist das überhaupt sinnvoll? 
                newDropTypes.push("" + dropType + " | Clicks: " + amountClicks + " | Amount: " + dropAmount); // order tauschen?
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
    // #getHorseAgeDiff(firstAge,secondAge,ageAtWOY) {
    //     //
    //     let ageings = 0; 
    //     if (!ageAtWOY) {
    //         ageings = (secondAge[0]-firstAge[0])*6 + (secondAge[1]-firstAge[1])/2; 
    //     }
    // }

    /**
     * determines, whether the first age is less than the second age, i.e. whether they are "in order"
     * @param {*} firstAge 
     * @param {*} secondAge 
     * @returns {Boolean} true or false
     */
    #horseAgeIsLessThan(firstAge, secondAge) {
        // kann man kürzen
        if (!firstAge) {
            return true;
        }
        if (!secondAge) {
            return false;
        }
        if (parseInt(firstAge[0]) > parseInt(secondAge[0])) {
            return false;
        }
        else if (parseInt(firstAge[0]) < parseInt(secondAge[0])) {
            return true;
        }
        else if (parseInt(firstAge[1]) < parseInt(secondAge[1])) { // gleiches Alter in Jahren
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
    subtractHorseAges(firstAge, secondAge, ageAtWOY) {
        let yearDiff = 0;
        let monthDiff = 0;
        let totalDiffInAgeings = 0;
        //console.log("age at WOY!!",ageAtWOY);
        if (!ageAtWOY) {
            yearDiff = firstAge[0] - secondAge[0];
            monthDiff = firstAge[1] - secondAge[1];
            totalDiffInAgeings = yearDiff * 6 + parseInt(monthDiff / 2);
        }
        else {
            if (this.#horseAgeIsLessThan(secondAge, ageAtWOY)) {// if it didn't always have WoY apparently
                yearDiff = ageAtWOY[0] - secondAge[0];
                monthDiff = ageAtWOY[1] - secondAge[1];
                totalDiffInAgeings = yearDiff * 6 + parseInt(monthDiff / 2);
            }
            //console.log("hallo ganz normaler edelstein hier");
            yearDiff = firstAge[0] - ageAtWOY[0];
            monthDiff = firstAge[1] - ageAtWOY[1];
            totalDiffInAgeings = totalDiffInAgeings + (yearDiff * 12) + parseInt(monthDiff);
        }
        return parseInt(totalDiffInAgeings);
    }


}

class StatisticForHorsesHandler {
  constructor(accumulatedStatistic) {
    this.accumulatedStatistic = accumulatedStatistic || window.accumulatedStatisticExample || { horses: {} };
    this.tableBody = document.getElementById('statisticForHorsesBody');
    // expose API
    window.rebuildHorseStatistics = () => this.buildTable();
    // initial build
    this.buildTable();
  }

  buildTable() {
    if (!this.tableBody) return;
    this.tableBody.innerHTML = '';
    const horses = this.accumulatedStatistic.horses || {};
    const urls = Object.keys(horses);
    urls.forEach(url => {
      const h = horses[url];

      const tr = document.createElement('tr');
      tr.className = 'summary';
      tr.dataset.url = url;

      // 1 Pferd
      const tdPferd = document.createElement('td');
      tdPferd.innerHTML = '<span class="expand-indicator">▶</span>' +
        '<strong>' + this.showVal(h.horseName) + '</strong>' +
        '<div class="muted small">' + this.showVal(h.horseID) + ' @ ' + this.showVal(h.horseDomain) + '</div>';
      tr.appendChild(tdPferd);

      // 2 aktuell
      const tdAktuell = document.createElement('td');
      tdAktuell.textContent = this.showVal(h.lastDropHorseAge);
      tr.appendChild(tdAktuell);

      // 3 Drop Menge Schnitt
      const avg = this.calcOverallDropAmountAverage(h);
      const tdDropAvg = document.createElement('td');
      tdDropAvg.textContent = avg !== null ? avg : this.showVal(h.lastDropAmount);
      tr.appendChild(tdDropAvg);

      // 4 Drop Menge zuletzt
      const tdLastAmount = document.createElement('td');
      tdLastAmount.textContent = this.showVal(h.lastDropAmount);
      tr.appendChild(tdLastAmount);

      // 5 Droptyp zuletzt
      const tdLastType = document.createElement('td');
      tdLastType.textContent = this.showVal(h.lastDropType);
      tr.appendChild(tdLastType);

      // 6 zuletzt versorgt am
      const tdLastTime = document.createElement('td');
      tdLastTime.textContent = this.formatDate(h.lastDropTimeStamp);
      tr.appendChild(tdLastTime);

      // 7 Hauptpreis Häufigkeit
      const mainFreq = this.calcMainPrizeFrequency(h);
      const tdMainFreq = document.createElement('td');
      tdMainFreq.textContent = mainFreq !== null ? mainFreq : "-";
      tr.appendChild(tdMainFreq);

      // 8 letzter Hauptpreis am
      const tdMainLast = document.createElement('td');
      tdMainLast.textContent = this.showVal(h.lastDropTimeStamp);
      tr.appendChild(tdMainLast);

      // click toggles detail row (bind this)
      tr.addEventListener('click', () => this.toggleDetails(url, tr));

      this.tableBody.appendChild(tr);
    });
  }

  showVal(v) {
    if (v === null || v === undefined) return "-";
    if (typeof v === 'number') return v;
    return String(v);
  }

  cssEscape(s) {
    return String(s).replace(/["'\\\[\]]/g, '\\$&');
  }

  toggleDetails(url, summaryRow) {
    const existing = document.querySelector('tr[data-details-for="' + this.cssEscape(url) + '"]');
    if (existing) {
      existing.remove();
      const ind = summaryRow.querySelector('.expand-indicator');
      if (ind) ind.textContent = '▶';
      return;
    }
    const horses = this.accumulatedStatistic.horses || {};
    const horse = horses[url];
    const detailsTr = document.createElement('tr');
    detailsTr.className = 'details';
    detailsTr.dataset.detailsFor = url;
    const td = document.createElement('td');
    td.colSpan = summaryRow.children.length;

    // inner detail table
    const inner = document.createElement('table');
    inner.style.width = '100%';
    inner.style.borderCollapse = 'collapse';
    inner.style.margin = '6px 0';

    const thead = document.createElement('thead');
    const hr = document.createElement('tr');

    const display = horse.displayDrops || {};
    const dropKeys = Object.keys(display);
    const displayColsSet = new Set();
    dropKeys.forEach(k => {
      Object.keys(display[k] || {}).forEach(attr => displayColsSet.add(attr));
    });
    const displayCols = ['dropType', ...Array.from(displayColsSet).filter(c => 'dropType' !== c)];
    displayCols.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c;
      th.style.border = '1px solid #e5e7eb';
      th.style.padding = '6px';
      th.style.background = '#f8fafc';
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    inner.appendChild(thead);

    const innerBody = document.createElement('tbody');
    dropKeys.forEach(dt => {
      const row = document.createElement('tr');
      displayCols.forEach(c => {
        const cell = document.createElement('td');
        cell.textContent = this.showVal(display[dt][c]);
        cell.style.border = '1px solid #eee';
        cell.style.padding = '6px';
        row.appendChild(cell);
      });
      innerBody.appendChild(row);
    });
    inner.appendChild(innerBody);

    td.appendChild(inner);
    detailsTr.appendChild(td);
    summaryRow.after(detailsTr);
    const ind = summaryRow.querySelector('.expand-indicator');
    if (ind) ind.textContent = '▼';
  }

  calcMainPrizeFrequency(h) {
    const d = h.displayDrops || {};
    const keys = Object.keys(d);
    if (keys.length === 0) return null;
    let best = null;
    keys.forEach(k => {
      const cnt = (d[k] && typeof d[k].countDropType === 'number') ? d[k].countDropType : 0;
      if (best === null || cnt > best.count) {
        best = { key: k, count: cnt };
      }
    });
    return best ? best.count : null;
  }

  calcOverallDropAmountAverage(h) {
    const d = h.displayDrops || {};
    const keys = Object.keys(d);
    if (keys.length === 0) return null;
    let total = 0, weight = 0;
    keys.forEach(k => {
      const item = d[k];
      const avg = (item && typeof item.dropAmountAverage === 'number') ? item.dropAmountAverage : null;
      const cnt = (item && typeof item.countDropType === 'number') ? item.countDropType : 1;
      if (avg !== null) {
        total += avg * cnt;
        weight += cnt;
      }
    });
    if (weight === 0) return null;
    const val = total / weight;
    return Math.round(val * 100) / 100;
  }

  formatDate(s) {
    if (!s) return "-";
    try {
      const dt = new Date(s);
      if (isNaN(dt)) return this.showVal(s);
      return dt.toISOString().slice(0, 10);
    } catch (e) {
      return this.showVal(s);
    }
  }
}
