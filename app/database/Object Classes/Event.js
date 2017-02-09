
function Event(EventName, EventDescription, StartDate, EndDate, Location, Map) {
    //self-generated eventID
    var EventID = 0; //dummy value
    this.EventName = EventName;
    this.EventDescription = EventDescription;
    this.StartDate = StartDate;
    this.EndDate = EndDate;
    this.Location = Location;
    this.Map = Map;

    this.getEventID = function () {
        return EventID;
    };
}