const Comment = require("../app/database/objectClasses/Comment.js");
const assert = require('assert');

describe('Comment Create', function(){
  before(function(done) {
    var testcomment1 = new Comment('user1@user.com',
                                   'MAMA! LAVA!',
                                   'awesome!',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testcomment1.saveComment(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Comment.clearAllComment(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it('should be able to add a new message object', function(done){
    var testcomment2 = new Comment('user2@user.com',
                                   'MAMA! LAVA!',
                                   'hey man thanks!',
                                   new Date('October 14, 2014 21:01:00'),
                                  );
    testcomment2.saveComment(function callback(err) {
      if (err) {
        console.log(err);
      }
      // check that its inside the databse
      Comment.getCommentForExhibition('MAMA! LAVA!', function cb(err, commentObj){
        if (err){
          console.log("error with getting comment for an event");
        } else {
          assert.equal(commentObj[1].comments[0].content,'hey man thanks!');
        }
        done();
      });
    });
  });
});

describe('Comment Read', function(){
  before(function(done) {
    var testcomment3 = new Comment('user3@user.com',
                                   'ExI',
                                   'Could use work',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testcomment3.saveComment(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Comment.clearAllComment(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it('Should be able to obtain date from an existing exhibition', function(){
    Comment.getCommentForExhibition('ExI', function cb(err, commentObj){
      if (err){
        console.log("error with getting comment for an event");
      } else {
        assert.equal(commentObj[0].comments[0].content,'Could use work');
      }
    });
  });

  it('Should not be able to obtain date from a non-existing exhibition', function(){
    Comment.getCommentForExhibition('Exo', function cb(err, commentObj){
      if (err){
        console.log("error with getting comment for an event");
      } else {
        assert.equal(commentObj[0], null);
      }
    });
  });
});

describe('Comment Update', function(){
  before(function(done) {
    var testcomment3 = new Comment('user4@user.com',
                                   'NAME',
                                   'Could use work',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testcomment3.saveComment(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Comment.clearAllComment(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it ('should be able to append more comments into the object', function(){
    Comment.addCommentForExhibition(
      'user2@user.com',
      'NAME',
      'I agree',
      new Date('October 14, 2014 22:20:20'),
      function cb(err, results){
        if (err){
          console.log(err);
        } else {
          assert.equal(results[0].comments[0].content, 'I agree');
        }
      });
  });
});