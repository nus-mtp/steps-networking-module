const Exhibition = require('../server/database/objectClasses/Exhibition.js');
const assert = require('assert');

describe('Exhibition Create', () => {
  before((done) => {
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
      done();
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
      Exhibition.getExhibition('exhibitionTest3', (err, doc) => {
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
      done();
    });
  });


  it('Should be able to retrieve an existing object', () => {
    Exhibition.getExhibition('exhibitionTest2', (err, doc) => {
      if (err) {
        console.log('Unable to execute getExhibition function properly');
      }
      assert.equal(doc.exhibition_name, 'exhibitionTest2');
    });
  });

  it('Should not be able to retrieve a non-existing object', () => {
    Exhibition.getExhibition('exhibitionTest4', (err, doc) => {
      if (err) {
        console.log('Unable to execute getExhibition function properly');
      }
      assert.equal(doc, null);
    });
  });

  it('should be able to identify if its an existing exhibition', () => {
    Exhibition.isExistingExhibition('exhibitionTest2', (err, doc) => {
      if (err) {
        console.log('error with isExisting');
      } else {
        assert.equal(true, doc);
      }
    });

    Exhibition.isExistingExhibition('exhibitionTest4', (err, doc) => {
      if (err) {
        console.log('error with isExisting');
      } else {
        assert.equal(false, doc);
      }
    });
  });

  it('should be able to get a list of exhibitions by tag', () => {
    Exhibition.searchExhibitionsByTag('engineering', (err, results) => {
      if (err) {
        console.log('error with searching by tag unit test');
      } else {
        assert.notEqual(results, null);
      }
    });
  });

  it('should be able to get a list of exhibitions by event name', () => {
    Exhibition.searchExhibitionsByEvent('eventname2', (err, results) => {
      if (err) {
        console.log('error with searching by event unit test');
      } else {
        assert.notEqual(results, null);
      }
    });
  });
});

describe('Exhibition Update', () => {
  before((done) => {
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
      done();
    });
  });

  it('should be able to update an existing exhibition', (done) => {
    Exhibition.updateExhibition('exhibitionTest2',
                                'updated description',
                                'eventName2',
                                'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
                                ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
                                ['www.youtube.com', 'www.youtube.com'],
                                'url.com',
                                ['software engineering', 'android'],
                                (err) => {
                                  if (err) {
                                    console.log('unable to update');
                                  }
                                  Exhibition.getExhibition('exhibitionTest2', (err, obj) => {
                                    if (err) {
                                      console.log('unable to get exhibition in update existing unit test');
                                    }
                                    assert.equal('updated description', obj.exhibition_description);
                                    done();
                                  });
                                });
  });
});

describe('Exhibition Delete', () => {
  before((done) => {
    const testexhibition1 = new Exhibition('exhibitionTest1', 'description', new Date('October 13, 2014 11:13:00'), new Date('October 14, 2014 21:00:00'), 'NUS', 'map', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', ['game', 'software engineering']);
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
      done();
    });
  });

  it('should be able to remove an exhibition from the database', () => {
    Exhibition.deleteExhibition('exhibitionTest1', (err) => {
      if (err) {
        console.log(err);
      }

      // Checks to see if it's removed
      Exhibition.getExhibition('exhibitionTest1', (err, obj) => {
        if (err) {
          console.log('unable to get exhibition in update existing unit test');
        }
        assert.equal(null, obj);
      });
    });
  });
});
