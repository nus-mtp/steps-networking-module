/*
    This file defines a function that returns a connection to a specified MongoDB database upon execution.
    Ensure that a MongoDB local server connection is running before executing.

    Note that running this script by itself will not terminate the process.
*/
const mongoose = require('mongoose');

module.exports.connect = (host, port, database) => {
  const db = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + database);

  db.on('error', (err) => {
    if (err) {
      throw err;
    }
  });

  db.once('open', () => {
    console.info('MongoDB ' + database + ' Connected Successfully.');
  });

  return db;
};
