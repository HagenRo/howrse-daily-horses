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
        this.searchStrings = searchStrings; // which regex expressions we're looking for
        this.isReadyOnWakeup = isReadyOnWakeup; // whether the message will be there when the horse wakes up
        this.valueIfStringNotFound = valueIfStringNotFound;
        this.isUnimportant = isUnimportant;
        this.isExemption = isExemption; // like Onyx with the UFOs or Pluto, with a message that doesn't trigger at one specific point in time
        this.exemptionFunction = exemptionFunction; // how to work this exemption
    }

    //methoden...
    getDbObject(){
        return this.dbObject;
    }
}