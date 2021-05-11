require("./models/db");

var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const handlebars = require("handlebars");
const mongodb = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const Comment = require("./models/comment");

var app = express();

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb+srv://simplixAdmin:admin1@simplix.zax3j.mongodb.net/SimplixDB?retryWrites=true&w=majority";
const dbname = "userDB";

const options = { useUnifiedTopology: true };

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

const userModel = require("./models/user.model");
const postModel = require("./models/post.model");

const mongoose = require("mongoose");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

var fs = require("fs");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

//mongoClient.connect(databaseURL, options, function (err, client) {
//  if (err) throw err;
//  const dbo = client.db(dbname);
//
//  //Will create a collection if it has not yet been made
//  dbo.createCollection("users", function (err, res) {
//    if (err) throw err;
//    console.log("Collection created for users!");
//    //    client.close();
//  });
//
//  dbo.createCollection("posts", function (err, res) {
//    if (err) throw err;
//    console.log("Collection created for posts!");
//    client.close();
//  });
//});

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodie

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")));

app.set("views", path.join(__dirname, "/views/"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(
  session({
    secret: "secretsecret",
    store: new MongoStore({ url: databaseURL}),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use("/user", userController);
app.use("/post", postController);

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultView: "main",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: path.join(__dirname, "/views/partials"),
  })
);

app.set("view engine", "hbs");

//HOME ROUTE
app.get("/", function (req, res) {
  if (req.session.userid) {
    console.log("already signed-in: ");
    res.redirect("/post/feed");
  } else {
    res.render("login", {
      layout: "",
    });
  }
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    console.log("session destroyed");
    res.redirect("/login");
  });
});

app.post("/log", function (req, res) {
  console.log("uname: " + req.body.un);
  console.log("upass: " + req.body.pw);
  var username = req.body.un;
  var password = req.body.pw;

  console.log(username);

  userModel.find(
    { username: username, password: password },
    function (err, docs) {
      if (docs.length == 0) {
        console.log("Invalid username or password. Please try again.");
        res.redirect("/login");
      } else {
        console.log("user match");
        if (!req.session.userid) {
          req.session.userid = docs[0]._id;
          req.session.details = docs[0];
          res.redirect("/post/feed");
        } else {
          console.log(req.session.userid + " does not exist");
          res.redirect("/post/feed");
        }
      }
    }
  );

  /*
    .then((doc)=>{
        console.log("user match");
        console.log(req.body.un);
        console.log(doc);
        
        res.redirect('/feed');
        
    }, (err)=>{
        console.log("no match");
        res.send(err)
    });      
    */
});

//USER ROUTE
app.get("/user", function (req, res) {});

// POSTS ROUTE
//show all posts on the feed
app.get("/posts", function (req, res) {
  res.redirect("/post/feed");
});

app.get("/new_post", function (req, res) {
  res.render("new_post", {});
});

app.get("/profile", function (req, res) {
  console.log(req.query.id);
  if (req.query.id == req.session.details._id) {
    res.redirect("/user/profile");
  } else {
    var details = {};
    User.find({ _id: req.query.id }, (err, docs) => {
      console.log("DOC: " + docs);
      details._id = docs[0]._id;
      details.fullname = docs[0].fullname;
      details.username = docs[0].username;
    });
    Post.find({ "author._id": req.query.id }, (err, docs) => {
      var imgs = [];
      docs.forEach(function (doc) {
        console.log("text: " + doc);
        if (doc.image) {
          var itemlist = {};
          var imag =
            "data:image/" +
            doc.image.contentType +
            ";base64," +
            doc.image.data.toString("base64");

          imgs.push({
            id: doc._id,
            image: imag,
            title: doc.title,
            caption: doc.caption,
            likes: doc.likes,
          });
        }
      });
      res.render("profile", {
        account: details,
        images: imgs,
        edit: false,
      });
    });
  }
});

app.get("/feed", function (req, res) {
  console.log(req.body.un);
  res.render("feed", {
    username: userModel.username,
    date: postModel.date,
  });
});

app.get("/register", function (req, res) {
  res.render("register", {
    layout: "",
  });
});

app.get("/useradd", (req, res) => {
  res.render("signupsuccess", {
    layout: "",
  });
});

app.post("/comment", (req, res) => {
  var currentuid = req.session.details;
  console.log("DEtails: " + req.session.details);
  Post.update(
    { _id: req.body.postid },
    {
      $push: {
        comments: {
          date: new Date(),
          comment: req.body.comment,
          author: currentuid,
        },
      },
    },
    { safe: true, upsert: true },
    function (err, result) {
      if (!err) {
        console.log("Post saved! + " + JSON.stringify(result));
        res.redirect("/post/feed");
      } else {
        console.log("Error saving post:" + err);
        res.redirect("/post/feed");
      }
    }
  );
  // Post.find({_id : req.body.postid}, function (err, docs) {
  //   docs[0].comments.push()
  //   Post.save((err, doc) => {
  //     if (!err) {
  //       console.log("Post saved!");
  //     } else {
  //       console.log("Error saving post:" + err);
  //     }
  //   });
  //res.render("profile", {});
});

