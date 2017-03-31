const config = require('../server/config.json').fakeDbUri;
const ModelHandler = require('../server/database/models/ourModels');
const Exhibition = require('../server/database/objectClasses/Exhibition.js');
const Comment = require('../server/database/objectClasses/Comment.js');
const assert = require('assert');

let ModelHandlerObj;
describe('Comment Create', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Comment.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'MAMA! LAVA!',
      'description',
      'STEPS',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, results) => {
      if (err) {
        console.log(err, results);
      }
      const testcomment1 = new Comment(
        'user1@user.com',
        results._id,
        'awesome!',
        new Date('October 14, 2014 21:00:00'),
      );

      testcomment1.saveComment((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      Comment.clearAllComments((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('should be able to add a new message object', (done) => {
    // first retrieve exhibition ID
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        const testcomment2 = new Comment(
          'user2@user.com',
          result._id,
          'hey man thanks!',
          new Date('October 14, 2014 21:01:00'),
        );
        testcomment2.saveComment((err, result) => {
          if (err) {
            console.log(err);
          }
          // check that its inside the databse
          Comment.getCommentsForExhibition(result.exhibition_key, (err, commentObj) => {
            if (err) {
              console.log('error with getting comment for an event');
            } else {
              assert.equal(commentObj[1].comments[0].content, 'hey man thanks!');
            }
            done();
          });
        });
      }
    });
  });
});

describe('Comment Read', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Comment.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'EXI',
      'description',
      'EVENTNAME',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, results) => {
      if (err) {
        console.log(err, results);
      }
      const testcomment1 = new Comment('user1@user.com',
                                     results._id,
                                     'Could use work',
                                     new Date('October 14, 2014 21:00:00'),
                                    );

      testcomment1.saveComment((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      Comment.clearAllComments((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('Should be able to obtain comments from an existing exhibition', (done) => {
    // obtain _id of exhibition
    Exhibition.getExhibition('EVENTNAME', 'EXI', (err, results) => {
      if (err) {
        console.log('error with getting comment for an event');
        done();
      } else {
        Comment.getCommentsForExhibition(results._id, (err, commentObj) => {
          assert.equal(err, null, err);
          assert.equal(commentObj[0].comments[0].content, 'Could use work');
          done();
        });
      }
    });
  });

  it('Should not be able to obtain comments from a non-existing exhibition', (done) => {
    // non-existing exhibition means an invalid object ID
    Comment.getCommentsForExhibition(1234567, (err, commentObj) => {
      assert.equal(commentObj, null);
      done();
    });
  });
});

describe('Comment Update', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Comment.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'EXI',
      'description',
      'EVENTNAME',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, results) => {
      if (err) {
        console.log(err, results);
      }
      const testcomment1 = new Comment(
        'user4@user.com',
        results._id,
        'awesome!',
        new Date('October 14, 2014 21:00:00'),
      );

      testcomment1.saveComment((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      Comment.clearAllComments((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('should be able to append more comments into the object', (done) => {
    Exhibition.getExhibition('EVENTNAME', 'EXI', (err, results) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Comment.addCommentForExhibition(
          'user4@user.com',
          results._id,
          'I agree',
          new Date('October 14, 2014 22:20:20'),
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              assert.equal(results.comments[1].content, 'I agree');
            }
            done();
          });
      }
    });
  });
});
