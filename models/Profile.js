const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
  username: {
    type: String,
    required: true,
    maxlength: 10,
  },
  website: {
    type: String,
  },
  country: {
    type: String,
  },
  languages: {
    type: [String],
    required: true,
  },
  portfolio: {
    type: String,
  },
  workrole: [
    {
      role: {
        type: String,
        required: true,
      },
      company: {
        type: String,
      },
      country: {
        type: String,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      details: {
        type: String,
      },
    },
  ],
  social: {
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("Profile", ProfileSchema);
