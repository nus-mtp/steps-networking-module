/**
 * This file defines a function that returns a connection
 * to a specified MongoDB database upon execution.
 *
 * Ensure that the specified MongoDB server connection is running before executing.
 *
 * Note that running this script by itself will not terminate the process.
 */
const mongoose = require('mongoose');

module.exports.connect = (username, password, host, port, database) => {
  let loginCredentials = '';
  if (username !== '' || (username !== '' && password !== '')) {
    loginCredentials = `${username}:${password}@`;
  }

  const db = mongoose.createConnection(`mongodb://${loginCredentials}${host}:${port}/${database}`);

  db.on('error', (err) => {
    if (err) {
      throw err;
    }
  });

  db.once('open', () => {
    console.info(`MongoDB ${database} Connected Successfully.`);
  });

  return db;
};
