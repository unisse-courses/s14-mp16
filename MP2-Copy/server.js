require('./models/db');

var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const mongodb = require('mongodb');
    
var app = express();

const mongoClient = mongodb.MongoClient;
const databaseURL = "mongodb://localhost:27017/";
const dbname = "userDB";

const options = { useUnifiedTopology: true };

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

const userModel = require('./models/user.model');
const postModel = require('./models/post.model');

mongoClient.connect(databaseURL, options, function(err, client) {
  /**
    Only do database manipulation inside of the connection
    When a connection is made, it will try to make the database
    automatically. The collection(like a table) needs to be made.
  **/
  if (err) throw err;
  const dbo = client.db(dbname);

  //Will create a collection if it has not yet been made
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    client.close();
  });
});

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, '/views/'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 3000));

app.use('/user', userController);  
app.use('/post', postController);

app.engine( 'hbs', exphbs({
  extname: 'hbs', 
  defaultView: 'main',
  layoutsDir: path.join(__dirname, '/views/layouts'), 
  partialsDir: path.join(__dirname, '/views/partials'), 
}));

app.set('view engine', 'hbs');

//HOME ROUTE
app.get('/', function(req,res){
    res.render('login', {
        layout:''
    });
});

app.get('/login',(req,res)=>{
    res.render('login',{
        layout:''
    });
});

app.post('/log', function(req, res){
    var username = req.body.un
    var password = req.body.pw
    
    console.log(username);
    
    userModel.find({username:username, password:password}).then((doc)=>{
        console.log("user match");
        console.log(req.body.un);
        
        res.redirect('/feed');
        
    }, (err)=>{
        res.send(err)
    });      
});


//USER ROUTE
app.get('/user', function(req, res){
});

// POSTS ROUTE
//DOM creation script.js
//as soon as the postdb works, this should work:
//show all posts on the feed
app.get('/posts', function(req, res){
    postModel.find({}).sort({date: 1}).exec(function(err, result) {
        var postObjects = [];
        
        result.forEach(function(doc) {
            postObjects.push(doc.toObject());
        });
        
        res.render('posts', {postModel: postObjects});
    });
});

app.get('/new_post', function(req, res){
   res.render('new_post',{
//      content:'Shit works?'
   }) 
});

app.get('/profile', function(req, res){
   res.render('profile',{
//      content:'Shit works?'
   }) 
});

app.get('/feed', function(req, res){
   res.render('feed',{
       username: userModel.username,
       date: postModel.date,
   }) 
});

app.get('/register', function(req, res){
   res.render('register',{
       layout:''
//      content:'Shit works?'
   }) 
});

app.listen(app.get('port'), function(){
    console.log('server started on port', + app.get('port'));
});