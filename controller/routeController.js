const { json } = require("express/lib/response");
const { handle } = require("express/lib/router");
const mongoose = require("mongoose");

const userDB = require("../models/user");
const users = userDB;
// -------
const Vote = require("../models/Vote");
const Pusher = require("pusher");

// pusher key
const pusher = new Pusher({
  appId: "1405655",
  key: "cc0c58d3cf68b7a04d70",
  secret: "dae5f0ee420e2e5015ca",
  cluster: "ap2",
  useTLS: true,
});

// --------
module.exports = {
  home: (req, res) => {
    res.render("index.ejs");
  },
  gpa: (req, res) => {
    res.render("gpa.ejs");
  },
  planner: (req, res) => {
    res.render("planner.ejs");
  },
  getVotes: (req, res) => {
    Vote.find().then((votes) => {
      res.json({ success: true, votes: votes });
    });
  },
  vote: (req, res) => {
    res.render("vote/vote");

    /*Vote.find().then((votes) => {
      res.json({ success: true, votes: votes });
    });*/
  },
  postVote: (req, res) => {
    const newVote = {
      Course: req.body.Course,
      points: 1, // try implement increament
    };

    new Vote(newVote).save().then((vote) => {
      pusher.trigger("Course-poll", "Course-vote", {
        points: parseInt(vote.points),
        Course: vote.Course,
      });

      return res.json({ success: true, message: "Thanks for voting" });
    });
  },
  login: (req, res) => {
    res.render("login.ejs");
  },
  relogin: (req, res) => {
    res.render("relogin.ejs");
  },
  register: (req, res) => {
    res.render("register.ejs");
  },
  dashbaord: (req, res) => {
    res.render("dashboard.ejs");
  },

  profile: (req, res) => {
    res.render("profile.ejs");
  },
  about: (req, res) => {
    res.render("about.ejs");
  },
  ErrorPage: (req, res) => {
    res.render("ErrorPage.ejs");
  },

  Admin: (req, res) => {
    users.find({}, (err, Users) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(Users);

        // res.render("admin/Admin.ejs", { Users });
        res.render("../views/admin/Admin.ejs", { Users });
      }
    });
  },
  UsersAdmin: (req, res) => {
    users.find({}, (err, Users) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(Users);
        res.render("../views/admin/users.ejs", { Users });
      }
    });
  },
  UserEdit: (req, res) => {
    res.render("../views/admin/index.ejs");
  },
};
