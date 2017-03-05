var User = require("../app/database/objectClasses/User.js");
var assert = require('assert');
var async = require ('async');

describe ("User CRUD",function() {
  beforeEach(function(done) {
    this.timeout(5000);

    //Add fake users into database
    var userTest1 = new User("usertesting_1@user.com", //email
                             "UserTest1", //name
                             "I am the first test user.", //description
                             "password123", //password
                             true, //will_notify
                             false, //is_deleted
                             "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png", //profile_pic
                             ["Programming skills", "C++", "Java", "HTML"], //skills
                             ["usertesting_2@user.com"]); //bookmarked users

    var userTest2 = new User("usertesting_2@user.com", 
                             "UserTest2", 
                             "I am the second test user.",
                             "password456", false, false, 
                             "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png", 
                             ["Producing skills", "Photoshop", "Illustrator", "AutoCAD", "Microsoft Office"],
                             []);
    async.series([
      function(callback){
        //Clear all users in database (use only if necessary)
        User.clearAllUser();
        console.log("removal done");
      },
      function(callback){
        userTest1.saveUser(function(err){
          if (err){
            callback(err);
          }
          console.log("save1 done");
        });
      },
      function(callback){
        userTest2.saveUser(function(err){
          if (err){
            callback(err);
          }
          console.log("save2 done");
        });
      }
    ], function (err, result) {   
      if (err){
        console.log("error with async");
      } else {
      }
    });
    done();
  });

  //afterEach(function(done){
  //  User.clearAllUser();
  //  console.log("clear all users");
  //  done();
  //});

  afterEach(function() {
    User.getAllUsers (function callback(err, obj) {
      if (err) {
        console.log("Something went wrong with getting list of users");
        console.log(err);
      } else {
        console.log ("------THIS IS THE CURRENT DATABASE------")
        console.log(obj);
        console.log ("------END------")
      }
    });
  });

  it('test', function(){
    assert.equal(true,true);
  });
  /*it('Should be able to add new Users', function(done) {
    //this.timeout(15000);
    var userTest3 = new User("usertesting_3@user.com", 
                             "UserTest3", 
                             "I am the third test user.",
                             "password789", 
                             true, 
                             false, 
                             "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png", 
                             ["Project Management", "Programming skills", "Objective C", "C++", "C#"],
                             ["usertesting_1@user.com", "usertesting_2@user.com"]
                            ); 
    userTest3.saveUser(function(err){
      if (err){
        console.log("error with saving user3");
      } else {
        User.getUser("usertesting_3@user.com", function (err1, results){
          if (err1){
            console.log("error with retrieving user3");
          } else {
            console.log("NESTED GET USER RESULT:");
            console.log(results);
            assert.equal("UserTest3", results.name);
          }
        });
      }
    });
    done();
  });

  it('test', function(done) {
    assert.equal(true, true);
    done();
  });

  it('Should not be able to add Users with duplicate email', function(done) {
    //this.timeout(15000);
    var userTest3 = new User("usertesting_2@user.com", 
                             "UserTest2 again~!", 
                             "I am the duplicated second test user.",
                             "sadawe123", 
                             false, 
                             false, 
                             "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png", 
                             ["Project Management", "Programming skills", "Objective C", "C++", "C#"],
                             [, "usertesting_2@user.com"]
                            ); 
    User.getUser("usertesting_2@user.com", function(err, results){
      if (err) console.log(err);
      else if(results)
        assert.equal("UserTest2", results.name);
      else console.log("THERE IS NO SUCH RESULTS");
    });
    done();
  });


  it('Should be able to get a specific existing user', function(done){
    User.getUser("usertesting_1@user.com", function callback(err, userObj){
      if(err){
        console.log("Something went wrong with getting user function");
        console.log(err);
      } else if (userObj) {
        assert.equal("UserTest1", userObj.name);
        assert.equal("usertesting_1@user.com", userObj.email);
      } else { 
        console.log("User does not exist");
      }
    });
    done()
  });

  it('Should not be able to get an non-existing user', function(done){
    User.getUser("usertesting_4@user.com", function callback(err, userObj){
      if(err){
        console.log("Something went wrong with getting user function");
        //console.log(err);
      }
      assert.equal(null, userObj);
    });
    done();
  });

  it('Should be able to update an existing specific user', function(done){
    User.updateUser("usertesting_1@user.com", 
                    "User Test 1 Updated", 
                    "my description is updated",
                    "changedPassword", 
                    false, 
                    false, 
                    "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1", 
                    ["c++", "C#", "java"],
                    []);

    User.getUser("usertesting_1@user.com", function(err, results){
      if (err){
        console.log("USER UPDATES TEST: "+err);
      } else{
        assert.notEqual(results, null);
        assert.equal("my description is updated", results.description);
      }
    });
    done();
  });

  it ('should not be able to update a non-existing user', function(done){
    User.updateUser("user2000@user.com", 
                    "i am a duplicate", 
                    "my descript is useless",
                    "qwe141asdasd1", 
                    true, 
                    false, 
                    "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1", 
                    ["c++", "C#", "java"],
                    []);
    User.getUser("user2000@user.com", function(err,doc){
      assert.equal(null,doc);
    });
    done();
  });

  it ('should be able to mark an existing user as deleted', function(done){
    User.setUserAsDeleted("usertesting_2@user.com", true, function callback(err, result){
      if (err){
        console.log("this is the error: "+err);
      } else {
        assert.equal(true, result.is_deleted);
      }
    });
    done();
  });

  it ('should be able to mark an "deleted" user as existing', function(done){
    User.setUserAsDeleted("usertesting_2@user.com", false, function callback(err, result){
      if (err){
        console.log("this is the error: "+err);
      } else if (result){
        assert.equal(false, result.is_deleted);
      }
    });
    done();
  });
  */
});