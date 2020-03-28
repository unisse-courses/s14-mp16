const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");

const app = express();
const port = 3000;
const User = require("./db.js").User;
const Post = require("./db.js").Post;

const databaseURL = "mongodb://localhost:27017/simplixdb";
const options = { useNewUrlParser: true, useUnifiedTopology: true};

mongoose.Promise = global.Promise;
mongoose.connect(databaseURL, options);

const urlencoder = bodyparser.urlencoded({
    extended : false
});

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
}));

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', function(req,res){
    res.render('login', {
        layout:''
    });
});

app.get('/login', urlencoder, function(req,res){
    res.render('login', {
        layout:'',
    });
    
    var username = req.body.un;
    var password = req.body.pw;
    
    User.find({username:username, password:password}).then((doc)=>{
        console.log("user match")
        console.log(doc)
        
        req.session.un = username
        res.render("feed.hbs", {
            username
        })
        
    }, (err)=>{
        res.send(err)

    });
});

app.get('/feed', function(req, res){
   res.render('feed',{
   }) 
});

app.get('/new_post', function(req, res){
   res.render('new_post',{
//      content:'Shit works?'
   });
    /*
    console.log("ATTEMPT: Add new post");
    let post = new Post({
        
    })
    */
});

app.get('/profile', function(req, res){
   res.render('profile',{
   }) 
});



app.get('/feed', function(req, res){
   res.render('feed',{
   }) 
});

app.get('/register', urlencoder, function(req, res){
   res.render('register',{
       layout:''
   });
    
    var username = req.body.un;
    var password = req.body.pw;
    var email = req.body.em;
    var image = req.body.im;
    
    let user = new User({
        username : username,
        password: password,
        email: email,
        image: image
    });
    
    user.save().then((doc)=>{
        console.log(doc)
        req.session.username = doc.username
        res.render("feed.hbs", {
            username : doc.username
        })
    }, (err)=>{
        res.send(err)
    });
    
});

app.listen(port, function() {
  console.log('Server started on port '  + port)
});