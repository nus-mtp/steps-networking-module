class EventClass{
    constructor(EventID, EventName = "eventName", EventDescription = "description", StartDate = 0, EndDate = 0, Location = "location", Map = null) {
        //self-generated eventID
        this.EventID=0; //dummy value
        this.EventName=EventName;
        this.EventDescription=EventDescription;
        this.StartDate=StartDate;
        this.EndDate=EndDate;
        this.Location=Location;
        this.Map=Map;
    }

    getEventID() {
        return this.EventID;
    }  

    getEventname(){
        return this.EventName;
    }

    getEventDescription(){
        return this.EventDescription;
    }

    getStartDate(){
        return this.StartDate;
    }

    getEndDate(){
        return this.EndDate;
    }

    getLocation(){
        return this.Location;
    }

    getMap(){
        return Map;
    }
        getEventID() {
        return this.EventID;
    }  

    setEventname(newEventName){
        this.EventName = newEventName;
    }

    getEventDescription(newEventDescription){
        this.EventDescription = newEventDescription;
    }

    getStartDate(newStartDate){
        this.StartDate = newStartDate;
    }

    getEndDate(newEndDate){
        this.EndDate = newEndDate;
    }

    getLocation(newLocation){
        this.Location = newLocation;
    }

    getMap(newMap){
        this.Map = newMap;
    }
}

