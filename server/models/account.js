var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String,
  email: String,
  description: String,
  will_notify: String,
  is_deleted: Boolean,
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
