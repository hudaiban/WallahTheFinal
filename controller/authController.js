const userDB = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

// create a new user of userDB
module.exports = {
  signup: (req, res) => {
    userDB.findOne({ email: req.body.email }).then((email) => {
      if (email) {
        return res.render("ReEmail.ejs");
      } else {
        userDB.findOne({ uniNumber: req.body.uniNumber }).then((id) => {
          if (id) {
            return res.render("ReId.ejs");
          } else {
            const newUser = new userDB({
              email: req.body.email,
              name: req.body.name,
              password: req.body.password,
              uniNumber: req.body.uniNumber,
            });
            console.log(newUser);
            //HASH the password
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                // set password to hashed
                newUser.password = hash;
                // save password
                newUser
                  .save()
                  .then((user) => {
                    res.redirect("/login");
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        });
      }
    });
  },
  login: passport.authenticate("local", {
    failureRedirect: "/relogin",
    successRedirect: "/dashboard",
  }),
  function(req, res) {
    res.redirect("/");
  },

  logout: function (req, res) {
    req.logout();
    res.redirect("/");
  },
};
