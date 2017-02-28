const mongoose = require('mongoose');
const stepsProjectSchema = require('./stepsProjectSchema/');

const stepsProjectModel = mongoose.model(stepsProjectSchema);
const ObjectId = mongoose.Schema.Types.ObjectId;

const stepsModuleSchema = new mongoose.Schema({
    event: { type: String, ref: 'Event', required: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, index: true, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    creator: { type: ObjectId, ref: '_User', index: true, required: true },
    isApproved: { type: Boolean, index: true, required: true, default: false },
    students: { type: [{ type: ObjectId, ref: '_User', index: true }] },
    projects: { type: [stepsProjectModel] }
});

// Compound Index
stepsModuleSchema.index({ event: 1, code: 1 }, { unique: true });

module.exports = stepsModuleSchema;