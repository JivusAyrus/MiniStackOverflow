const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  profile_pic: {
    type: String,
    default: "https://images.app.goo.gl/QkyU1rjYVHYzc9xx7",
  },
});

module.exports = Person = mongoose.model("Person", PersonSchema);
