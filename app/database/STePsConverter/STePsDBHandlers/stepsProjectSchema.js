const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const stepsProjectSchema = new mongoose.Schema({
    name: { type: String, index: true, required: true, trim: true, default: '' },
    description: { type: String, default: '' },
    urlLink: { type: String, default: '' },
    videoLink: { type: String, default: '' },
    posterLink: { type: String, default: '' },
    imageLinks: [{ type: String, default: '' }],
    members: { type: [{ type: ObjectId, ref: '_User', index: true }] },
});

module.exports = stepsProjectSchema;