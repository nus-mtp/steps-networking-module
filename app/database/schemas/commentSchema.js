var Schema = require("./schemaHeader.js");

var commentSchema = new Schema({
    user_email: String,
    exhibition: String,
    comment: String,
});

module.exports = commentSchema;