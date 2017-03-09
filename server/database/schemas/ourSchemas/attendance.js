const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: 'The Email of the User who posted this Comment is used as a Foreign Key, and is t' +
        'herefore Required.',
  },
  attendance_name: {
    type: String, // Event or Exhibition Name
    required: 'The Name of the Event or Exhibition for which this Comment is posted under is us' +
        'ed as a Foreign Key, and is therefore Required.',
  },
  attendance_type: {
    type: String,
    enum: [
      'exhibition', 'event',
    ],
    required: true,
  },
  reason: [
    {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
  ],
});

module.exports = attendanceSchema;