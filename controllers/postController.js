const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { post } = require("./userController");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
// const CustomComment = require('./../models/comment');
//require('./../models/comment');

var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

var currentusername;
var currentuid;

router.get("/", (req, res) => {
  checkValidLogin(req, res);
  initializeSession(req);
  res.render("new_post", {});
});

router.get("/feed", (req, res) => {
  checkValidLogin(req, res);
  initializeSession(req);
  Post.find({}, null, {sort: {date: -1}}, (err, docs) => {
    if (!err) {
      docs.forEach(function(doc, index){
        console.log("text: " + doc);
        if (doc.image) {
          var imag =
            "data:image/" +
            doc.image.contentType +
            ";base64," +
            doc.image.data.toString("base64");
  
          docs[index].img = imag;
        }
        docs[index].comments.forEach(function(comment, cindex){
          if(comment.author._id == req.session.details._id){
            docs[index].comments[cindex].show = true
          }
        });
        console.log("COMMENT: " + JSON.stringify(docs[index].comments));
      });
      res.render("feed", {
        posts: docs,
        username: req.session.details.username
      });
    } else {
      console.log("Error fetching posts" + err);
    }
  }).lean();
});


function getPosts(req, res) {
  Post.find({})
    .sort({ date: 1 })
    .exec(function (err, result) {
      var postObjects = [];

      result.forEach(function (doc) {
        postObjects.push(doc.toObject());
      });

      res.render("feed", { postModel: postObjects });
    });
}

function checkValidLogin(req, res) {
  console.log("checking,....");
  if (!req.session.userid) {
    res.redirect("/");
  }
}

function initializeSession(req) {
  User.findOne({ _id: req.session.userid }, function (err, obj) {
    currentusername = obj.fullname;
    currentuid = obj._id;
  });
}

module.exports = router;
