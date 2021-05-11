const express = require("express");

var router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get("/", (req, res) => {
  res.render("register", {
    layout: "",
  });
  console.log("Register");
});

router.post("/", (req, res) => {
  insertUser(req, res);
});

router.get("/profile", (req, res) => {
  Post.find({ "author._id": req.session.userid }, (err, docs) => {
    var imgs = [];
    docs.forEach(function(doc){
      console.log("text: " + doc);
      if (doc.image) {
        var itemlist = {}
        var imag =
          "data:image/" +
          doc.image.contentType +
          ";base64," +
          doc.image.data.toString("base64");

        imgs.push({
          id: doc._id,
          image : imag,
          title : doc.title,
          caption : doc.caption,
          likes: doc.likes
        });
      }
    });
    res.render("profile", {
      account: req.session.details,
      images: imgs,
      edit: true
    });
  });
});

function insertUser(req, res) {
  var user = new User();
  user.fullname = req.body.fn;
  user.email = req.body.em;
  user.username = req.body.un;
  user.password = req.body.pw;

  user.save((err, doc) => {
    if (!err) {
      res.redirect("/useradd");
      console.log("User saved!");
    } else {
      console.log("Error saving user:" + err);
    }
  });
}

function loginUser(req, res) {
  var username = req.body.un;
  var password = req.body.pw;

  User.find({ username: username, password: password }).then(
    (doc) => {
      console.log("user match");
      console.log(username);

      res.render("profile", {
        username,
      });

      res.redirect("profile");
    },
    (err) => {
      res.send(err);
    }
  );
}

router.post("/login", (req, res) => {
  loginUser(req, res);
});

function checkValidLogin(req, res) {
  console.log("checking on user controlleere....");
  if (!req.session.userid) {
    res.redirect("/");
  }
}

module.exports = router;
