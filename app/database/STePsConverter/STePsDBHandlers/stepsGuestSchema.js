const mongoose = require('mongoose');

const stepsGuestSchema = new mongoose.Schema({
    event: { type: String, ref: 'Event', required: true },
    ticket: { type: String, required: true },
    token: { type: String, required: true },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, index: true },
    isCheckedIn: { type: Boolean, default: false }
    // Votes will be a dynamic map with each key as module code
    // Dynamic fields
}, {
    // Dynamic fields for extra fields
    strict: false,
    autoIndex: true
});

stepsGuestSchema.index({ event: 1, token: 1 }, { unique: true });

module.exports = stepsGuestSchema;