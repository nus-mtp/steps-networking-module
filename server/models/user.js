var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  password: String,
  name: String,
  description: String,
  profilePicture: String,
  will_notify: String,
  is_deleted: Boolean,
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

UserSchema.pre('save', function saveHook(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  return bcrypt.genSalt(null, (saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, null, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }

      user.password = hash;

      return next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