app.post("/upload", upload.single("postpic"), (req, res, next) => {
  //console.log("yoooo");
  var post = new Post();
  post.title = req.body.titl;
  post.caption = req.body.cap;
  post.author = req.session.details;
  console.log("log: " + req.body.img);
  console.log("file: " + JSON.stringify(req.file));
  post.image.data = fs.readFileSync(
    path.join(__dirname + "/uploads/" + req.file.filename)
  );
  post.image.contentType = "image/png";
  //post.author = req.session.user;
  console.log("Posting with id: " + JSON.stringify(req.session.details));
  post.comments = [];
  post.likes = 0;

  post.save((err, doc) => {
    if (!err) {
      res.redirect("/post/feed");
      console.log("Post saved on the db!");
    } else {
      console.log("Failed to create post: " + err);
      req.flash(err, "Could not create post. Please try again.");
      res.redirect("new_post");
    }
  });
});

app.get("/like", (req, res) => {
  var id = req.query.id;
  Post.findById(id, function (err, post) {
    post.likes += 1;

    post.save(function (err) {
      res.redirect("post/feed");
    });
  });
});

app.get("/edit", (req, res) => {
  res.render("edit", {
    account: req.session.details,
  });
});

app.post("/edit", (req, res) => {
  console.log("post not edit" + req.body.uid);
  User.updateOne(
    { _id: req.body.uid },
    {
      username: req.body.uname,
      fullname: req.body.fname,
      email: req.body.email,
      password: req.body.pass,
    },
    { safe: true },
    function (err, result) {
      if (err) {
        console.log("Error saving post:" + err);
        res.redirect("/user/profile");
      }
    }
  );

  Post.updateMany(
    { "author._id": req.body.uid },
    {
      "author.username": req.body.uname,
      "author.fullname": req.body.fname,
    },
    { safe: true },
    function (err, result) {
      if (!err) {
        console.log("User saved + " + result);
        req.session.details.username = req.body.uname;
        req.session.details.fullname = req.body.fname;
        req.session.details.email = req.body.email;
        req.session.details.password = req.body.pass;
        res.redirect("/user/profile");
      } else {
        console.log("Error saving post:" + err);
        res.redirect("/user/profile");
      }
    }
  );
});

app.get("/deletepost", (req, res) => {
  Post.deleteOne({ _id: req.query.id }, function (err, result) {
    if (!err) {
      console.log("delete success");
      res.redirect("/user/profile");
    } else {
      console.log("delete failed");
      res.redirect("/user/profile");
    }
  });
});

app.get("/deletepost", (req, res) => {
  Post.deleteOne({ _id: req.query.id }, function (err, result) {
    if (!err) {
      console.log("delete success");
      res.redirect("/user/profile");
    } else {
      console.log("delete failed");
      res.redirect("/user/profile");
    }
  });
});

app.get("/editpost", (req, res) => {
  Post.findOne({ _id: req.query.id }, function (err, result) {
    if (err) {
      console.log("id not found");
      res.redirect("user/profile");
    } else {
      var imag =
        "data:image/" +
        result.image.contentType +
        ";base64," +
        result.image.data.toString("base64");
      res.render("edit_post", {
        id: result._id,
        title: result.title,
        caption: result.caption,
        img: imag,
      });
    }
  });
});

app.post("/editpost", (req, res) => {
  console.log("post not edit" + req.body.id);
  Post.updateOne(
    { _id: req.body.id },
    {
      title: req.body.title,
      caption: req.body.caption,
    },
    { safe: true },
    function (err, result) {
      if (err) {
        console.log("Error saving post:" + err);
        res.redirect("/user/profile");
      } else {
        console.log("success:" + result);
        res.redirect("/user/profile");
      }
    }
  );
});

app.get("/editcomment", (req, res) => {
  res.render("edit_comment", {
    uid: req.query.id,
    comment: req.query.comment,
    post: req.query.post,
  });
});

app.post("/editcomment", (req, res) => {
  Post.findOne({ _id: req.body.post }, (err, docs) => {
    docs.comments.forEach(function (comment, index) {
      console.log("ID: " + comment._id);
      if (comment._id == req.body.uid) {
        var query = "comments." + index + ".comment";
        console.log("QUE:" + query);
        Post.update(
          { _id: req.body.post },
          {
            $set: {
              [query]: req.body.comment,
            },
          },
          (err, res) => {
            if (err) {
              console.log("err: " + err);
            } else {
              console.log("res: " + res);
            }
          }
        );
        res.redirect("post/feed");
      }
    });
  });
});

app.get("/deletecomment", (req, res) => {
  console.log("DELE" + req.query.post)
  Post.findOne({ _id: req.query.post }, (err, docs) => {
    docs.comments.forEach(function (comment, index) {
      if (comment._id == req.query.id) {
        docs.comments.splice(index, 1);
        Post.update(
          { _id: req.query.post },
          {
            $set: {
              comments: docs.comments
            },
          },
          (err, res) => {
            if (err) {
              console.log("err: " + err);
            } else {
              console.log("res: " + res);
            }
          }
        );
        res.redirect("post/feed");
      }
    });
  });
});

app.listen(app.get("port"), function () {
  console.log("server started on port", +app.get("port"));
});

function checkLogin(res) {
  if (req.session.userid) {
    res.redirect("/post/feed");
  }
}

function convertIdToName(userid) {}
