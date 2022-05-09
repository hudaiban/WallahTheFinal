const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { redirect } = require("express/lib/response");
const bodyParser = require("body-parser");
const { json } = require("express");
const router = require("./routes/route");
const AdminRouter = require("./routes/Admin");
const VoteRouter = require("./routes/poll");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");

const cors = require("cors");

//passport
require("./config/passport")(passport);

dotenv.config({ path: "./config.env" });
process.on("unhandledRejection", (reason, promise) => {
  console.log(promise, "promise");
  console.log(reason, "reason");
});
// database connection
mongoose
  .connect(
    "mongodb+srv://Rescco:6U2P9hrQU9FMEUSQ@cluster0.236x3.mongodb.net/user?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err, "err from mongoose"));

//          [ middlelware ]
app.use(json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);
app.use("/vote", VoteRouter);
app.use("/Admin", AdminRouter);

// app.use("/vote/poll", poll);

//       [ express session ]
app.use(
  session({
    secret: "dinosaur and fish",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const port = process.env.PORT || 8080;
//Check if server works
app.listen(port, () => {
  console.log("Server working on port [3000]");
});
