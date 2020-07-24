const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person model
const Person = require("../../models/Person");
//Load Profile model
const Profile = require("../../models/Profile");

//@route    -   GET /api/profile
//@desc     -   route for personal user profile
//@access   -   PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          res.status(400).json({ profilenotfound: "No profile found" });
        }
        res.json(profile);
      })
      .catch((err) => console.log("Error in profile route" + err));
  }
);

//@route    -   POST /api/profile
//@desc     -   route for saving or updating user profile
//@access   -   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages !== undefined) {
      profileValues.languages = req.body.languages.split(",");
    }
    //get social links
    profileValues.social = {};

    if (req.body.github) profileValues.social.github = req.body.github;
    if (req.body.linkedin) profileValues.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;

    //do Db stuff
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => console.log("Error while updating profile" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then((profile) => {
              //Username already exists
              if (profile) {
                res.status(400).json({ username: "Username already exists" });
              }
              new Profile(profileValues)
                .save()
                .then((profile) => res.json(profile))
                .catch((err) =>
                  console.log("Error while saving the user profile" + err)
                );
            })
            .catch((err) =>
              console.log(
                "Error while finding the profile using username" + err
              )
            );
        }
      })
      .catch((err) => console.log("Error while finding profile" + err));
  }
);

//@route    -   GET /api/profile/:username
//@desc     -   route for getting profile based on USERNAME
//@access   -   PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["fullname", "profile_pic"]) //the parameters, the first one is the reference that is the user in the profile model which refers to the person model and next can be an array or a single parameter which consists of the info which has to be populated
    .then((profile) => {
      if (!profile) {
        res.status(400).json({ usernotfound: "Username is invalid" });
      }
      res.json(profile);
    })
    .catch((err) => console.log("Error while finding the profile" + err));
});

//@route    -   GET /api/profile/find/everyone
//@desc     -   route for getting every profile
//@access   -   PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["fullname", "profile_pic"])
    .then((profiles) => {
      if (!profiles) {
        res.status(400).json({ usernotfound: "No users" });
      }
      res.json(profiles);
    })
    .catch((err) => console.log("Error while finding the profile" + err));
});

//@route    -   DELETE /api/profile
//@desc     -   route for deleting a user using his/her id
//@access   -   PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() =>
            res.json({ msg: "User sucessfully deleted", success: true })
          )
          .catch((err) => console.log("Error while deleting a user " + err));
      })
      .catch((err) =>
        console.log("Error while deleting a user profile " + err)
      );
  }
);

//@route    -   POST /api/profile/workrole
//@desc     -   route for adding workrole into the profile
//@access   -   PRIVATE
router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          res.status(400).json({ profilenotfound: "Profile doesnt exist" });
        }
        const newWork = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details,
        };
        profile.workrole.unshift(newWork);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => console.log("Error while adding the workrole" + err));
      })
      .catch((err) => console.log("Error while adding workrole" + err));
  }
);

//@route    -   DELETE /api/profile/workrole/:w_id
//@desc     -   route for deleting a workrole into the profile
//@access   -   PRIVATE
router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          res.status(400).json({ profilenotfound: "Profile doesnt exist" });
        }
        const index_del_id = profile.workrole
          .map((item) => item.id)
          .indexOf(req.params.w_id);
        profile.workrole.splice(index_del_id, 1);
        profile
          .save()
          .then((newProfile) => res.json(newProfile))
          .catch((err) => console.log("Error while deleting a workrole" + err));
      })
      .catch((err) => console.log(err));
  }
);
module.exports = router;
