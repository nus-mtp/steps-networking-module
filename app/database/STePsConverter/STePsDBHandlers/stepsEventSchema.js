const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const stepsEventSchema = new mongoose.Schema({
  isDefault: {
    type: Boolean,
    index: true,
    default: false,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  creator: {
    type: ObjectId,
    ref: '_User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  sponsors: [
    {
      type: {
        type: String,
      },
      rank: {
        type: Number,
      },
      members: [
        {
          name: {
            type: String,
          },
          description: {
            type: String,
          },
          imageUrl: {
            type: String,
          },
          pageUrl: {
            type: String,
          },
        },
      ],
    },
  ],
  schedules: [
    {
      time: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
  ],
  awards: {
    description: {
      type: String,
    },
    prizes: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  promote: {
    description: {
      type: String,
    },
    links: [
      {
        title: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  references: [
    {
      title: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  faqs: [
    {
      type: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],
  instructors: {
    type: [
      {
        type: ObjectId,
        ref: '_User',
        index: true,
      },
    ],
  },
  registration: {
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    tickets: [
      {
        key: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        startTime: {
          type: Date,
          required: true,
        },
        endTime: {
          type: Date,
          required: true,
        },
        isForExhibitor: {
          type: Boolean,
          default: false,
        },
        limit: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    additionalFormFields: [
      {
        key: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: 'true',
        },
        type: {
          type: String,
          required: true,
          default: 'text',
        },
        placeholder: {
          type: String,
          trim: 'true',
        },
        numOptions: {
          type: Number,
          default: 0,
        },
        options: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  vote: {
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    isResultPublished: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = stepsEventSchema;
