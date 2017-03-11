const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_email: {
    type: String,
    trim: true,    
    required: 'The Email of the User who is attending the Event / Exhibition is used as a Foreign Key, and is t' +
        'herefore Required.',
  },
  attendance_type: {
    type: String,
    enum: [
      'exhibition', 'event',
    ],
    required: true,
  },
  attendance_name: {
    type: String, // Event or Exhibition Name
    trim: true,
    required: 'The Name of the Event or Exhibition for the User is attending is us' +
        'ed as a Foreign Key, and is therefore Required.',
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

attendanceSchema.index({ user_email: 1, attendance_type: 1, attendance_name: 1 }, { unique: true });

module.exports = attendanceSchema;
