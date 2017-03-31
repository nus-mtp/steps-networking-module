/**
 * This file defines a function that returns a connection
 * to a specified MongoDB database upon execution.
 *
 * Ensure that the specified MongoDB server connection is running before executing.
 *
 * Note that running this script by itself will not terminate the process.
 */
const mongoose = require('mongoose');

module.exports.connect = (mongoURI,
                          poolSize = 5, openCallback = () => {}, closeCallback = () => {}) => {
  const db = mongoose.createConnection(mongoURI, { server: { poolSize } });

  db.on('error', (err) => {
    if (err) {
      console.info(`MongoDB at ${mongoURI} has encountered a problem.`);
    }
  });

  db.once('open', (err) => {
    openCallback(err);
  });

  db.once('close', (err) => {
    closeCallback(err);
  });

  return db;
};
