const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email is a Primary Key, and is therefore Required.',
  },
  password: {
    type: String,
    required: 'Password is Required for Security Reasons.',
  },
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },

  will_notify: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  profile_picture: {
    type: String,
    default: '',
  },

  links: [
    {
      type: String,
      trim: true,
    },
  ],
  skills: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
  bookmarked_users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
  ],
});

userSchema.methods.get_id = () => this._id;

userSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function saveHook(next) {
  const user = this;

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

module.exports = userSchema;
