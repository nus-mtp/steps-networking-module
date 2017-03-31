const config = process.env.TEST_DB;
const ModelHandler = require('../server/database/models/ourModels');
const User = require('../server/database/objectClasses/User.js');
const assert = require('assert');

let ModelHandlerObj;
describe('User Create', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    User.setDBConnection(ModelHandlerObj.getConnection());

    const userTest2 = new User(
            'usertesting_2@user.com',
            'UserTest2',
            'I am the second test user.',
            'password456', false, false,
            'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
            ['Producing skills', 'Photoshop', 'Illustrator', 'AutoCAD', 'Microsoft Office'],
            [],
        );
    userTest2.saveUser((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    User.clearAllUsers((err) => {
      if (err) {
        console.log(err);
      }

      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to add new Users', (done) => {
    const userTest3 = new User(
            'usertesting_3@user.com',
            'UserTest3',
            'I am the third test user.',
            'password789',
            true,
            false,
            'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
            ['Project Management', 'Programming skills', 'Objective C', 'C++', 'C#'],
            [],
        );
    userTest3.saveUser((err) => {
      if (err) {
        console.log('error with saving user3');
      } else {
        User.getUser('usertesting_3@user.com', (err1, results) => {
          if (err1) {
            console.log('error with retrieving user3');
          } else {
            assert.notEqual(results, null);
            assert.equal('UserTest3', results.name);
          }
          done();
        });
      }
    });
  });

  it('Should not be able to add Users with duplicate email', (done) => {
    const userTestDup = new User(
            'usertesting_2@user.com',
            'UserTest2 again~!',
            'I am the duplicated second test user.',
            'sadawe123',
            false,
            false,
            'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
            ['Project Management', 'Programming skills', 'Objective C', 'C++', 'C#'],
            [],
        );
    userTestDup.saveUser((err) => {
      if (err) {
                // duplicate error expected
      } else {
        User.getUser('usertesting_2@user.com', (err1, results) => {
          if (err1) {
            console.log(err);
          } else {
            assert.notEqual(results, null);
            assert.equal(results.name, 'UserTest2');
          }
        });
      }
      done();
    });
  });
});


describe('User Read', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    User.setDBConnection(ModelHandlerObj.getConnection());

    const userTest1 = new User(
            'usertesting_1@user.com', // email
            'UserTest1', // name
            'I am the first test user.', // description
            'password123', // password
            true, // will_notify
            false, // is_deleted
            'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', // profile_pic
            ['Programming skills', 'C++', 'Java', 'HTML'], // skills
            [], // bookmarked users
        );
    userTest1.saveUser((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    User.clearAllUsers((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to get a specific existing user', (done) => {
    User.getUser('usertesting_1@user.com', (err, userObj) => {
      if (err) {
        console.log('Something went wrong with getting user function');
        console.log(err);
      } else if (userObj) {
        assert.equal(userObj.name, 'UserTest1');
        assert.equal('usertesting_1@user.com', userObj.email);
      } else {
        console.log('User does not exist');
      }
      done();
    });
  });

  it('Should not be able to get an non-existing user', (done) => {
    User.getUser('usertesting_4@user.com', (err, userObj) => {
      if (err) {
        console.log('Something went wrong with getting user function');
                // console.log(err);
      } else {
        assert.equal(null, userObj);
      }
      done();
    });
  });
});


describe('User Update', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    User.setDBConnection(ModelHandlerObj.getConnection());

    const userTest1 = new User(
      'usertesting_1@user.com', // email
      'UserTest1', // name
      'I am the first test user.', // description
      'password123', // password
      true, // will_notify
      false, // is_deleted
      'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', // profile_pic
      ['Programming skills', 'C++', 'Java', 'HTML'], // skills
      [], //bookmarked users
    );

    const userTest2 = new User(
        'usertesting_2@user.com', // email
        'UserTest2', // name
        'I am the second test user.', // description
        'password123', // password
        true, // will_notify
        false, // is_deleted
        'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png', // profile_pic
        ['Programming skills', 'C++', 'Java', 'HTML'], // skills
        [], //bookmarked users
    );

    const save1 = new Promise((resolve, reject) => userTest1.saveUser((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }));

    const save2 = new Promise((resolve, reject) => userTest2.saveUser((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }));

    Promise.all([save1, save2])
        .then(() => {
          done();
        })
        .catch((errs) => {
          console.log(errs);
          done();
        });
  });

  after((done) => {
    User.clearAllUsers((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to do nothing', (done) => {
    done();
  });

  it('Should be able to update the profile picture of the user', (done) => {
    User.updateUserProfilePicture('usertesting_1@user.com', 'https://www.google.com', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.profile_picture, 'https://www.google.com');
      done();
    });
  });

  it('Should be able to update description of the user', (done) => {
    User.updateUserDescription('usertesting_1@user.com', 'edited description', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.description, 'edited description');
      done();
    });
  });

  it('Should be able to update notification settings of the user', (done) => {
    User.updateUserNotification('usertesting_1@user.com', false, (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.will_notify, false);
      done();
    });
  });

  it('Should not be able to push duplicates of skills into the user', (done) => {
    User.addSkillToUserSkills('usertesting_1@user.com', 'C++', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.skills.length, 4, result.skills.toString());
      done();
    });
  });

  it('Should be able to remove a specified skill from the user', (done) => {
    User.removeSkillFromUser('usertesting_1@user.com', 'C++', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.skills.length, 3, result.skills.toString());
      done();
    });
  });

  it('Should be able to set the skills for the user, without duplicates', (done) => {
    User.setSkillsForUser('usertesting_1@user.com', ['c++', 'C++', ' C++ ', ' C++', 'C++ '], (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.skills.length, 1, result.skills.toString());
      done();
    });
  });

  it('The changes should persist and not affect any other fields', (done) => {
    User.getUser('usertesting_1@user.com', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.profile_picture, 'https://www.google.com');
      assert.equal(result.description, 'edited description');
      assert.equal(result.will_notify, false);
      assert.equal(result.skills.length, 1, result.skills.toString());
      assert.equal(result.bookmarked_users.length, 0, result.bookmarked_users);
      done();
    });
  });

  it('Should not be able to push duplicate ids into the bookmarks of the user', (done) => {
    User.getUser('usertesting_2@user.com', (err, user) => {
      User.addBookmarkedUserForUser('usertesting_1@user.com', user._id, (err, result) => {
        User.addBookmarkedUserForUser('usertesting_1@user.com', user._id, (err, result) => {
          assert.equal(err, null, err);
          assert.notEqual(result, null);
          assert.equal(result.bookmarked_users.length, 1, result);
          done();
        });
      });
    });
  });

  it('Should not be able to remove a non-existing id of the user', (done) => {
    User.removeBookmarkedUserFromUser('usertesting_1@user.com', '58d5355af085642a0ec42ebe', (err, result) => {
      assert.equal(err, null, err);
      assert.notEqual(result, null);
      assert.equal(result.bookmarked_users.length, 1, result);
      done();
    });
  });

  it('Should be able to remove ids from the bookmarks of the user', (done) => {
    User.getUser('usertesting_2@user.com', (err, user) => {
      User.removeBookmarkedUserFromUser('usertesting_1@user.com', user._id, (err, result) => {
        assert.equal(err, null, err);
        assert.notEqual(result, null);
        assert.equal(result.bookmarked_users.length, 0, result);
        done();
      });
    });
  });

  it('Should be able to set the bookmarks for the user, without duplicates', (done) => {
    User.getUser('usertesting_2@user.com', (err, user) => {
      User.setBookmarksForUser('usertesting_1@user.com', [user._id, user._id], (err, result) => {
        assert.equal(err, null, err);
        assert.notEqual(result, null);
        assert.equal(result.bookmarked_users.length, 1, result);
        done();
      });
    });
  });

  it('Should be able to update an existing specific user', (done) => {
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
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                assert.notEqual(results, null);
                assert.equal('my description is updated', results.description);
              }
              done();
            });
  });

  it('Should not be able to update a non-existing user', (done) => {
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
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                assert.equal(null, results);
              }
              done();
            });
  });
});


describe('User Delete', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    User.setDBConnection(ModelHandlerObj.getConnection());

    const userTest2 = new User(
            'usertesting_2@user.com',
            'UserTest2',
            'I am the second test user.',
            'password456', false, false,
            'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
            ['Producing skills', 'Photoshop', 'Illustrator', 'AutoCAD', 'Microsoft Office'],
            []);
    userTest2.saveUser((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    User.clearAllUsers((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('should be able to mark an existing user as deleted', (done) => {
    User.setUserAsDeleted('usertesting_2@user.com', true, (err, result) => {
      if (err) {
        console.log(`this is the error: ${err}`);
      } else {
        assert.equal(true, result.is_deleted);
      }
      done();
    });
  });

  it('should be able to mark an "deleted" user as existing', (done) => {
    User.setUserAsDeleted('usertesting_2@user.com', false, (err, result) => {
      if (err) {
        console.log(`this is the error: ${err}`);
      } else if (result) {
        assert.equal(false, result.is_deleted);
      }
      done();
    });
  });
});
