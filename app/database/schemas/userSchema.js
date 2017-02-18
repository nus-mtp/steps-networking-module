var Schema = require("./schemaHeader.js");

var visitSchema = require("./visitSchema.js");
var participateSchema = require("./participateSchema.js");

var userSchema = new Schema({
    email: {
        type: String,
        index: { unique: true }
    },
    name: String,
    description: String,
    hashed_pw: String,

    will_notify: Boolean,
    is_deleted: Boolean,
    profile_picture: String,

    events_visited: [visitSchema],
    events_participated: [participateSchema]
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