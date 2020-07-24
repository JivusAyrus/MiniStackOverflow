const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
//Bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const questions = require("./routes/api/questions");
const passport = require("passport");

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

//MongoDb connection
const db = require("./setup/myurl").mongoURL;
//attempt to connect to the database
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database is successfully connected"))
  .catch((err) => {
    console.log(err);
  });

//Passport middleware
app.use(passport.initialize());

//config for jwt stratergies
require("./stratergies/jwtStratergy")(passport);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//actual routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", questions);

app.listen(port, () => {
  console.log(`Server running at port no ${port}`);
});
