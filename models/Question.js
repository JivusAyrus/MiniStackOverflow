const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
  ques: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  que_upvotes: [String],
  que_downvotes: [String],
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
      ans_text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      ans_upvotes: [String],
      ans_downvotes: [String],
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Question = mongoose.model("Question", QuestionSchema);
