// Comment out appropriate db based on which db is being used

let currentdb = '';

// Use this db in release
 currentdb = 'herokuDbUri';

// Use this db while in development
// currentdb = 'devDbUri';

module.exports = currentdb;
