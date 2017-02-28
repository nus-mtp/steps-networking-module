const mongoose = require('mongoose');
const Constants = require('./stepsConstant.js');

const stepsUserSchema = new mongoose.Schema({
    _hashedPassword: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: [Constants.ROLE_ADMIN, Constants.ROLE_USER, Constants.ROLE_STAFF],
        default: Constants.ROLE_USER,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
        lowercase: true,
        trim: true,
    },
    matricId: { type: String, index: true },
    phone: { type: String, index: true },
    foodPreference: {
        type: String,
        enum: [Constants.VEGETARIAN_PREF, Constants.NON_VEGETARIAN_PREF],
        default: Constants.NON_VEGETARIAN_PREF,
    }
});

/**
 * Find single user by email
 * @param  { String } email [email of the user]
 * @return { Promise }       [promise of the query result]
 */
stepsUserSchema.statics.findOneByEmail = function(email) {
    return Promise.resolve(this.findOne({ email: email.toLowerCase() }).exec());
};

/**
 * Find list of users by list of emails
 * @param  { [String] } emails [list of emails]
 * @return { Promise }        [promise of the query results]
 */
stepsUserSchema.statics.findByEmails = function(emails) {
    return Promise.resolve(
        this.find({
            email: {
                $in: emails.map(s => s.toLowerCase())
            }
        })
    );
};

/**
 * Find single user by user ID
 * @param  { String } userId [id of the user]
 * @return { Promise }        [promise of the query result]
 */
stepsUserSchema.statics.findByUserId = function(userId) {
    return Promise.resolve(this.findById(userId).exec());
};

module.exports = stepsUserSchena;