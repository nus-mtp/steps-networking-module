const config = process.env.TEST_DB_URI;
const ModelHandler = require('../server/database/models/ourModels');
const Exhibition = require('../server/database/objectClasses/Exhibition.js');
const assert = require('assert');

let ModelHandlerObj;
describe('Exhibition Create', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition('exhibitionTest1',
                                           'description',
                                           'testingEvent_1',
                                           'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
                                           ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
                                           ['www.youtube.com', 'www.youtube.com'],
                                           'url.com',
                                           ['game', 'software engineering'],
                                          );
    testexhibition1.saveExhibition((err) => {
      console.log('saving');
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to add a new Exhibition', (done) => {
    const testexhibition3 = new Exhibition('exhibitionTest3',
                                           'description of the exhib',
                                           'testingEvent_1',
                                           'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
                                           ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
                                           ['www.youtube.com', 'www.youtube.com'],
                                           'url.com',
                                           ['software engineering', 'android'],
                                          );
    testexhibition3.saveExhibition((err) => {
      if (err) {
        console.log(err);
      }
      Exhibition.getExhibition('testingEvent_1', 'exhibitionTest3', (err, doc) => {
        if (err) {
          console.log('Unable to execute getExhibition function properly');
        }
        assert.equal('exhibitionTest3', doc.exhibition_name);
        done();
      });
    });
  });
});


describe('Exhibition Read', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition2 = new Exhibition('exhibitionTest2',
                                           'This is another description',
                                           'eventName2',
                                           'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
                                           ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
                                           ['www.youtube.com', 'www.youtube.com'],
                                           'url.com',
                                           ['software engineering', 'android'],
                                          );
    testexhibition2.saveExhibition((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to retrieve an existing object', (done) => {
    Exhibition.getExhibition('eventName2', 'exhibitionTest2', (err, doc) => {
      if (err) {
        console.log('Unable to execute getExhibition function properly');
      } else {
        assert.equal(doc.exhibition_name, 'exhibitionTest2');
      }
      done();
    });
  });

  it('Should be able to retrieve an existing exhibition by its Id', (done) => {
    const initialQuery = new Promise((resolve, reject) => {
      Exhibition.getExhibition('eventName2', 'exhibitionTest2', (err, doc) => {
        if (err) {
          reject(err);
        } else if (doc) {
          resolve(doc);
        } else {
          reject(null);
        }
      });
    });

    initialQuery.then(
        (value) => {
          Exhibition.getExhibitionById(value._id, (err, doc) => {
            assert.equal(err, null);
            assert.notEqual(doc, null);
            assert.equal(value.event_name, doc.event_name);
            assert.equal(value.exhibition_name, doc.exhibition_name);
            done();
          });
        },
        (reason) => {
          assert.fail(reason);
          done();
        },
    );
  });

  it('Should not be able to retrieve a non-existing object', (done) => {
    Exhibition.getExhibition('eventName2', 'exhibitionTest4', (err, doc) => {
      if (err) {
        console.log('Unable to execute getExhibition function properly');
      } else {
        assert.equal(doc, null);
      }
      done();
    });
  });

  it('Should be able to identify if its an existing exhibition', (done) => {
    Exhibition.isExistingExhibition('eventName2', 'exhibitionTest2', (err, doc) => {
      if (err) {
        console.log('error with isExisting');
      } else {
        assert.equal(true, doc);
      }
      done();
    });
  });

  it('Should be able to identify if its an existing exhibition', (done) => {
    Exhibition.isExistingExhibition('eventName2', 'exhibitionTest4', (err, doc) => {
      if (err) {
        console.log('error with isExisting');
      } else {
        assert.equal(false, doc);
      }
      done();
    });
  });

  it('Should be able to get a list of exhibitions by tag', (done) => {
    Exhibition.searchExhibitionsByTag('engineering', (err, results) => {
      if (err) {
        console.log('error with searching by tag unit test');
      } else {
        assert.notEqual(results, null);
      }
      done();
    });
  });

  it('Should be able to get a list of exhibitions by event name', (done) => {
    Exhibition.searchExhibitionsByEvent('eventname2', (err, results) => {
      if (err) {
        console.log('error with searching by event unit test');
      } else {
        assert.notEqual(results, null);
      }
      done();
    });
  });
});


describe('Exhibition Update', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition2 = new Exhibition(
      'exhibitionTest2',
      'This is another description',
      'eventName2',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['software engineering', 'android'],
    );
    testexhibition2.saveExhibition((err) => {
      if (err) {
        console.log('Unable to save Exhibition obj');
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to set the tags for the exhibition, without duplicates', (done) => {
    Exhibition.setTagsForExhibition('eventName2', 'exhibitionTest2', ['Software Engineering', 'Android', 'Web MERN Stack'], (err, results) => {
      assert.equal(err, null, err);
      assert.notEqual(results, null, results);
      assert.equal(results.tags.length, 3, results.tags.toString(','));
      done();
    });
  });

  it('Should be able to update an existing exhibition', (done) => {
    Exhibition.updateExhibition('exhibitionTest2',
                                'updated description',
                                'eventName2',
                                'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
                                ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
                                ['www.youtube.com', 'www.youtube.com'],
                                'url.com',
                                ['software engineering', 'android'],
                                (err, result) => {
                                  if (err) {
                                    console.log('unable to update');
                                  }
                                  assert.equal('updated description', result.exhibition_description);
                                  done();
                                });
  });
});


describe('Exhibition Delete', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithUri(config);

    Exhibition.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'exhibitionTest2',
      'This is another description',
      'eventName2',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['software engineering', 'android'],
    );
    testexhibition1.saveExhibition((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Exhibition.clearAllExhibitions((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('Should be able to remove an exhibition from the database', (done) => {
    Exhibition.deleteExhibition('exhibitionTest1', (err) => {
      if (err) {
        console.log(err);
      }

      // Checks to see if it's removed
      Exhibition.getExhibition('eventName2', 'exhibitionTest1', (err, obj) => {
        if (err) {
          console.log('unable to get exhibition in update existing unit test');
        } else {
          assert.equal(null, obj);
        }
        done();
      });
    });
  });
});//* /
