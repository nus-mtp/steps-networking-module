var Schema = require("./schemaHeader.js");

var attendanceSchema = new Schema({
    user_email: String,
    name: String,
    type: String, // Event or Exhibition
    reason: [String],
});

module.exports = attendanceSchema;