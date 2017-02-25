var mongoose = require('mongoose');

var attendanceSchema = new mongoose.Schema({
    user_email: String,
    name: String,
    type: String, // Event or Exhibition
    reason: [String],
});

module.exports = attendanceSchema;