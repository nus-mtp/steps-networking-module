const Event = require('../app/database/objectClasses/Event.js');
const assert = require('assert');

describe ('Event Create', function() {
  before(function(done) {
    var testevent1 = new Event('eventTest1',
                               'description',
                               new Date('October 13, 2014 11:13:00'),
                               new Date('October 14, 2014 21:00:00'),
                               'NUS',
                               'map',
                               'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
                               ['game', 'software engineering'],
                              );

    testevent1.saveEvent(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Event.clearAllEvents(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it ('Should be able to add a new Event', function(done) {
    var testevent3 = new Event('eventTest3',
                               'description',
                               new Date('June 25, 2017 00:00:00'),
                               new Date('October 31, 2017 23:59:59'),
                               'Someone House',
                               'map','https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
                               ['event test 3'],
                              );
    testevent3.saveEvent(function callback(err) {
      if (err) {
        console.log(err);
      }
      Event.getEvent('eventTest3', function callback(err1, doc) {
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
    testevent2.saveEvent(function callback(err) {
      //expect duplicate error to be thrown
      assert.notEqual(err, null);

      //Old data should still be retained
      Event.getEvent('eventTest1', function callback(err1, doc) {
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
    testevent2.saveEvent(function callback (err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    Event.clearAllEvents(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });


  it ('Should be able to retrieve an existing object', function() {
    Event.getEvent('eventTest2', function callback (err, doc){
      if (err){
        console.log('Unable to execute getEvent function properly');
      } 
      assert.equal(doc.event_name, 'eventTest2');
    });
  });

  it ('Should not be able to retrieve a non-existing object', function() {
    Event.getEvent('eventTest4', function callback (err, doc){
      if (err){
        console.log('Unable to execute getEvent function properly');
      } 
      assert.equal(doc, null);
    });
  });

  it ('should be able to identify if its an existing event', function(){

    Event.isExistingEvent('eventTest2', function callback(err,doc){
      if (err){
        console.log('error with isExisting');
      } else{
        assert.equal(true, doc)
      }
    });

    Event.isExistingEvent('eventTest4', function callback(err,doc){
      if (err){
        console.log('error with isExisting');
      } else{
        assert.equal(false, doc)
      }
    });
  });

  it ('should be able to get a list of events by tag', function(){
    Event.searchEventsByTag('engineering', function callback(err, results){
      if (err){
        console.log('error with searching by tag unit test');
      } else {
        assert.notEqual(results, null);
      }
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
    testevent2.saveEvent(function callback(err) {
      if (err) {
        console.log('Unable to save Event obj');
        console.log(err);
      }
      done();
    })
  });

  after (function(done) {
    Event.clearAllEvents(function(err) {
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
      function callback(err){
        if (err) {
          console.log('unable to update');
        }
        Event.getEvent('eventTest2', function callback(err, obj) {
          if (err) {
            console.log('unable to get event in update existing unit test');
          } 
          assert.equal('This is an updated description', obj.event_description);
        });
      });
    done();
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
    testevent1.saveEvent(function callback (err){
      if (err){
        console.log(err);
      }
      done();
    })
  });

  after (function(done) {
    Event.clearAllEvents(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  it('should be able to remove an event from the database',function() {
    Event.deleteEvent('eventTest1', function callback(err) {
      if (err){
        console.log(err);
      }

      // Checks to see if it's removed
      Event.getEvent('eventTest1', function callback(err, obj) {
        if (err) {
          console.log('unable to get event in update existing unit test');
        } 
        assert.equal(null, obj);
      });
    });
  });
});