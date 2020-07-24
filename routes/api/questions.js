const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person model
const Person = require("../../models/Person");
//Load Profile model
const Profile = require("../../models/Profile");
//Load Question model
const Question = require("../../models/Question");

//@route    -   POST /api/questions
//@desc     -   route for adding questions
//@access   -   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      user: req.user.id,
      ques: req.body.ques,
      code: req.body.code,
      name: req.user.fullname,
    });
    newQuestion
      .save()
      .then((question) => res.json(question))
      .catch((err) =>
        console.log("Unable to post the question on to the db" + err)
      );
  }
);

//@route    -   GET /api/questions
//@desc     -   route for getting all questions
//@access   -   PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then((questions) => res.json(questions))
    .catch((err) => console.log("No questions found" + err));
});

//@route    -   POST /api/questions/answers/:id  id of the question
//@desc     -   route for answering the questions
//@access   -   PRIVATE
router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then((question) => {
        const newAnswer = {
          ans_text: req.body.ans_text,
          user: req.user.id,
          name: req.user.fullname,
        };
        question.answers.unshift(newAnswer);
        question
          .save()
          .then((qna) => res.json(qna))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log("Error while adding answers" + err));
  }
);

//@route    -   POST /api/questions/upvotes/:id  id of the question
//@desc     -   route for upvoting the questions
//@access   -   PRIVATE
router.post(
  "/upvotes/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Question.findById(req.params.id)
          .then((question) => {
            if (question.que_upvotes.includes(req.user.id)) {
              const index_upvote = question.que_upvotes
                .map((item) => item)
                .indexOf(req.user.id);
              question.que_upvotes.splice(index_upvote, 1);
              question
                .save()
                .then((q) => res.json(q))
                .catch((err) => console.log(err));
            } else {
              if (question.que_downvotes.includes(req.user.id)) {
                const remove_id = question.que_downvotes
                  .map((item) => item)
                  .indexOf(req.user.id);
                question.que_downvotes.splice(remove_id, 1);
                question.que_upvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              } else {
                question.que_upvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              }
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//@route    -   POST /api/questions/downvotes/:id  id of the question
//@desc     -   route for downvoting the questions
//@access   -   PRIVATE
router.post(
  "/downvotes/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Question.findById(req.params.id)
          .then((question) => {
            if (question.que_downvotes.includes(req.user.id)) {
              const index_downvote = question.que_downvotes
                .map((item) => item)
                .indexOf(req.user.id);
              question.que_downvotes.splice(index_downvote, 1);
              question
                .save()
                .then((q) => res.json(q))
                .catch((err) => console.log(err));
            } else {
              if (question.que_upvotes.includes(req.user.id)) {
                const remove_id = question.que_upvotes
                  .map((item) => item)
                  .indexOf(req.user.id);
                question.que_upvotes.splice(remove_id, 1);
                question.que_downvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              } else {
                question.que_downvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              }
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//@route    -   POST /api/questions/answers/upvotes/:id&:ans_id  id of the question and answer
//@desc     -   route for upvoting the answers
//@access   -   PRIVATE
router.post(
  "/answers/upvotes/:id&:ans_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Question.findById(req.params.id)
          .then((question) => {
            const index_ans = question.answers
              .map((item) => item.id)
              .indexOf(req.params.ans_id);
            if (question.answers[index_ans].ans_upvotes.includes(req.user.id)) {
              const index_ans_upvote = question.answers[index_ans].ans_upvotes
                .map((item) => item)
                .indexOf(req.user.id);
              question.answers[index_ans].ans_upvotes.splice(
                index_ans_upvote,
                1
              );
              question
                .save()
                .then((q) => res.json(q))
                .catch((err) => console.log(err));
            } else {
              if (
                question.answers[index_ans].ans_downvotes.includes(req.user.id)
              ) {
                const remove_id = question.answers[index_ans].ans_downvotes
                  .map((item) => item)
                  .indexOf(req.user.id);
                question.answers[index_ans].ans_downvotes.splice(remove_id, 1);
                question.answers[index_ans].ans_upvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              } else {
                question.answers[index_ans].ans_upvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              }
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//@route    -   POST /api/questions/answers/downvotes/:id  id of the answer
//@desc     -   route for downvoting the answers
//@access   -   PRIVATE
router.post(
  "/answers/downvotes/:id&:ans_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        Question.findById(req.params.id)
          .then((question) => {
            const index_ans = question.answers
              .map((item) => item.id)
              .indexOf(req.params.ans_id);
            if (
              question.answers[index_ans].ans_downvotes.includes(req.user.id)
            ) {
              const index_ans_downvote = question.answers[
                index_ans
              ].ans_downvotes
                .map((item) => item)
                .indexOf(req.user.id);
              question.answers[index_ans].ans_downvotes.splice(
                index_ans_downvote,
                1
              );
              question
                .save()
                .then((q) => res.json(q))
                .catch((err) => console.log(err));
            } else {
              if (
                question.answers[index_ans].ans_upvotes.includes(req.user.id)
              ) {
                const remove_id = question.answers[index_ans].ans_upvotes
                  .map((item) => item)
                  .indexOf(req.user.id);
                question.answers[index_ans].ans_upvotes.splice(remove_id, 1);
                question.answers[index_ans].ans_downvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              } else {
                question.answers[index_ans].ans_downvotes.unshift(req.user.id);
                question
                  .save()
                  .then((que) => res.json(que))
                  .catch((err) => console.log(err));
              }
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
