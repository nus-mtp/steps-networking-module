var Schema = require("./schemaHeader.js");

var exhibitionSchema = new Schema({
    exhibition_name: String,
    exhibition_description: String,

    tags: [String]
});