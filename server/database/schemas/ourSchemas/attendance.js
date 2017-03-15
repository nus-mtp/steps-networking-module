const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_email: {
    type: String,
    trim: true,    
    required: 'The Email of the User who is attending the Event / Exhibition is used as a Foreign Key, and is t' +
        'herefore Required.',
  },
  event_name: {
    type: String,
    trim: true,
    required: 'The Event that this User is attending is used as a Foreign Key, and it is therefore Required.', 
  },
  exhibition_names: [
    {
      type: String,
      trim: true,
    }
  ],
  reason: [
    {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
  ],
});

attendanceSchema.index({ user_email: 1, event_name: 1 }, { unique: true });

module.exports = attendanceSchema;
