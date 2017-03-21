const Event = require('../server/database/objectClasses/Event.js');
const assert = require('assert');

describe ('Event Create', function() {
  before(function(done) {
    var testevent1 = new Event(
      'eventTest1',
      'description',
      new Date('October 13, 2014 11:13:00'),
      new Date('October 14, 2014 21:00:00'),
      'NUS',
      'map',
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['game', 'software engineering'],
    );

    testevent1.saveEvent((err)  =>  {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Event.clearAllEvents((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it ('Should be able to add a new Event', function(done) {
    var testevent3 = new Event(
      'eventTest3',
      'description',
      new Date('June 25, 2017 00:00:00'),
      new Date('October 31, 2017 23:59:59'),
      'Someone House',
      'map','https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['event test 3'],
    );
    testevent3.saveEvent((err)  =>  {
      if (err) {
        console.log(err);
      }
      Event.getEvent('eventTest3', (err1, doc) => {
        if (err1){
          console.log('Unable to execute getEvent function properly');
        } 
        assert.equal('eventTest3', doc.event_name);
        done();
      });
    });
  });

  it ('Should not be able to add an Event with the same name', function(done) {
    var testevent2 = new Event('eventTest1',
                               ' new description',
                               new Date('October 31, 2017 00:00:00'),
                               new Date('October 31, 2017 23:59:59'),
                               'Someone House',
                               'map',
                               'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
                               ['game']
                              );
    testevent2.saveEvent((err)  =>  {
      //expect duplicate error to be thrown
      assert.notEqual(err, null);

      //Old data should still be retained
      Event.getEvent('eventTest1', (err1, doc) => {
        if (err1) {
          console.log('Unable to execute getEvent function properly');
        } 
        assert.equal(doc.event_description, 'description');
        done();
      });
    });
  });

});

describe ('Event Read', function() {

  before(function(done) {
    var testevent2 = new Event(
      'eventTest2',
      'description',
      new Date('Dec 25, 2017 00:00:00'), 
      new Date('Dec 25, 2017 23:59:59'),
      'NUS', 'map','https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['software engineering']
    );
    testevent2.saveEvent((err) => {
      if (err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    Event.clearAllEvents((err) => {
      if (err){
        console.log(err);
      }
      done();
    });
  });


  it ('Should be able to retrieve an existing object', function(done) {
    Event.getEvent('eventTest2', (err,  doc) => {
      if (err){
        console.log('Unable to execute getEvent function properly');
      } 
      assert.equal(doc.event_name, 'eventTest2');
      done();
    });
  });

  it ('Should not be able to retrieve a non-existing object', function(done) {
    Event.getEvent('eventTest4', (err,  doc) => {
      if (err){
        console.log('Unable to execute getEvent function properly');
      } 
      assert.equal(doc, null);
      done();
    });
  });

  it ('should be able to identify if its an existing event', function(done){

    Event.isExistingEvent('eventTest2', (err, doc) => {
      if (err){
        console.log('error with isExisting');
      } else{
        assert.equal(true, doc)
      }
      done();
    });
  });

  it ('should be able to identify if its an existing event', function(done){
    Event.isExistingEvent('eventTest4', (err, doc) => {
      if (err){
        console.log('error with isExisting');
      } else{
        assert.equal(false, doc)
      }
      done();
    });
  });

  it ('should be able to get a list of events by tag', function(done){
    Event.searchEventsByTag('engineering', (err,  results) => {
      if (err){
        console.log('error with searching by tag unit test');
      } else {
        assert.notEqual(results, null);
      }
      done();
    });
  });

});

describe('Event Update', function(){

  before(function(done) {
    var testevent2 = new Event(
      'eventTest2',
      'description',
      new Date('Dec 25, 2017 00:00:00'),
      new Date('Dec 25, 2017 23:59:59'),
      'NUS',
      'map',
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['software engineering']
    );
    testevent2.saveEvent((err)  =>  {
      if (err) {
        console.log('Unable to save Event obj');
        console.log(err);
      }
      done();
    })
  });

  after (function(done) {
    Event.clearAllEvents((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it ('should be able to update an existing event', function(done) {
    Event.updateEvent(
      'eventTest2',
      'This is an updated description',
      new Date('April 8, 2017 00:00:00'),
      new Date('April 8, 2017 23:59:59'),
      'Home',
      'map',
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['engineering', 'database'],
      (err,  results) => {
        if (err) {
          console.log('unable to update');
        } else {
          assert.equal('This is an updated description', results.event_description);
        }
        done();
      });
  });
});

describe ('Event Delete', function() {

  before(function(done) {
    var testevent1 = new Event(
      'eventTest1',
      'description',
      new Date('October 13, 2014 11:13:00'),
      new Date('October 14, 2014 21:00:00'),
      'NUS',
      'map',
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
      ['game', 'software engineering']
    );
    testevent1.saveEvent((err) => {
      if (err){
        console.log(err);
      }
      done();
    })
  });

  after (function(done) {
    Event.clearAllEvents((err) => {
      if (err){
        console.log(err);
      }
      done();
    });
  });

  it('should be able to remove an event from the database',function(done) {
    Event.deleteEvent('eventTest1', (err)  =>  {
      if (err){
        console.log(err);
      }

      // Checks to see if it's removed
      Event.getEvent('eventTest1', (err, obj) => {
        if (err) {
          console.log('unable to get event in update existing unit test');
        } else {
          assert.equal(null, obj);
        }
        done();
      });
    });
  });
});