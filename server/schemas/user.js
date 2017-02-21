var mongoose = require('mongoose');
var db = require('../mongodbScripts/accessMongoDB');
var bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: { unique: true }
    },
    name: String,
    description: String,
    password: String,

    will_notify: Boolean,
    is_deleted: Boolean,
    profile_picture: String,

    skills: [String],
    bookmarked_users: [String]
});

userSchema.methods.get_id = function() {
    return this._id;
};

userSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function saveHook(next) {
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

module.exports = userSchema;