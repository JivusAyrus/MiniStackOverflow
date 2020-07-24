const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jsonwt = require("jsonwebtoken");
const key = require("../../setup/myurl");
const mailer = require("nodemailer");
//Import the schema
const Person = require("../../models/Person");

//@route    -   GET /api/auth/
//@desc     -   testing
//@access   -   PUBLIC
router.get("/", (req, res) => {
  res.json({ text: "Auth is being tested" });
});

var transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: "ministackoverflow76@gmail.com",
    pass: "mini#stackoverflow",
  },
});

//@route    -   POST /api/auth/register
//@desc     -   Registration
//@access   -   PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then((person) => {
      if (person) {
        res
          .status(400)
          .json({ emailerror: "Email is already registered in our website" });
      } else {
        const newPerson = new Person({
          fullname: req.body.fullname,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            else {
              newPerson.password = hash;
              newPerson
                .save()
                .then((person) => {
                  res.json(person);
                  var mailOptions = {
                    from: "ministackoverflow76@gmail.com",
                    to: person.email,
                    subject: "Welcome to something similar to StackOverflow!",
                    html: "<h2>Thank You for registering on the website </h2>",
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("Email sent: " + info.response + " ");
                      res.json({
                        success: true,
                      });
                    }
                  });
                })
                .catch((err) => console.log(err));
            }
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

//@route    -   POST /api/auth/login
//@desc     -   Validate login
//@access   -   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Person.findOne({ email })
    .then((person) => {
      if (!person) {
        res
          .status(404)
          .json({ validationerror: "User not found,Please register first" });
      }
      bcrypt
        .compare(password, person.password)
        .then((isCorrect) => {
          if (isCorrect) {
            //res.json({ success: "true" });
            //use payload and create tokens for user
            const payload = {
              id: person._id,
              fullname: person.fullname,
              email: person.email,
            };
            jsonwt.sign(
              payload,
              key.secret,
              { expiresIn: 60 * 60 },
              (err, token) => {
                if (err) {
                  console.log(err);
                  res.json({
                    success: false,
                  });
                } else {
                  res.json({
                    success: "true",
                    token: "Bearer " + token,
                  });
                }
              }
            );
          } else {
            res
              .status(400)
              .json({ passworderror: "Password is invalid", success: "false" });
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

//@route    -   GET /api/auth/profile
//@desc     -   User Profile
//@access   -   PRIVATE
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
    });
  }
);

module.exports = router;
