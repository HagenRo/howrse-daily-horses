class Horse{
    //attributes
    url; // version für reset timer inklusive
    searchStrings = []; // gonna be some regex stuff
    isReadyOnWakeup;
    valueIfStringNotFound; // value // bonus, 0 // on wakeup except pluto
    isUnimportant;
    isExemption; // exception // is pluto
    exemptionFunction; // in case you are an EXEMPTION

    constructor(url,searchStrings,isReadyOnWakeup,valueIfStringNotFound,isUnimportant,isExemption,exemptionFunction){
        this.url = url;
        this.searchStrings = searchStrings;
        this.isReadyOnWakeup = isReadyOnWakeup;
        this.valueIfStringNotFound = valueIfStringNotFound;
        this.isUnimportant = isUnimportant;
        this.isExemption = isExemption;
        this.exemptionFunction = exemptionFunction;
    }

    //methoden...
    getDbObject(){
        return this.dbObject;
    }
}