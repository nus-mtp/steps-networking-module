var Schema = require("./schemaHeader.js");

var participateSchema = new Schema({
    exhibition_id: Schema.Types.ObjectId,
    reason: String
});

module.exports = participateSchema;