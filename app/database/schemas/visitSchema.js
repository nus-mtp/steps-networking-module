var Schema = require("./schemaHeader.js");

var visitSchema = new Schema({
    event_id: Schema.Types.ObjectId,
    reason: String
});

module.exports = visitSchema;