const User = require('../server/database/objectClasses/User.js');
const assert = require('assert');

describe ('User Create',function() {

  before(function(done) {
    var userTest2 = new User(
      'usertesting_2@user.com', 
      'UserTest2', 
      'I am the second test user.',
      'password456', false, false, 
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', 
      ['Producing skills', 'Photoshop', 'Illustrator', 'AutoCAD', 'Microsoft Office'],
      []
    );
    userTest2.saveUser(function (err){
      if(err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    User.clearAllUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  it('Should be able to add new Users', function(done) {
    var userTest3 = new User(
      'usertesting_3@user.com', 
      'UserTest3', 
      'I am the third test user.',
      'password789', 
      true, 
      false, 
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', 
      ['Project Management', 'Programming skills', 'Objective C', 'C++', 'C#'],
      ['usertesting_1@user.com', 'usertesting_2@user.com']
    ); 
    userTest3.saveUser(function(err) {
      if (err){
        console.log('error with saving user3');
      } else {
        User.getUser('usertesting_3@user.com', function (err1, results){
          if (err1){
            console.log('error with retrieving user3');
          } else {
            assert.notEqual(results,null);
            assert.equal('UserTest3', results.name);
          }
          done();
        });
      }
    });
  });

  it('Should not be able to add Users with duplicate email', function(done) {
    var userTestDup = new User(
      'usertesting_2@user.com', 
      'UserTest2 again~!', 
      'I am the duplicated second test user.',
      'sadawe123', 
      false, 
      false, 
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', 
      ['Project Management', 'Programming skills', 'Objective C', 'C++', 'C#'],
      [, 'usertesting_2@user.com']
    ); 
    userTestDup.saveUser(function (err){
      if (err){
        //duplicate error expected
      }
      User.getUser('usertesting_2@user.com', function(err1, results){
        if (err1) {
          console.log(err);
        }
        else if(results){
          assert.equal(results.name, 'UserTest2');
        }
        else {
          console.log('THERE IS NO SUCH RESULTS');
        }
        done();
      })
    });
  });

});


describe ('User Read',function() {

  before(function(done){

    var userTest1 = new User(
      'usertesting_1@user.com', //email
      'UserTest1', //name
      'I am the first test user.', //description
      'password123', //password
      true, //will_notify
      false, //is_deleted
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', //profile_pic
      ['Programming skills', 'C++', 'Java', 'HTML'], //skills
      ['usertesting_2@user.com']//bookmarked users
    );
    userTest1.saveUser(function (err){
      if(err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    User.clearAllUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  it('Should be able to get a specific existing user', function(done){
    User.getUser('usertesting_1@user.com', function callback(err, userObj){
      if(err){
        console.log('Something went wrong with getting user function');
        console.log(err);
      } else if (userObj) {
        assert.equal(userObj.name, 'UserTest1');
        assert.equal('usertesting_1@user.com', userObj.email);
      } else { 
        console.log('User does not exist');
      }
    });
    done()
  });

  it('Should not be able to get an non-existing user', function(done){
    User.getUser('usertesting_4@user.com', function callback(err, userObj){
      if(err){
        console.log('Something went wrong with getting user function');
        //console.log(err);
      }
      assert.equal(null, userObj);
    });
    done();
  });
});



describe ('User Update',function() {

  before(function(done){

    var userTest1 = new User(
      'usertesting_1@user.com', //email
      'UserTest1', //name
      'I am the first test user.', //description
      'password123', //password
      true, //will_notify
      false, //is_deleted
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', //profile_pic
      ['Programming skills', 'C++', 'Java', 'HTML'], //skills
      ['usertesting_2@user.com'], //bookmarked users
    );
    userTest1.saveUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    User.clearAllUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  it('Should be able to update an existing specific user', function(done){
    User.updateUser(
      'usertesting_1@user.com', 
      'User Test 1 Updated', 
      'my description is updated',
      'changedPassword', 
      false, 
      false, 
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 
      ['c++', 'C#', 'java'],
      [],
      function(err){
        if (err){
          console.log(err);
        }
        User.getUser('usertesting_1@user.com', function(err, results){
          if (err){
            console.log('USER UPDATES TEST: '+err);
          } else{
            assert.notEqual(results, null);
            assert.equal('my description is updated', results.description);
          }
        });
      });
    done();
  });

  it ('Should not be able to update a non-existing user', function(done){
    User.updateUser(
      'user2000@user.com', 
      'i am a duplicate', 
      'my descript is useless',
      'qwe141asdasd1', 
      true, 
      false, 
      'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 
      ['c++', 'C#', 'java'],
      [],
      function(err){
        if (err){
          // no such users error expected
        }
        User.getUser('user2000@user.com', function(err,doc){
          assert.equal(null,doc);
        });
      });
    done();
  });
});

describe ('User Delete',function() {

  before(function(done){

    var userTest2 = new User(
      'usertesting_2@user.com', 
      'UserTest2', 
      'I am the second test user.',
      'password456', false, false, 
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', 
      ['Producing skills', 'Photoshop', 'Illustrator', 'AutoCAD', 'Microsoft Office'],
      []);
    userTest2.saveUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  after (function(done){
    User.clearAllUser(function(err){
      if (err){
        console.log(err);
      }
      done();
    });
  });
  it ('should be able to mark an existing user as deleted', function(done){
    User.setUserAsDeleted('usertesting_2@user.com', true, function callback(err, result){
      if (err){
        console.log('this is the error: '+err);
      } else {
        assert.equal(true, result.is_deleted);
      }
    });
    done();
  });

  it ('should be able to mark an "deleted" user as existing', function(done){
    User.setUserAsDeleted('usertesting_2@user.com', false, function callback(err, result){
      if (err){
        console.log('this is the error: '+err);
      } else if (result){
        assert.equal(false, result.is_deleted);
      }
    });
    done();
  });
});